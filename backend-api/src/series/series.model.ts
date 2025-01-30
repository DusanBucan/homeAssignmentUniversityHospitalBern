import { DATE, STRING } from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'series' })
export class Series extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: STRING })
  description: string;

  @Column({ type: DATE, field: 'created_at' })
  createdAt: Date;

  @Column({ type: DATE, field: 'updated_at' })
  updatedAt: Date;
}
