-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippedAt" TIMESTAMP(3),
ADD COLUMN     "shippingCarrier" TEXT,
ADD COLUMN     "trackingNumber" TEXT;
