import { File } from './file.model';

export interface FileRepository {
  save(filePath: string): Promise<File>;
}
