-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'HR', 'HIRING_MANAGER');

-- CreateEnum
CREATE TYPE "InterviewSourceType" AS ENUM ('UPLOAD', 'LINK');

-- CreateEnum
CREATE TYPE "InterviewStatus" AS ENUM ('UPLOADED', 'TRANSCRIBED', 'SUMMARIZED');

-- CreateEnum
CREATE TYPE "ContentSubmissionType" AS ENUM ('TAKE_HOME', 'QUESTIONNAIRE', 'FREE_TEXT');

-- CreateEnum
CREATE TYPE "AiSignalBand" AS ENUM ('LOW', 'MED', 'HIGH');

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRetentionMonths" INTEGER,
    "anonymizedScreening" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trait" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Trait_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoleProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleTraitConfig" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "targetMin" DOUBLE PRECISION NOT NULL,
    "targetMax" DOUBLE PRECISION NOT NULL,
    "riskBelow" DOUBLE PRECISION,
    "riskAbove" DOUBLE PRECISION,

    CONSTRAINT "RoleTraitConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "organizationId" TEXT NOT NULL,
    "roleId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in_review',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "traitId" TEXT NOT NULL,
    "percentile" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "actorUserId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSession" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "sourceType" "InterviewSourceType" NOT NULL,
    "status" "InterviewStatus" NOT NULL,
    "languageOriginal" TEXT DEFAULT 'en',
    "languagePreferred" TEXT DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewTranscript" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "segments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewTranscript_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewSummary" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "evidence" JSONB,
    "mappedTraits" JSONB,
    "risks" JSONB,
    "roleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InterviewScorecard" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "overallRecommendation" TEXT NOT NULL,
    "rubric" JSONB NOT NULL,
    "interviewerNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewScorecard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TranslationRecord" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "fromLang" TEXT NOT NULL,
    "toLang" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionId" TEXT,
    "noteId" TEXT,
    "summaryId" TEXT,

    CONSTRAINT "TranslationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentSubmission" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "type" "ContentSubmissionType" NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiSignal" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "band" "AiSignalBand" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "reasons" JSONB NOT NULL,
    "disclaimerShown" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiSignal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_organizationId_idx" ON "User"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "Trait_name_key" ON "Trait"("name");

-- CreateIndex
CREATE INDEX "RoleProfile_organizationId_idx" ON "RoleProfile"("organizationId");

-- CreateIndex
CREATE INDEX "RoleTraitConfig_roleId_idx" ON "RoleTraitConfig"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "RoleTraitConfig_roleId_traitId_key" ON "RoleTraitConfig"("roleId", "traitId");

-- CreateIndex
CREATE INDEX "Candidate_organizationId_idx" ON "Candidate"("organizationId");

-- CreateIndex
CREATE INDEX "Candidate_roleId_idx" ON "Candidate"("roleId");

-- CreateIndex
CREATE INDEX "AssessmentResult_candidateId_idx" ON "AssessmentResult"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_candidateId_traitId_key" ON "AssessmentResult"("candidateId", "traitId");

-- CreateIndex
CREATE INDEX "Note_candidateId_idx" ON "Note"("candidateId");

-- CreateIndex
CREATE INDEX "AuditEvent_orgId_idx" ON "AuditEvent"("orgId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- CreateIndex
CREATE INDEX "InterviewSession_orgId_idx" ON "InterviewSession"("orgId");

-- CreateIndex
CREATE INDEX "InterviewSession_candidateId_idx" ON "InterviewSession"("candidateId");

-- CreateIndex
CREATE INDEX "InterviewSession_status_idx" ON "InterviewSession"("status");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewTranscript_sessionId_key" ON "InterviewTranscript"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewSummary_sessionId_key" ON "InterviewSummary"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "InterviewScorecard_sessionId_key" ON "InterviewScorecard"("sessionId");

-- CreateIndex
CREATE INDEX "TranslationRecord_entityType_entityId_idx" ON "TranslationRecord"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "ContentSubmission_orgId_idx" ON "ContentSubmission"("orgId");

-- CreateIndex
CREATE INDEX "ContentSubmission_candidateId_idx" ON "ContentSubmission"("candidateId");

-- CreateIndex
CREATE INDEX "AiSignal_submissionId_idx" ON "AiSignal"("submissionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleProfile" ADD CONSTRAINT "RoleProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleTraitConfig" ADD CONSTRAINT "RoleTraitConfig_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleTraitConfig" ADD CONSTRAINT "RoleTraitConfig_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_traitId_fkey" FOREIGN KEY ("traitId") REFERENCES "Trait"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSession" ADD CONSTRAINT "InterviewSession_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewTranscript" ADD CONSTRAINT "InterviewTranscript_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSummary" ADD CONSTRAINT "InterviewSummary_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewSummary" ADD CONSTRAINT "InterviewSummary_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewScorecard" ADD CONSTRAINT "InterviewScorecard_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationRecord" ADD CONSTRAINT "TranslationRecord_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "InterviewSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationRecord" ADD CONSTRAINT "TranslationRecord_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranslationRecord" ADD CONSTRAINT "TranslationRecord_summaryId_fkey" FOREIGN KEY ("summaryId") REFERENCES "InterviewSummary"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSubmission" ADD CONSTRAINT "ContentSubmission_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentSubmission" ADD CONSTRAINT "ContentSubmission_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiSignal" ADD CONSTRAINT "AiSignal_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "ContentSubmission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

