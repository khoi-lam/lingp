-- AlterTable: Add orderCode column to orders
ALTER TABLE "orders" ADD COLUMN "orderCode" TEXT;

-- Backfill existing orders with generated codes
UPDATE "orders" SET "orderCode" = 'LL-' || UPPER(SUBSTR(MD5(RANDOM()::TEXT), 1, 8)) WHERE "orderCode" IS NULL;

-- Make orderCode NOT NULL and UNIQUE
ALTER TABLE "orders" ALTER COLUMN "orderCode" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderCode_key" ON "orders"("orderCode");
