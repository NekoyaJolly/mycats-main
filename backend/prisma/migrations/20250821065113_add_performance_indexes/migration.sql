-- CreateIndex
CREATE INDEX "breeding_records_maleId_idx" ON "public"."breeding_records"("maleId");

-- CreateIndex
CREATE INDEX "breeding_records_femaleId_idx" ON "public"."breeding_records"("femaleId");

-- CreateIndex
CREATE INDEX "breeding_records_breedingDate_idx" ON "public"."breeding_records"("breedingDate");

-- CreateIndex
CREATE INDEX "breeding_records_expectedDueDate_idx" ON "public"."breeding_records"("expectedDueDate");

-- CreateIndex
CREATE INDEX "breeding_records_status_idx" ON "public"."breeding_records"("status");

-- CreateIndex
CREATE INDEX "care_records_catId_idx" ON "public"."care_records"("catId");

-- CreateIndex
CREATE INDEX "care_records_careDate_idx" ON "public"."care_records"("careDate");

-- CreateIndex
CREATE INDEX "care_records_nextDueDate_idx" ON "public"."care_records"("nextDueDate");

-- CreateIndex
CREATE INDEX "care_records_careType_idx" ON "public"."care_records"("careType");

-- CreateIndex
CREATE INDEX "cats_ownerId_idx" ON "public"."cats"("ownerId");

-- CreateIndex
CREATE INDEX "cats_breedName_idx" ON "public"."cats"("breedName");

-- CreateIndex
CREATE INDEX "cats_colorName_idx" ON "public"."cats"("colorName");

-- CreateIndex
CREATE INDEX "cats_birthDate_idx" ON "public"."cats"("birthDate");

-- CreateIndex
CREATE INDEX "cats_isActive_idx" ON "public"."cats"("isActive");

-- CreateIndex
CREATE INDEX "cats_gender_idx" ON "public"."cats"("gender");

-- CreateIndex
CREATE INDEX "cats_createdAt_idx" ON "public"."cats"("createdAt");
