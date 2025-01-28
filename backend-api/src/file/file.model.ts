import { DATE, STRING } from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'files' })
export class File extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column({ type: STRING })
  filePath: string;

  @Column({ type: DATE })
  createdDate: Date;

  //TODO: add relation with other models
}
