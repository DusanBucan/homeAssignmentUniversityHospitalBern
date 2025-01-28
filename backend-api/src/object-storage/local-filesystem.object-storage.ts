import * as path from 'path';
import { NotFoundException } from '@nestjs/common';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { finished } from 'stream/promises';
import { Injectable } from '@nestjs/common';
import { ObjectStorageService } from './object-storage.interface';
import { LOCAL_FILESYSTEM_OBJECT_STORAGE_FOLDER } from './object-storage.constants';
import * as Upload from 'graphql-upload/Upload.js';
import { readFile, unlink, access, constants } from 'fs/promises';
import { Readable } from 'stream';

@Injectable()
export class LocalFilesystemObjectStorageService
  implements ObjectStorageService
{
  private UPLOAD_DIR = path.join(
    process.cwd(),
    '../',
    LOCAL_FILESYSTEM_OBJECT_STORAGE_FOLDER,
    `dicom_images`,
  );

  constructor() {
    mkdirSync(this.UPLOAD_DIR, { recursive: true });
  }

  async create(object: Upload): Promise<Upload> {
    const fileName = `${Date.now()}_${object.filename}`;
    const filePath = path.join(this.UPLOAD_DIR, fileName);

    console.log(`file path: ${filePath}`); //TODO: replace with logger

    const inStream = object.createReadStream();
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

  async get(key: string): Promise<Readable | undefined> {
    let retVal = undefined;
    try {
      await access(key, constants.F_OK);
      retVal = createReadStream(key);
    } catch (err) {
      console.error('Error reading file:', err);
    } finally {
      return retVal;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await access(key, constants.F_OK); // constants.F_OK checks for file existence
      await unlink(key);
    } catch (err) {
      console.log('File does not exist');
    }
  }
}
