-- CreateTable
CREATE TABLE `job_requisitions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `job_title` VARCHAR(50) NULL,
    `job_description` TEXT NULL,
    `company_id` INTEGER NULL,
    `completed_state` VARCHAR(50) NULL,
    `created_at` DATE NULL,
    `updated_at` DATE NULL,
    `salary` DECIMAL(6, 2) NULL,
    `owner_user_id` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `name` VARCHAR(100) NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UUID` VARCHAR(36) NOT NULL,
    `Email` VARCHAR(100) NOT NULL,
    `UserName` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(250) NOT NULL,
    `role_id` INTEGER NOT NULL,

    UNIQUE INDEX `users_Email_key`(`Email`),
    UNIQUE INDEX `users_UserName_key`(`UserName`),
    PRIMARY KEY (`UUID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dashboards` (
    `uuid` VARCHAR(36) NOT NULL,
    `dashboard_name` VARCHAR(100) NOT NULL,
    `owner_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `charts` (
    `uuid` CHAR(36) NOT NULL,
    `chart_name` VARCHAR(56) NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `x_axis` INTEGER NOT NULL,
    `y_axis` INTEGER NOT NULL,
    `dashboard_uuid` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_FK` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `dashboards_FK` FOREIGN KEY (`owner_id`) REFERENCES `users`(`UUID`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `charts` ADD CONSTRAINT `charts_dashboard_uuid_fkey` FOREIGN KEY (`dashboard_uuid`) REFERENCES `dashboards`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
