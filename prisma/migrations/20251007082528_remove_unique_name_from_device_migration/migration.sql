/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `devices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `devices` DROP FOREIGN KEY `devices_userId_fkey`;

-- DropIndex
DROP INDEX `devices_userId_name_key` ON `devices`;

-- CreateIndex
CREATE UNIQUE INDEX `devices_userId_key` ON `devices`(`userId`);

-- AddForeignKey
ALTER TABLE `devices` ADD CONSTRAINT `devices_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
