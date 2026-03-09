import { Module } from '@nestjs/common';
import { PatientsController } from './patients.controller';
import { PatientsService } from './patients.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PrismaService],
  imports: [],
})
export class PatientsModule {}
