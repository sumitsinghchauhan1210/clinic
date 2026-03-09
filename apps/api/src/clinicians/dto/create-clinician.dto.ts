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
  @Matches(/^\+?(\d[\s\-().]*){7,15}$/, {
    message: 'phone must be a valid phone number with 7–15 digits (e.g. +1-555-123-4567)',
  })
  @MaxLength(20)
  phone!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  specialty?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
