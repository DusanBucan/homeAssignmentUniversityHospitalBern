import { DATE, STRING } from 'sequelize';
import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({ tableName: 'patients' })
export class Patient extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column({ type: STRING })
  name: string;

  @Column({ type: DATE })
  createdDate: Date;
}
