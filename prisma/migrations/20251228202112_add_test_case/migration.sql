-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('ANALYSIS', 'NEW_FEATURE', 'BUG_FIX', 'IMPROVEMENT', 'REGRESSION');

-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('DRAFT', 'ANALYSIS', 'READY', 'EXECUTED');

-- CreateTable
CREATE TABLE "TestCase" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "TestType" NOT NULL,
    "status" "TestStatus" NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TestCase_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
