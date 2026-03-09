export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Clinician {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  visits?: Visit[];
}

export interface Patient {
  id: number;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  createdAt: string;
  updatedAt: string;
  visits?: Visit[];
}

export interface Visit {
  id: number;
  timestamp: string;
  notes: string | null;
  clinicianId: number;
  patientId: number;
  clinician?: Clinician;
  patient?: Patient;
}

export interface CreateClinicianDto {
  name: string;
  email: string;
  phone: string;
  specialty?: string;
  isActive?: boolean;
}

export interface CreatePatientDto {
  firstName: string;
  lastName?: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface CreateVisitDto {
  clinicianId: number;
  patientId: number;
  dateTime?: string;
  notes?: string;
}
