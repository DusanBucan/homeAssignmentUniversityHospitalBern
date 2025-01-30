import { Injectable } from '@nestjs/common';
import {
  CreateNewFileInput,
  FileRepository,
} from './file.repository.interface';
import { File } from './file.model';
import { InjectModel } from '@nestjs/sequelize';
import { Patient } from 'src/patient/patient.model';
import { Series } from 'src/series/series.model';

@Injectable()
export class SequelizeFileRepository implements FileRepository {
  constructor(
    @InjectModel(File)
    private fileModel: typeof File,
  ) {}

  async getAll(limit: number, offset: number): Promise<[File[], number]> {
    const { rows, count } = await this.fileModel.findAndCountAll({
      include: [Patient, Series],
      offset: offset * limit,
      limit: limit,
    });
    return [rows, count];
  }
  getOneById(fileId: string): Promise<File | undefined> {
    return this.fileModel.findOne({
      where: { id: fileId },
      include: [Patient, Series],
    });
  }
  save(createNewFile: CreateNewFileInput): Promise<File> {
    return this.fileModel.create({
      filePath: createNewFile.filePath,
      seriesId: createNewFile.seriesId,
      patientId: createNewFile.patientId,
    });
  }
}
