import { DATE, STRING } from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

@Table({ tableName: 'patients' })
export class Patient extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: STRING })
  name: string;

  @Column({ type: STRING })
  birthDate: string;

  @Column({ type: DATE, field: 'created_at' })
  createdAt: Date;

  @Column({ type: DATE, field: 'updated_at' })
  updatedAt: Date;
}
