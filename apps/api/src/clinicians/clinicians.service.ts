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
}
