import { config } from 'dotenv';
import path from 'path';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';

// Load .env from api app root (parent of prisma/)
config({ path: path.join(__dirname, '..', '.env') });

function createPrismaClient(): PrismaClient {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Create a .env file in the api app with DATABASE_URL (e.g. file:./dev.db).'
    );
  }
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = createPrismaClient();

  console.log('Clearing existing data...');
  await prisma.visit.deleteMany();
  await prisma.clinician.deleteMany();
  await prisma.patient.deleteMany();

  console.log('Seeding clinicians...');
  const clinicians = await Promise.all([
    prisma.clinician.create({
      data: {
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@clinic.com',
        phone: '+1-555-100-2001',
        specialty: 'General Practice',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. James Wilson',
        email: 'james.wilson@clinic.com',
        phone: '+1-555-100-2002',
        specialty: 'Cardiology',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Emily Martinez',
        email: 'emily.martinez@clinic.com',
        phone: '+1-555-100-2003',
        specialty: 'Pediatrics',
        isActive: true,
      },
    }),
  ]);

  console.log('Seeding patients...');
  const patients = await Promise.all([
    prisma.patient.create({
      data: {
        firstName: 'Alex',
        lastName: 'Johnson',
        email: 'alex.johnson@email.com',
        phone: '+1-555-200-3001',
        dateOfBirth: new Date('1990-05-15'),
        gender: 'male',
        address: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '62701',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@email.com',
        phone: '+1-555-200-3002',
        dateOfBirth: new Date('1985-08-22'),
        gender: 'female',
        address: '456 Oak Ave',
        city: 'Riverside',
        state: 'CA',
        zip: '92501',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'David',
        lastName: 'Kim',
        email: 'david.kim@email.com',
        phone: '+1-555-200-3003',
        dateOfBirth: new Date('1978-12-03'),
        gender: 'male',
        address: '789 Pine Rd',
        city: 'Portland',
        state: 'OR',
        zip: '97201',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Lisa',
        lastName: 'Thompson',
        email: 'lisa.thompson@email.com',
        phone: '+1-555-200-3004',
        dateOfBirth: new Date('1992-03-10'),
        gender: 'female',
        address: '321 Elm St',
        city: 'Austin',
        state: 'TX',
        zip: '78701',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Robert',
        lastName: 'Brown',
        email: 'robert.brown@email.com',
        phone: '+1-555-200-3005',
        dateOfBirth: new Date('1980-11-28'),
        gender: 'male',
        address: '654 Cedar Ln',
        city: 'Denver',
        state: 'CO',
        zip: '80201',
      },
    }),
  ]);

  console.log('Seeding visits...');
  const now = new Date();
  const visitsData = [
    { clinicianIndex: 0, patientIndex: 0, notes: 'Annual checkup, vitals normal.', daysAgo: 2 },
    { clinicianIndex: 0, patientIndex: 1, notes: 'Follow-up on blood pressure.', daysAgo: 5 },
    { clinicianIndex: 1, patientIndex: 2, notes: 'Cardiac screening scheduled.', daysAgo: 1 },
    { clinicianIndex: 2, patientIndex: 3, notes: 'Vaccination record updated.', daysAgo: 7 },
    { clinicianIndex: 0, patientIndex: 4, notes: 'General consultation.', daysAgo: 3 },
    { clinicianIndex: 1, patientIndex: 0, notes: 'ECG review – normal sinus rhythm.', daysAgo: 10 },
    { clinicianIndex: 2, patientIndex: 1, notes: 'Pediatric referral follow-up.', daysAgo: 14 },
    { clinicianIndex: 0, patientIndex: 2, notes: 'Routine physical.', daysAgo: 0 },
  ];

  for (const v of visitsData) {
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - v.daysAgo);
    await prisma.visit.create({
      data: {
        clinicianId: clinicians[v.clinicianIndex]!.id,
        patientId: patients[v.patientIndex]!.id,
        timestamp,
        notes: v.notes,
      },
    });
  }

  await prisma.$disconnect();
  console.log(
    'Seed completed: %d clinicians, %d patients, %d visits.',
    clinicians.length,
    patients.length,
    visitsData.length
  );
}

main().catch((e) => {
  console.error('Seed failed:', e);
  process.exit(1);
});
