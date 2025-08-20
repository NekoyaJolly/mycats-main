-- AlterTable
ALTER TABLE "cats" ADD COLUMN     "breedName" TEXT,
ADD COLUMN     "colorName" TEXT;

-- AddForeignKey
ALTER TABLE "cats" ADD CONSTRAINT "cats_breedName_fkey" FOREIGN KEY ("breedName") REFERENCES "breeds"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cats" ADD CONSTRAINT "cats_colorName_fkey" FOREIGN KEY ("colorName") REFERENCES "coat_colors"("name") ON DELETE SET NULL ON UPDATE CASCADE;
