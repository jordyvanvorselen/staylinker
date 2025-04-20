-- AlterTable
ALTER TABLE "TripInvitation" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';

-- AlterTable
ALTER TABLE "TripUser" ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'member';
