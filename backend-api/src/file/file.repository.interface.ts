import { File } from './file.model';

export interface CreateNewFileInput {
  filePath: string;
  patientId: number;
  seriesId: number;
}

export interface FileRepository {
  save(newFile: CreateNewFileInput): Promise<File>;
  getAll(limit: number, offset: number): Promise<[File[], number]>;
  getOneById(fileId: string): Promise<File | undefined>;
}
