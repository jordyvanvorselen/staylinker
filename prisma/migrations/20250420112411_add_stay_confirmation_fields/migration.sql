-- AlterTable
ALTER TABLE "Stay" ADD COLUMN     "arrivalConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "departureConfirmed" BOOLEAN NOT NULL DEFAULT false;
