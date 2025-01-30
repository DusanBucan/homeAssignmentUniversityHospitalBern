import { Inject, Injectable } from '@nestjs/common';
import {
  SeriesCreateInput,
  SeriesReposity,
} from './series.repository.interface';
import { Series } from './series.model';
import { SERIES_REPOSITORY } from './series.constants';

@Injectable()
export class SeriesService {
  constructor(
    @Inject(SERIES_REPOSITORY) private seriesRepository: SeriesReposity,
  ) {}

  async findOneByDescription(description: string): Promise<Series | null> {
    return this.seriesRepository.findOneByDescription(description);
  }

  async create(newSeries: SeriesCreateInput): Promise<Series> {
    return this.seriesRepository.create(newSeries);
  }

  async delete(id: number): Promise<void> {
    await this.seriesRepository.delete(id);
  }
}
