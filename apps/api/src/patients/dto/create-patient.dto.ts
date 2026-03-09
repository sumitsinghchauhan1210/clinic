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
  @MinLength(1, { message: 'phone must not be empty' })
  @MaxLength(20)
  @Matches(/^[+\d\s\-()]+$/, {
    message: 'phone must contain only digits, spaces, +, -, (, )',
  })
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
