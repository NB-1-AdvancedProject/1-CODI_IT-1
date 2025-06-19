/*
  Warnings:

  - A unique constraint covering the columns `[inquiryId]` on the table `Reply` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reply_inquiryId_key" ON "Reply"("inquiryId");
