import { Patient } from './patient.model';

export interface PatientRepository {
  create(patient: Omit<Patient, 'id'>): Promise<Patient>;
  findOneById(id: string): Promise<Patient | null>;
}
