import { Inject, Injectable } from '@nestjs/common';
import { PATIENT_REPOSITORY } from './patient.constants';
import {
  CreatePatientInput,
  PatientRepository,
} from './patient.repository.interface';
import { Patient } from './patient.model';

@Injectable()
export class PatientService {
  constructor(
    @Inject(PATIENT_REPOSITORY) private patientRepository: PatientRepository,
  ) {}

  async findOneById(patientId: number): Promise<Patient | null> {
    return this.patientRepository.findOneById(patientId);
  }

  async findOneByNameAndBirthDate(
    name: string,
    birthDate: string,
  ): Promise<Patient | null> {
    return this.patientRepository.findOneByNameAndBirthDate(name, birthDate);
  }

  async create(newPatient: CreatePatientInput): Promise<Patient> {
    return this.patientRepository.create(newPatient);
  }

  async delete(id: number): Promise<void> {
    await this.patientRepository.delete(id);
  }
}
