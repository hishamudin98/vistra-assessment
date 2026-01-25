-- CreateTable
CREATE TABLE `file_system_items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `type` VARCHAR(10) NOT NULL,
    `path` VARCHAR(1000) NULL,
    `size` BIGINT NULL,
    `mime_type` VARCHAR(100) NULL,
    `parent_id` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `file_system_items_parent_id_idx`(`parent_id`),
    INDEX `file_system_items_user_id_idx`(`user_id`),
    INDEX `file_system_items_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `file_system_items` ADD CONSTRAINT `file_system_items_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `file_system_items`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `file_system_items` ADD CONSTRAINT `file_system_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
