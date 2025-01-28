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

  @Column({ type: STRING, field: 'file_path' })
  filePath: string;

  @Column({ type: DATE, field: 'file_created_date' })
  fileCreatedDate: Date;

  @Column({ type: DATE, field: 'created_at' })
  createdAt: Date;

  @Column({ type: DATE, field: 'updated_at' })
  updatedAt: Date;

  //TODO: add relation with other models
}
