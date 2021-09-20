/*
  Warnings:

  - You are about to drop the column `name` on the `Channel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Channel` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[channelId,userId]` on the table `ChannelSubscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Channel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tierId` to the `ChannelSubscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Channel_name_key";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "name",
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ChannelSubscription" ADD COLUMN     "tierId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "ChannelTier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "channelId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChannelTier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" UUID NOT NULL,
    "publicId" VARCHAR(5) NOT NULL,
    "body" TEXT NOT NULL,
    "channelId" UUID NOT NULL,
    "tierId" INTEGER NOT NULL,
    "authorId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ppvPrice" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserUnlockedPost" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "postId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserUnlockedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelTier_channelId_order_key" ON "ChannelTier"("channelId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelTier_channelId_slug_key" ON "ChannelTier"("channelId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Post_channelId_publicId_key" ON "Post"("channelId", "publicId");

-- CreateIndex
CREATE UNIQUE INDEX "UserUnlockedPost_postId_userId_key" ON "UserUnlockedPost"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Channel_slug_key" ON "Channel"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelSubscription_channelId_userId_key" ON "ChannelSubscription"("channelId", "userId");

-- AddForeignKey
ALTER TABLE "ChannelSubscription" ADD CONSTRAINT "ChannelSubscription_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "ChannelTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelTier" ADD CONSTRAINT "ChannelTier_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "ChannelTier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUnlockedPost" ADD CONSTRAINT "UserUnlockedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserUnlockedPost" ADD CONSTRAINT "UserUnlockedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
