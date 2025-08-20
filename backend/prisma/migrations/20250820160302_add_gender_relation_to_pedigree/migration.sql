-- AddForeignKey
ALTER TABLE "pedigrees" ADD CONSTRAINT "pedigrees_gender_fkey" FOREIGN KEY ("gender") REFERENCES "gender_list"("code") ON DELETE SET NULL ON UPDATE CASCADE;
