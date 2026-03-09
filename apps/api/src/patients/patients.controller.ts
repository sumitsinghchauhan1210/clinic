import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async getPatients(@Query() query: PaginationQueryDto) {
    return this.patientsService.getPatients(query);
  }

  @Post()
  async createPatient(@Body() dto: CreatePatientDto) {
    return this.patientsService.createPatient(dto);
  }

  @Get(':id')
  async getPatient(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.getPatient(id);
  }
}
