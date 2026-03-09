import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VisitsService } from './visits.service';
import { CreateVisitDto } from './dto/create-visit.dto';
import { GetVisitsQueryDto } from './dto/get-visits-query.dto';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  async create(@Body() dto: CreateVisitDto) {
    return this.visitsService.createVisit(dto);
  }

  @Get()
  async getVisits(@Query() query: GetVisitsQueryDto) {
    return this.visitsService.getVisits(query);
  }
}
