import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Visit } from '../../generated/prisma/client';
import {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  getPaginationSkipTake,
  PaginatedResponse,
  toPaginatedResponse,
} from '../common/dto/pagination-query.dto';
import { PrismaService } from 'src/prisma.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { GetVisitsQueryDto } from './dto/get-visits-query.dto';

const VISIT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

@Injectable()
export class VisitsService {
  constructor(private readonly prisma: PrismaService) {}

  async createVisit(dto: CreateVisitDto): Promise<Visit> {
    const timestamp = dto.dateTime ? new Date(dto.dateTime) : new Date();

    await this.assertNoConflict(dto.clinicianId, dto.patientId, timestamp);

    const data: Prisma.VisitCreateInput = {
      timestamp,
      clinician: { connect: { id: dto.clinicianId } },
      patient: { connect: { id: dto.patientId } },
      ...(dto.notes !== undefined && dto.notes !== '' && { notes: dto.notes }),
    };
    return this.prisma.visit.create({
      data,
      include: { clinician: true, patient: true },
    });
  }

  private async assertNoConflict(
    clinicianId: number,
    patientId: number,
    timestamp: Date,
  ): Promise<void> {
    const windowStart = new Date(timestamp.getTime() - VISIT_DURATION_MS);
    const windowEnd = new Date(timestamp.getTime() + VISIT_DURATION_MS);
    const timeFilter = { gt: windowStart, lt: windowEnd };

    const [clinicianConflict, patientConflict] = await Promise.all([
      this.prisma.visit.findFirst({
        where: { clinicianId, timestamp: timeFilter },
      }),
      this.prisma.visit.findFirst({
        where: { patientId, timestamp: timeFilter },
      }),
    ]);

    if (clinicianConflict) {
      throw new ConflictException(
        `Clinician already has a visit at ${clinicianConflict.timestamp.toISOString()}. Each visit blocks a 15-minute window.`,
      );
    }

    if (patientConflict) {
      throw new ConflictException(
        `Patient already has a visit at ${patientConflict.timestamp.toISOString()}. Each visit blocks a 15-minute window.`,
      );
    }
  }

  async getVisits(query?: GetVisitsQueryDto): Promise<PaginatedResponse<Visit>> {
    const where = this.buildWhere(query);
    const page = query?.page ?? DEFAULT_PAGE;
    const limit = query?.limit ?? DEFAULT_LIMIT;
    const { skip, take } = getPaginationSkipTake(page, limit);
    const [data, total] = await Promise.all([
      this.prisma.visit.findMany({
        where,
        include: { clinician: true, patient: true },
        orderBy: { timestamp: 'desc' },
        skip,
        take,
      }),
      this.prisma.visit.count({ where }),
    ]);
    return toPaginatedResponse(data, total, page, limit);
  }

  private buildWhere(query?: GetVisitsQueryDto): Prisma.VisitWhereInput {
    if (!query) return {};

    const conditions: Prisma.VisitWhereInput[] = [];

    if (query.clinicianId !== undefined) {
      conditions.push({ clinicianId: query.clinicianId });
    }
    if (query.patientId !== undefined) {
      conditions.push({ patientId: query.patientId });
    }
    if (query.fromDate !== undefined || query.toDate !== undefined) {
      const timestamp: Prisma.DateTimeFilter<'Visit'> = {};
      if (query.fromDate) timestamp.gte = new Date(query.fromDate);
      if (query.toDate) timestamp.lte = new Date(query.toDate);
      conditions.push({ timestamp });
    }
    if (query.search !== undefined && query.search.trim() !== '') {
      const term = query.search.trim();
      conditions.push({
        OR: [
          { notes: { contains: term } },
          {
            patient: {
              OR: [
                { firstName: { contains: term } },
                { lastName: { contains: term } },
                { email: { contains: term } },
              ],
            },
          },
          {
            clinician: {
              OR: [{ name: { contains: term } }, { email: { contains: term } }],
            },
          },
        ],
      });
    }

    if (conditions.length === 0) return {};
    if (conditions.length === 1) return conditions[0]!;
    return { AND: conditions };
  }
}
