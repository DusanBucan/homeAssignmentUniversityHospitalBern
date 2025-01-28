import { Injectable } from '@nestjs/common';
import { Patient } from './patient.model';
import { PatientRepository } from './patient.repository.interface';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class SequelizePatientRepository implements PatientRepository {
  constructor(
    @InjectModel(Patient)
    private patientModel: typeof Patient,
  ) {}

  create(patient: Omit<Patient, 'id'>): Promise<Patient> {
    return this.patientModel.create(patient);
  }

  findOneById(id: string): Promise<Patient | null> {
    return this.patientModel.findOne({ where: { id } });
  }
}
