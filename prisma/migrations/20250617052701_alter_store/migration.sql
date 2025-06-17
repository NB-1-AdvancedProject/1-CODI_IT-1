/*
  Warnings:

  - You are about to drop the column `phone` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `storeName` on the `Store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Store` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Store" DROP COLUMN "phone",
DROP COLUMN "storeName",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "storeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Store_userId_key" ON "Store"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;
