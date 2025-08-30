-- CreateTable
CREATE TABLE `schools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,
    `address` TEXT NOT NULL,
    `city` TEXT NOT NULL,
    `state` TEXT NOT NULL,
    `contact` VARCHAR(20) NOT NULL,
    `image` TEXT NOT NULL,
    `email_id` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
