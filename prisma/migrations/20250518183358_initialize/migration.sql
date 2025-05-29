-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER'
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
