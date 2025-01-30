import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { FILE_REPOSITORY } from './file.constants';
import { FileRepository } from './file.repository.interface';
import { spawn } from 'child_process';
import * as Upload from 'graphql-upload/Upload.js';
import { ObjectStorageService } from '../object-storage/object-storage.interface';
import { OBJECT_STORAGE_SERVICE } from '../object-storage/object-storage.constants';
import { File } from './file.model';
import { ConfigService } from '@nestjs/config';
import { PatientService } from '../patient/patient.service';
import { SeriesService } from '../series/series.service';
import { Series } from '../series/series.model';
import { Patient } from '../patient/patient.model';

interface FileContent {
  PatientName: string;
  PatientBirthDate: string;
  SeriesDescription: string;
}

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    @Inject(FILE_REPOSITORY) private fileRepository: FileRepository,
    @Inject(OBJECT_STORAGE_SERVICE)
    private objectStorageService: ObjectStorageService,
    private configService: ConfigService,
    private patientService: PatientService,
    private seriesService: SeriesService,
  ) {}

  async getAll(pageSize: number, page: number): Promise<[File[], number]> {
    return await this.fileRepository.getAll(pageSize, page);
  }

  async get(id: string) {
    const fileEntry = await this.fileRepository.getOneById(id);
    if (!fileEntry) {
      throw new NotFoundException(
        `[FileService] - file with id ${id} not found`,
      );
    }
    const key = fileEntry.filePath;
    const dicomFile = await this.objectStorageService.get(key);
    return dicomFile;
  }

  async save(dicomFileInput: Upload): Promise<File> {
    let filePath: string | undefined;
    let fileModel: File | undefined;

    let series: Series | undefined;
    let patient: Patient | undefined;

    await dicomFileInput;

    try {
      filePath = await this.objectStorageService.create(dicomFileInput);
      const fileContent: FileContent = (await this.processFile(
        filePath,
      )) as unknown as FileContent;

      // creation of entites should be done in one transaction but let look on that as improvement
      // and talk during interview
      let patient = await this.patientService.findOneByNameAndBirthDate(
        fileContent.PatientName,
        fileContent.PatientBirthDate,
      );
      if (!patient) {
        patient = await this.patientService.create({
          name: fileContent.PatientName,
          birthDate: fileContent.PatientBirthDate,
        });
      }
      series = await this.seriesService.findOneByDescription(
        fileContent.SeriesDescription,
      );
      if (!series) {
        series = await this.seriesService.create({
          description: fileContent.SeriesDescription,
        });
      }

      fileModel = await this.fileRepository.save({
        filePath,
        patientId: patient.id,
        seriesId: series.id,
      });
      this.logger.log(`Successfully saved file at path: ${filePath}`);
    } catch (e) {
      this.logger.error(`Error while saving file: ${e.message}`, e);
      if (filePath) {
        await this.objectStorageService.delete(filePath);
      }
      if (series?.id) {
        await this.seriesService.delete(series.id);
      }
      if (patient?.id) {
        await this.patientService.delete(patient.id);
      }
      fileModel = undefined;
    } finally {
      return fileModel;
    }
  }

  private processFile(filePath: string): Promise<JSON> {
    return new Promise((resolve, reject) => {
      const dicomParserRootFolder = path.join(process.cwd(), './dicom-parser');
      const venvPath = path.join(
        this.configService.get('PYTHON_VENV_PATH'),
        '',
      );

      const activateEnv =
        process.platform === 'win32'
          ? `"${venvPath}\\Scripts\\activate.bat"` // Windows
          : `source ${venvPath}/bin/activate`; // Linux/macOS

      // Command to run the Poetry script
      const poetryCommand = 'poetry run parser';
      const fullCommand = `${activateEnv} && ${poetryCommand} "${filePath}"`;

      // Spawn the Python process
      const pythonProcess = spawn(fullCommand, {
        shell: process.platform === 'win32' ? true : '/bin/bash',
        cwd: dicomParserRootFolder,
        env: process.env,
      });

      let output = '';
      let errorOutput = '';

      // Collect the output from the Python script
      pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
      });

      // Collect any error output from the Python script
      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });

      // Handle the Python process exit
      pythonProcess.on('close', (code) => {
        if (code === 0) {
          const retVal = JSON.parse(output);
          resolve(retVal);
        } else {
          this.logger.error(
            errorOutput || `Python script failed with code ${code}`,
          );
          reject(
            new Error(errorOutput || `Python script failed with code ${code}`),
          );
        }
      });
    });
  }
}
