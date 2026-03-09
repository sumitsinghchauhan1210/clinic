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
        name: 'Dr. Olivia Thompson',
        email: 'olivia.thompson@clinic.com',
        phone: '+1-555-100-3001',
        specialty: 'Family Medicine',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Benjamin Lee',
        email: 'benjamin.lee@clinic.com',
        phone: '+1-555-100-3002',
        specialty: 'Orthopedics',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Maria Garcia',
        email: 'maria.garcia@clinic.com',
        phone: '+1-555-100-3003',
        specialty: 'Neurology',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. William Johnson',
        email: 'william.johnson@clinic.com',
        phone: '+1-555-100-3004',
        specialty: 'Endocrinology',
        isActive: false,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Ava Brown',
        email: 'ava.brown@clinic.com',
        phone: '+1-555-100-3005',
        specialty: 'Psychiatry',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Sarah Chen',
        email: 'sarah.chen@clinic.com',
        phone: '+1-555-100-2001', // kept as unique
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
    prisma.clinician.create({
      data: {
        name: 'Dr. Michael Patel',
        email: 'michael.patel@clinic.com',
        phone: '+1-555-100-2004',
        specialty: 'Dermatology',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Lauren Smith',
        email: 'lauren.smith@clinic.com',
        phone: '+1-555-100-2005',
        specialty: 'Internal Medicine',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Victor Nguyen',
        email: 'victor.nguyen@clinic.com',
        phone: '+1-555-100-2006',
        specialty: 'Neurology',
        isActive: false,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Priya Singh',
        email: 'priya.singh@clinic.com',
        phone: '+1-555-100-2007',
        specialty: 'Endocrinology',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Samuel Roberts',
        email: 'samuel.roberts@clinic.com',
        phone: '+1-555-100-2008',
        specialty: 'Orthopedics',
        isActive: false,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Anna Fischer',
        email: 'anna.fischer@clinic.com',
        phone: '+1-555-100-2009',
        specialty: 'Rheumatology',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Ruth Goldberg',
        email: 'ruth.goldberg@clinic.com',
        phone: '+1-555-100-2010',
        specialty: 'Gastroenterology',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Omar Al-Masri',
        email: 'omar.almasri@clinic.com',
        phone: '+1-555-100-2011',
        specialty: 'Nephrology',
        isActive: false,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Chloe Dubois',
        email: 'chloe.dubois@clinic.com',
        phone: '+1-555-100-2012',
        specialty: 'Oncology',
        isActive: true,
      },
    }),
    prisma.clinician.create({
      data: {
        name: 'Dr. Tomoko Sato',
        email: 'tomoko.sato@clinic.com',
        phone: '+1-555-100-2013',
        specialty: 'Ophthalmology',
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
    prisma.patient.create({
      data: {
        firstName: 'Emily',
        lastName: 'Clark',
        email: 'emily.clark@email.com',
        phone: '+1-555-200-3015',
        dateOfBirth: new Date('1995-02-11'),
        gender: 'female',
        address: '321 Birch St',
        city: 'Cedar Rapids',
        state: 'IA',
        zip: '52401',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Michael',
        lastName: 'Lee',
        email: 'michael.lee@email.com',
        phone: '+1-555-200-3006',
        dateOfBirth: new Date('1980-07-21'),
        gender: 'male',
        address: '654 Maple Ave',
        city: 'Omaha',
        state: 'NE',
        zip: '68102',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Sofia',
        lastName: 'Pereira',
        email: 'sofia.pereira@email.com',
        phone: '+1-555-200-3007',
        dateOfBirth: new Date('1988-09-17'),
        gender: 'female',
        address: '222 Cherry Ln',
        city: 'Austin',
        state: 'TX',
        zip: '73301',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'William',
        lastName: 'Nguyen',
        email: 'william.nguyen@email.com',
        phone: '+1-555-200-3008',
        dateOfBirth: new Date('1975-11-30'),
        gender: 'male',
        address: '876 Walnut Ave',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Grace',
        lastName: 'Morgan',
        email: 'grace.morgan@email.com',
        phone: '+1-555-200-3009',
        dateOfBirth: new Date('2000-01-25'),
        gender: 'female',
        address: '159 Chestnut St',
        city: 'Boston',
        state: 'MA',
        zip: '02108',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Oscar',
        lastName: 'Ramirez',
        email: 'oscar.ramirez@email.com',
        phone: '+1-555-200-3010',
        dateOfBirth: new Date('1983-04-14'),
        gender: 'male',
        address: '44 Spruce Rd',
        city: 'Denver',
        state: 'CO',
        zip: '80203',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Nina',
        lastName: 'Sharma',
        email: 'nina.sharma@email.com',
        phone: '+1-555-200-3011',
        dateOfBirth: new Date('1999-10-02'),
        gender: 'female',
        address: '888 Willow Way',
        city: 'Tampa',
        state: 'FL',
        zip: '33602',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Ethan',
        lastName: 'White',
        email: 'ethan.white@email.com',
        phone: '+1-555-200-3012',
        dateOfBirth: new Date('1991-06-27'),
        gender: 'male',
        address: '555 Palm Dr',
        city: 'Phoenix',
        state: 'AZ',
        zip: '85004',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Ava',
        lastName: 'Baker',
        email: 'ava.baker@email.com',
        phone: '+1-555-200-3013',
        dateOfBirth: new Date('1986-03-06'),
        gender: 'female',
        address: '212 Aspen Ct',
        city: 'Charlotte',
        state: 'NC',
        zip: '28202',
      },
    }),
    prisma.patient.create({
      data: {
        firstName: 'Noah',
        lastName: 'Klein',
        email: 'noah.klein@email.com',
        phone: '+1-555-200-3014',
        dateOfBirth: new Date('1993-12-19'),
        gender: 'male',
        address: '77 Magnolia Blvd',
        city: 'Madison',
        state: 'WI',
        zip: '53703',
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
    { clinicianIndex: 1, patientIndex: 3, notes: 'Consulted for chest pain, ordered ECG.', daysAgo: 4 },
    { clinicianIndex: 2, patientIndex: 4, notes: 'Answered medication questions over phone.', daysAgo: 3 },
    { clinicianIndex: 0, patientIndex: 2, notes: 'Discussed lab results and next steps.', daysAgo: 12 },
    { clinicianIndex: 1, patientIndex: 1, notes: 'Post-op check, incision healing well.', daysAgo: 8 },
    { clinicianIndex: 2, patientIndex: 0, notes: 'Referred to specialist for further evaluation.', daysAgo: 6 },
    { clinicianIndex: 1, patientIndex: 4, notes: 'Follow-up for allergy management.', daysAgo: 9 },
    { clinicianIndex: 0, patientIndex: 3, notes: 'Immunization administered.', daysAgo: 11 },
    { clinicianIndex: 2, patientIndex: 2, notes: 'Reviewed ongoing care plan.', daysAgo: 15 },
    { clinicianIndex: 1, patientIndex: 0, notes: 'Blood work collected.', daysAgo: 13 },
    { clinicianIndex: 0, patientIndex: 4, notes: 'Patient counseling and education.', daysAgo: 5 },
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
