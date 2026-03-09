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
import { UpdateClinicianDto } from './dto/update-clinician.dto';

@Controller('clinicians')
export class CliniciansController {
  constructor(private readonly cliniciansService: CliniciansService) {}

  @Get()
  async getClinicians(@Query() query: PaginationQueryDto) {
    return this.cliniciansService.getClinicians(query);
  }

  @Get(':id')
  async getClinician(@Param('id', ParseIntPipe) id: number) {
    return this.cliniciansService.getClinician(id);
  }

  @Post()
  async createClinician(@Body() dto: CreateClinicianDto) {
    return this.cliniciansService.createClinician(dto);
  }

  @Patch(':id')
  async updateClinician(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClinicianDto) {
    return this.cliniciansService.updateClinician(id, dto);
  }

  @Delete(':id')
  async deleteClinician(@Param('id', ParseIntPipe) id: number) {
    return this.cliniciansService.deleteClinician(id);
  }
}
