import * as path from 'path';
import { Logger, NotFoundException } from '@nestjs/common';
import { createReadStream, createWriteStream, mkdirSync } from 'fs';
import { finished } from 'stream/promises';
import { Injectable } from '@nestjs/common';
import { ObjectStorageService } from './object-storage.interface';
import { LOCAL_FILESYSTEM_OBJECT_STORAGE_FOLDER } from './object-storage.constants';
import * as Upload from 'graphql-upload/Upload.js';
import { unlink, access, constants } from 'fs/promises';
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

  private readonly logger = new Logger(
    LocalFilesystemObjectStorageService.name,
  );

  constructor() {
    mkdirSync(this.UPLOAD_DIR, { recursive: true });
  }

  async create(object: Upload): Promise<Upload> {
    const fileName = `${Date.now()}_${object.filename}`;
    const filePath = path.join(this.UPLOAD_DIR, fileName);

    this.logger.log(`file path: ${filePath}`);

    const inStream = object.createReadStream();
    const outStream = createWriteStream(filePath);
    inStream.pipe(outStream);

    await finished(outStream)
      .then(() => {
        this.logger.log('file uploaded');
      })
      .catch((err) => {
        this.logger.error(err.message);
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
      this.logger.error(`Error reading file: ${err.message}`, err);
    } finally {
      return retVal;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await access(key, constants.F_OK); // constants.F_OK checks for file existence
      await unlink(key);
    } catch (err) {
      this.logger.error(`File delition failed: ${err.message}`, err);
    }
  }
}
