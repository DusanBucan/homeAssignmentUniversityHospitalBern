import { Module } from '@nestjs/common';
import { Patient } from './patient.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { PATIENT_REPOSITORY } from './patient.constants';
import { SequelizePatientRepository } from './patients.repository';
import { PatientService } from './patient.service';

@Module({
  imports: [SequelizeModule.forFeature([Patient])],
  providers: [
    { provide: PATIENT_REPOSITORY, useClass: SequelizePatientRepository },
    PatientService,
  ],
  exports: [PatientService],
})
export class PatientModule {}
