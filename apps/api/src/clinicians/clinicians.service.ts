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
import { Clinician } from '../../generated/prisma/client';
import { CreateClinicianDto } from './dto/create-clinician.dto';
import { UpdateClinicianDto } from './dto/update-clinician.dto';

@Injectable()
export class CliniciansService {
  constructor(private readonly prisma: PrismaService) {}

  async getClinicians(query?: PaginationQueryDto): Promise<PaginatedResponse<Clinician>> {
    const page = query?.page ?? DEFAULT_PAGE;
    const limit = query?.limit ?? DEFAULT_LIMIT;
    const { skip, take } = getPaginationSkipTake(page, limit);
    const [data, total] = await Promise.all([
      this.prisma.clinician.findMany({
        include: { visits: true },
        skip,
        take,
      }),
      this.prisma.clinician.count(),
    ]);
    return toPaginatedResponse(data, total, page, limit);
  }

  async getClinician(id: number): Promise<Clinician> {
    const clinician = await this.prisma.clinician.findUnique({
      where: { id },
      include: { visits: true },
    });
    if (!clinician) {
      throw new NotFoundException('Clinician not found');
    }
    return clinician;
  }

  async createClinician(dto: CreateClinicianDto): Promise<Clinician> {
    const data = {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      specialty: dto.specialty ?? 'General',
      isActive: dto.isActive ?? true,
    };
    return this.prisma.clinician.create({ data });
  }

  async updateClinician(id: number, dto: UpdateClinicianDto): Promise<Clinician> {
    await this.getClinician(id);
    const data = {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.specialty !== undefined && { specialty: dto.specialty }),
      ...(dto.isActive !== undefined && { isActive: dto.isActive }),
    };
    return this.prisma.clinician.update({ where: { id }, data });
  }

  async deleteClinician(id: number): Promise<Clinician> {
    await this.getClinician(id);
    return this.prisma.clinician.delete({ where: { id } });
  }
}
