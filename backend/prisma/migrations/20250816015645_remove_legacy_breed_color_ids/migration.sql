/*
  Warnings:

  - You are about to drop the column `breedId` on the `cats` table. All the data in the column will be lost.
  - You are about to drop the column `colorId` on the `cats` table. All the data in the column will be lost.
  - You are about to drop the column `breedId` on the `pedigrees` table. All the data in the column will be lost.
  - You are about to drop the column `colorId` on the `pedigrees` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cats" DROP CONSTRAINT "cats_breedId_fkey";

-- DropForeignKey
ALTER TABLE "cats" DROP CONSTRAINT "cats_colorId_fkey";

-- DropForeignKey
ALTER TABLE "pedigrees" DROP CONSTRAINT "pedigrees_breedId_fkey";

-- DropForeignKey
ALTER TABLE "pedigrees" DROP CONSTRAINT "pedigrees_colorId_fkey";

-- AlterTable
ALTER TABLE "cats" DROP COLUMN "breedId",
DROP COLUMN "colorId";

-- AlterTable
ALTER TABLE "pedigrees" DROP COLUMN "breedId",
DROP COLUMN "colorId",
ADD COLUMN     "fffCatColor" TEXT,
ADD COLUMN     "ffmCatColor" TEXT,
ADD COLUMN     "fmfCatColor" TEXT,
ADD COLUMN     "fmmCatColor" TEXT,
ADD COLUMN     "mffCatColor" TEXT,
ADD COLUMN     "mfmCatColor" TEXT,
ADD COLUMN     "mmfCatColor" TEXT,
ADD COLUMN     "mmmCatColor" TEXT;

-- AddForeignKey
ALTER TABLE "pedigrees" ADD CONSTRAINT "pedigrees_breedCode_fkey" FOREIGN KEY ("breedCode") REFERENCES "breeds"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedigrees" ADD CONSTRAINT "pedigrees_coatColorCode_fkey" FOREIGN KEY ("coatColorCode") REFERENCES "coat_colors"("code") ON DELETE SET NULL ON UPDATE CASCADE;
