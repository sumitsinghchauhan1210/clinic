import {
  IsEmail,
  IsOptional,
  IsString,
  IsDateString,
  IsIn,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

const GENDER_VALUES = ['male', 'female', 'other', 'unknown'] as const;

export class CreatePatientDto {
  @IsString()
  @MinLength(1, { message: 'firstName must not be empty' })
  @MaxLength(100)
  firstName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\+?(\d[\s\-().]*){7,15}$/, {
    message: 'phone must be a valid phone number with 7–15 digits (e.g. +1-555-200-3001)',
  })
  @MaxLength(20)
  phone!: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsString()
  @IsIn(GENDER_VALUES, {
    message: `gender must be one of: ${GENDER_VALUES.join(', ')}`,
  })
  gender!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  state?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  zip?: string;
}
