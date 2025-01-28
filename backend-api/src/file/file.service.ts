import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { createWriteStream, mkdirSync } from 'fs';
import path, { join } from 'path';
import { finished } from 'stream/promises';
import { DICOMFileInput } from './graphql/types/file.input';
import { FILE_REPOSITORY, FILE_STORAGE_FOLDER } from './file.constants';
import { FileRepository } from './file.repository.interface';
import { spawn } from 'child_process';


@Injectable()
export class FileService {
  constructor(
    @Inject(FILE_REPOSITORY) private fileRepository: FileRepository,
  ) {}

  async save(dicomFileInput: DICOMFileInput): Promise<any> {
    const filePaths = await Promise.all(
      dicomFileInput.files.map(async (image, index) => {
        const imageFile: any = await image;
        const fileName = `${Date.now()}_${index}_${imageFile.filename}`;
        const uploadDir = join(FILE_STORAGE_FOLDER, `dicom_images`);
        const filePath = await this.storeFileOnDisc(
          imageFile.createReadStream,
          uploadDir,
          fileName,
        );
        return filePath;
      }),
    );

    for (let filePath of filePaths) {
      const fileContent = await this.processFile(filePath, "")
      // on error it should remove file from file_storage
      this.fileRepository.save(filePath);
    }
  }

  private processFile(filePath: string, pythonDicomParserScript: string): Promise<JSON> {
    return new Promise((resolve, reject) => {
        const pythonScriptPath = path.join(__dirname, pythonDicomParserScript);

        // Spawn the Python process
        const pythonProcess = spawn('python3', [pythonScriptPath, filePath]);

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
                const retVal = JSON.parse(output)
                resolve(retVal);
            } else {
                // If there's an error, reject the promise with the error output
                reject(new Error(errorOutput || `Python script failed with code ${code}`));
            }
        });
    });
  }

  private async storeFileOnDisc(
    readStream: any,
    uploadDir: string,
    fileName: string,
  ): Promise<string> {
    const filePath = join(uploadDir, fileName);
    console.log(`file path: ${filePath}`); //TODO: replace with logger
    mkdirSync(uploadDir, { recursive: true });
    const inStream = readStream();
    const outStream = createWriteStream(filePath);
    inStream.pipe(outStream);
    await finished(outStream)
      .then(() => {
        console.log('file uploaded');
      })
      .catch((err) => {
        console.log(err.message);
        throw new NotFoundException(err.message);
      });
    return filePath;
  }
}
