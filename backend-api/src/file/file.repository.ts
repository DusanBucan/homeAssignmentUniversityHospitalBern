import { Injectable } from '@nestjs/common';
import { FileRepository } from './file.repository.interface';
import { File } from './file.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SequelizeFileRepository implements FileRepository {
  constructor(
    @InjectModel(File)
    private fileModel: typeof File,
  ) {}
  save(filePath: string): Promise<File> {
    return this.fileModel.create({ filePath });
  }
}
