/*
  Warnings:

  - You are about to drop the column `storeName` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Store` table. All the data in the column will be lost.
  - Added the required column `name` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeName` to the `Store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "storeName",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "name",
ADD COLUMN     "storeName" TEXT NOT NULL;
