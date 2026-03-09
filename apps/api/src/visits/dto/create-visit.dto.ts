import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
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
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
