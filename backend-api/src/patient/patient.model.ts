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
  @Column({ type: DataType.INTEGER})
  id: string;

  @Column({ type: STRING })
  name: string;

  @Column({ type: DATE })
  createdDate: Date;
}
