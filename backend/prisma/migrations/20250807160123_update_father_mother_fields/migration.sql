/*
  Warnings:

  - You are about to drop the column `fatherCatName` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `motherCatName` on the `pedigrees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "pedigrees" DROP COLUMN "fatherCatName",
DROP COLUMN "motherCatName",
ADD COLUMN     "fatherCatName2" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "motherCatName2" TEXT,
ADD COLUMN     "motherName" TEXT;
