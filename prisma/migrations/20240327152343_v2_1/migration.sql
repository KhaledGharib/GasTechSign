-- CreateTable
CREATE TABLE "display" (
    "id" TEXT NOT NULL,
    "ipAddress" VARCHAR(45) NOT NULL,
    "fuel91" DECIMAL(65,30) NOT NULL,
    "fuel95" DECIMAL(65,30) NOT NULL,
    "fuelDI" DECIMAL(65,30) NOT NULL,
    "displayName" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "location" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "display_pkey" PRIMARY KEY ("id")
);
