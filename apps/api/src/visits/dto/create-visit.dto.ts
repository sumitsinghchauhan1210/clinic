import {
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVisitDto {
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'clinicianId must be a positive integer' })
  clinicianId!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'patientId must be a positive integer' })
  patientId!: number;

  @IsOptional()
  @IsDateString({}, { message: 'dateTime must be a valid ISO 8601 date string' })
  dateTime?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
