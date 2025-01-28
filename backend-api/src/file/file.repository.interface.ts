import { File } from './file.model';

export interface FileRepository {
  save(filePath: string): Promise<File>;
  getAll(limit: number, offset: number): Promise<[File[], number]>;
  getOneById(fileId: string): Promise<File | undefined>;
}
