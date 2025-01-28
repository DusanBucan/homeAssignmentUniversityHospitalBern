import * as Upload from 'graphql-upload/Upload.js';
import { Readable } from 'stream';

export interface ObjectStorageService {
  get(key: string): Promise<Readable | undefined>;
  create(object: Upload): Promise<string>;
  delete(key: string): Promise<void>;
}
