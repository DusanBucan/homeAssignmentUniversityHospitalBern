import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import { FILE_REPOSITORY } from './file.constants';
import { FileRepository } from './file.repository.interface';
import { spawn } from 'child_process';
import * as Upload from 'graphql-upload/Upload.js';
import { ObjectStorageService } from '../object-storage/object-storage.interface';
import { OBJECT_STORAGE_SERVICE } from '../object-storage/object-storage.constants';
import { File } from './file.model';

interface A {}

@Injectable()
export class FileService {
  constructor(
    @Inject(FILE_REPOSITORY) private fileRepository: FileRepository,
    @Inject(OBJECT_STORAGE_SERVICE)
    private objectStorageService: ObjectStorageService,
  ) {}

  async getAll(limit: number, offset: number): Promise<[File[], number]> {
    return this.fileRepository.getAll(limit, offset);
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

    await dicomFileInput;

    try {
      filePath = await this.objectStorageService.create(dicomFileInput);
      const fileContent = await this.processFile(filePath);
      fileModel = await this.fileRepository.save(filePath);
    } catch (e) {
      if (filePath) {
        await this.objectStorageService.delete(filePath);
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
        dicomParserRootFolder,
        '../../dicom-parser-venv',
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
        shell: true,
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
          reject(
            new Error(errorOutput || `Python script failed with code ${code}`),
          );
        }
      });
    });
  }
}
