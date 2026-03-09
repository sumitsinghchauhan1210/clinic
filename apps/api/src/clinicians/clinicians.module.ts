import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CliniciansController } from './clinicians.controller';
import { CliniciansService } from './clinicians.service';

@Module({
  controllers: [CliniciansController],
  providers: [CliniciansService, PrismaService],
})
export class CliniciansModule {}
