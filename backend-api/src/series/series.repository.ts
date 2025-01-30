import { Injectable } from '@nestjs/common';
import {
  SeriesCreateInput,
  SeriesReposity,
} from './series.repository.interface';
import { Series } from './series.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SequelizeSeriesRepository implements SeriesReposity {
  constructor(
    @InjectModel(Series)
    private seriesModel: typeof Series,
  ) {}

  delete(id: number): Promise<number> {
    return this.seriesModel.destroy({ where: { id } });
  }
  async findOneByDescription(description: string): Promise<Series | null> {
    return this.seriesModel.findOne({ where: { description: description } });
  }
  async create(newSeries: SeriesCreateInput): Promise<Series> {
    return this.seriesModel.create({ ...newSeries });
  }
}
