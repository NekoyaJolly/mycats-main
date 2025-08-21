/*
  Warnings:

  - You are about to drop the column `fatherName` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `fatherPedigreeId` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `maternalGrandfatherId` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `maternalGrandmotherId` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `motherName` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `motherPedigreeId` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `paternalGrandfatherId` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `paternalGrandmotherId` on the `pedigrees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."pedigrees" DROP CONSTRAINT "pedigrees_fatherPedigreeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedigrees" DROP CONSTRAINT "pedigrees_gender_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedigrees" DROP CONSTRAINT "pedigrees_maternalGrandfatherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedigrees" DROP CONSTRAINT "pedigrees_maternalGrandmotherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedigrees" DROP CONSTRAINT "pedigrees_motherPedigreeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedigrees" DROP CONSTRAINT "pedigrees_paternalGrandfatherId_fkey";

-- DropForeignKey
ALTER TABLE "public"."pedigrees" DROP CONSTRAINT "pedigrees_paternalGrandmotherId_fkey";

-- AlterTable
ALTER TABLE "public"."pedigrees" DROP COLUMN "fatherName",
DROP COLUMN "fatherPedigreeId",
DROP COLUMN "gender",
DROP COLUMN "maternalGrandfatherId",
DROP COLUMN "maternalGrandmotherId",
DROP COLUMN "motherName",
DROP COLUMN "motherPedigreeId",
DROP COLUMN "paternalGrandfatherId",
DROP COLUMN "paternalGrandmotherId",
ADD COLUMN     "fatherCatName" TEXT,
ADD COLUMN     "genderCode" INTEGER,
ADD COLUMN     "motherCatName" TEXT,
ALTER COLUMN "birthDate" SET DATA TYPE TEXT,
ALTER COLUMN "registrationDate" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "public"."pedigrees" ADD CONSTRAINT "pedigrees_genderCode_fkey" FOREIGN KEY ("genderCode") REFERENCES "public"."gender_list"("code") ON DELETE SET NULL ON UPDATE CASCADE;
