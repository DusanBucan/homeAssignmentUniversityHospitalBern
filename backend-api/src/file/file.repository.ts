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

  async getAll(limit: number, offset: number): Promise<[File[], number]> {
    const { rows, count } = await this.fileModel.findAndCountAll({
      offset: offset,
      limit: limit,
    });
    return [rows, count];
  }
  getOneById(fileId: string): Promise<File | undefined> {
    return this.fileModel.findOne({ where: { id: fileId } });
  }
  save(filePath: string): Promise<File> {
    return this.fileModel.create({ filePath });
  }
}
