import { Patient } from './patient.model';

export interface CreatePatientInput {
  name: string;
  birthDate: string;
}

export interface PatientRepository {
  create(patient: CreatePatientInput): Promise<Patient>;
  findOneByNameAndBirthDate(
    name: string,
    birthDate: string,
  ): Promise<Patient | null>;
  findOneById(id: number): Promise<Patient | null>;
  delete(id: number): Promise<number>;
}
