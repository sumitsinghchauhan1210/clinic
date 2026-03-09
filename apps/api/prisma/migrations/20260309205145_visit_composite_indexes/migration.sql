-- DropIndex
DROP INDEX "Visit_patientId_idx";

-- DropIndex
DROP INDEX "Visit_clinicianId_idx";

-- CreateIndex
CREATE INDEX "Visit_clinicianId_timestamp_idx" ON "Visit"("clinicianId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "Visit_patientId_timestamp_idx" ON "Visit"("patientId", "timestamp" DESC);
