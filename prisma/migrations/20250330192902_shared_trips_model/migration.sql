/*
  Creating a shared trips model
  - Each trip can be shared with multiple users
  - Converting from direct User->Trip ownership to a many-to-many relationship
  - Preserving existing relationships by transferring userId to ownerId and creating TripUser entries
*/

-- First, create the TripUser table for the many-to-many relationship
-- CreateTable
CREATE TABLE "TripUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripUser_pkey" PRIMARY KEY ("id")
);

-- Create unique index for userId-tripId pairs
-- CreateIndex
CREATE UNIQUE INDEX "TripUser_userId_tripId_key" ON "TripUser"("userId", "tripId");

-- Temporarily add ownerId column without NOT NULL constraint
ALTER TABLE "Trip" ADD COLUMN "ownerId" TEXT;

-- Populate new TripUser join table with existing relations
-- and set ownerId to match the current userId for each trip
INSERT INTO "TripUser" ("id", "userId", "tripId", "createdAt")
SELECT gen_random_uuid(), "userId", "id", CURRENT_TIMESTAMP
FROM "Trip";

-- Copy userId to ownerId for all existing trips
UPDATE "Trip" SET "ownerId" = "userId";

-- Drop the foreign key constraint
-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";

-- Now make ownerId NOT NULL since we've populated it
ALTER TABLE "Trip" ALTER COLUMN "ownerId" SET NOT NULL;

-- Drop originalTripId column as it's no longer needed
ALTER TABLE "Trip" DROP COLUMN "originalTripId";

-- Finally, drop the userId column
ALTER TABLE "Trip" DROP COLUMN "userId";




-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripUser" ADD CONSTRAINT "TripUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripUser" ADD CONSTRAINT "TripUser_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
