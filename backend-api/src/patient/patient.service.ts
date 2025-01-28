import { Inject, Injectable } from '@nestjs/common';
import { PATIENT_REPOSITORY } from './patient.constants';
import { PatientRepository } from './patient.repository.interface';
import { Patient } from './patient.model';

@Injectable()
export class PatientService {
  constructor(
    @Inject(PATIENT_REPOSITORY) private patientRepository: PatientRepository,
  ) {}

  async findOneById(patientId: string): Promise<Patient | null> {
    return this.patientRepository.findOneById(patientId);
  }

  async create(newPatient: Omit<Patient, 'id'>): Promise<Patient> {
    return this.patientRepository.create(newPatient);
  }
}
