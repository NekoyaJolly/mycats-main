-- CreateTable
CREATE TABLE "gender_list" (
    "id" TEXT NOT NULL,
    "code" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gender_list_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gender_list_code_key" ON "gender_list"("code");

-- CreateIndex
CREATE UNIQUE INDEX "gender_list_name_key" ON "gender_list"("name");

-- AddForeignKey
ALTER TABLE "pedigrees" ADD CONSTRAINT "pedigrees_gender_fkey" FOREIGN KEY ("gender") REFERENCES "gender_list"("code") ON DELETE SET NULL ON UPDATE CASCADE;
