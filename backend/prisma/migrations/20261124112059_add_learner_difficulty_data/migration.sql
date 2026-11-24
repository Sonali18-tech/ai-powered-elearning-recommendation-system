-- CreateEnum
CREATE TYPE "DifficultyFeedbackRating" AS ENUM ('TOO_EASY', 'JUST_RIGHT', 'TOO_DIFFICULT');

-- CreateTable
CREATE TABLE "DifficultyFeedback" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "rating" "DifficultyFeedbackRating" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DifficultyFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingObservation" (
    "id" TEXT NOT NULL,
    "feedbackId" TEXT NOT NULL,
    "features" JSONB NOT NULL,
    "target" "DifficultyLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrainingObservation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DifficultyFeedback_userId_courseId_key" ON "DifficultyFeedback"("userId", "courseId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingObservation_feedbackId_key" ON "TrainingObservation"("feedbackId");

-- AddForeignKey
ALTER TABLE "DifficultyFeedback" ADD CONSTRAINT "DifficultyFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DifficultyFeedback" ADD CONSTRAINT "DifficultyFeedback_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingObservation" ADD CONSTRAINT "TrainingObservation_feedbackId_fkey" FOREIGN KEY ("feedbackId") REFERENCES "DifficultyFeedback"("id") ON DELETE CASCADE ON UPDATE CASCADE;
