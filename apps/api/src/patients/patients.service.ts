import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  getPaginationSkipTake,
  PaginatedResponse,
  PaginationQueryDto,
  toPaginatedResponse,
} from '../common/dto/pagination-query.dto';
import { PrismaService } from 'src/prisma.service';
import { Patient } from '../../generated/prisma/client';
import { CreatePatientDto } from './dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPatients(query?: PaginationQueryDto): Promise<PaginatedResponse<Patient>> {
    const page = query?.page ?? DEFAULT_PAGE;
    const limit = query?.limit ?? DEFAULT_LIMIT;
    const { skip, take } = getPaginationSkipTake(page, limit);
    const [data, total] = await Promise.all([
      this.prisma.patient.findMany({
        include: { visits: true },
        skip,
        take,
      }),
      this.prisma.patient.count(),
    ]);
    return toPaginatedResponse(data, total, page, limit);
  }

  async createPatient(dto: CreatePatientDto): Promise<Patient> {
    const data = {
      firstName: dto.firstName,
      lastName: dto.lastName ?? null,
      email: dto.email,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      gender: dto.gender,
      address: dto.address ?? null,
      city: dto.city ?? null,
      state: dto.state ?? null,
      zip: dto.zip ?? null,
    };
    return this.prisma.patient.create({ data });
  }

  async getPatient(id: number): Promise<Patient> {
    const patient = await this.prisma.patient.findUnique({ where: { id } });
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }
    return patient;
  }
}
