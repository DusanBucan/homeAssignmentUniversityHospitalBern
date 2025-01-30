import {
  Column,
  Model,
  Table,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  DataType,
} from 'sequelize-typescript';
import { Patient } from 'src/patient/patient.model';
import { Series } from 'src/series/series.model';

@Table({ tableName: 'files' })
export class File extends Model<File> {
  @PrimaryKey
  @AutoIncrement
  @Column({ type: DataType.INTEGER })
  id: number;

  @Column({ type: DataType.STRING, field: 'file_path' })
  filePath: string;

  @ForeignKey(() => Patient)
  @Column({ type: DataType.INTEGER, field: 'patient_id' })
  patientId: number;

  @ForeignKey(() => Series)
  @Column({ type: DataType.INTEGER, field: 'series_id' })
  seriesId: number;

  @BelongsTo(() => Patient)
  patient: Patient;

  @BelongsTo(() => Series)
  series: Series;

  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt: Date;

  @Column({ type: DataType.DATE, field: 'updated_at' })
  updatedAt: Date;
}
