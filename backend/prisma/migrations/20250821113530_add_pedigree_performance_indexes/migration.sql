-- CreateIndex
CREATE INDEX "pedigrees_pedigreeId_idx" ON "public"."pedigrees"("pedigreeId");

-- CreateIndex
CREATE INDEX "pedigrees_breedCode_idx" ON "public"."pedigrees"("breedCode");

-- CreateIndex
CREATE INDEX "pedigrees_genderCode_idx" ON "public"."pedigrees"("genderCode");

-- CreateIndex
CREATE INDEX "pedigrees_coatColorCode_idx" ON "public"."pedigrees"("coatColorCode");

-- CreateIndex
CREATE INDEX "pedigrees_catName_idx" ON "public"."pedigrees"("catName");

-- CreateIndex
CREATE INDEX "pedigrees_createdAt_idx" ON "public"."pedigrees"("createdAt");

-- CreateIndex
CREATE INDEX "pedigrees_updatedAt_idx" ON "public"."pedigrees"("updatedAt");

-- CreateIndex
CREATE INDEX "pedigrees_breedCode_genderCode_idx" ON "public"."pedigrees"("breedCode", "genderCode");

-- CreateIndex
CREATE INDEX "pedigrees_catName_breedCode_idx" ON "public"."pedigrees"("catName", "breedCode");

-- CreateIndex
CREATE INDEX "pedigrees_createdAt_breedCode_idx" ON "public"."pedigrees"("createdAt", "breedCode");
