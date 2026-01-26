/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `file_system_items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `file_system_items_name_key` ON `file_system_items`(`name`);
