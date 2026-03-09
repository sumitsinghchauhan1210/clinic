import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { CliniciansService } from './clinicians.service';
import { CreateClinicianDto } from './dto/create-clinician.dto';

@Controller('clinicians')
export class CliniciansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @Get()
  async getClinicians(@Query() query: PaginationQueryDto) {
    return this.cliniciansService.getClinicians(query);
  }

  @Post()
  async createClinician(@Body() dto: CreateClinicianDto) {
    return this.cliniciansService.createClinician(dto);
  }
}
