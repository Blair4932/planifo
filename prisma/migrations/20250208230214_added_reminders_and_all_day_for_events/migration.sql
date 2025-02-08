/*
  Warnings:

  - Added the required column `allDay` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reminder` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "allDay" BOOLEAN NOT NULL,
ADD COLUMN     "reminder" BOOLEAN NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;
