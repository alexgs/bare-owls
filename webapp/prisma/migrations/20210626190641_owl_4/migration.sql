-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "data" JSONB,
    "email" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    PRIMARY KEY ("id")
);
