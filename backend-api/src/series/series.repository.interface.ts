import { Series } from './series.model';

export interface SeriesCreateInput {
  description: string;
}

export interface SeriesReposity {
  findOneByDescription(description: string): Promise<Series | null>;
  create(newSeries: SeriesCreateInput): Promise<Series>;
  delete(id: number): Promise<number>;
}
