-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "refreshToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
