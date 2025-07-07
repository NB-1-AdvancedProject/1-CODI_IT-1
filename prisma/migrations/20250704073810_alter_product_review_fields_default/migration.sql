/*
  Warnings:

  - Made the column `reviewsCount` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `reviewsRating` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "reviewsCount" SET NOT NULL,
ALTER COLUMN "reviewsCount" SET DEFAULT 0,
ALTER COLUMN "reviewsRating" SET NOT NULL,
ALTER COLUMN "reviewsRating" SET DEFAULT 0;
