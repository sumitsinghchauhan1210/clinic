import {
  IsEmail,
  IsOptional,
  IsString,
  IsBoolean,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateClinicianDto {
  @IsString()
  @MinLength(1, { message: 'name must not be empty' })
  @MaxLength(200)
  name!: string;

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
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
