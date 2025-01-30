import { Module } from '@nestjs/common';
import { SeriesService } from './series.service';
import { SERIES_REPOSITORY } from './series.constants';
import { SequelizeSeriesRepository } from './series.repository';
import { Series } from './series.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Series])],
  providers: [
    SeriesService,
    {
      provide: SERIES_REPOSITORY,
      useClass: SequelizeSeriesRepository,
    },
  ],
  exports: [SeriesService],
})
export class SeriesModule {}
