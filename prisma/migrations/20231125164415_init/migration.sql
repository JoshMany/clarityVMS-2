-- DropForeignKey
ALTER TABLE `charts` DROP FOREIGN KEY `charts_dashboard_uuid_fkey`;

-- DropForeignKey
ALTER TABLE `dashboards` DROP FOREIGN KEY `dashboards_FK`;

-- AddForeignKey
ALTER TABLE `dashboards` ADD CONSTRAINT `dashboards_FK` FOREIGN KEY (`owner_id`) REFERENCES `users`(`UUID`) ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `charts` ADD CONSTRAINT `charts_dashboard_uuid_fkey` FOREIGN KEY (`dashboard_uuid`) REFERENCES `dashboards`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
