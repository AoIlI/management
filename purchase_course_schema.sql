-- ============================================
-- 购买课程功能数据库结构变更
-- ============================================

-- 1. 在members表中添加可用课程次数字段
ALTER TABLE `members` 
ADD COLUMN `available_classes` INT NOT NULL DEFAULT 0 COMMENT '可用课程次数' AFTER `status`,
ADD COLUMN `last_reset_date` DATE NULL DEFAULT NULL COMMENT '上次重置次数日期（用于月卡等按月重置的会员）' AFTER `available_classes`;

-- 2. 创建套餐表
DROP TABLE IF EXISTS `packages`;
CREATE TABLE `packages` (
  `package_id` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '套餐ID',
  `package_name` VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '套餐名称',
  `package_type` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '套餐类型：membership_card(会员卡)/class_pack(课程包)',
  `membership_type` VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '会员类型（仅会员卡类型）：年卡/季卡/月卡',
  `classes_count` INT NULL DEFAULT NULL COMMENT '课程次数（仅课程包类型）',
  `price` DECIMAL(10, 2) NOT NULL COMMENT '价格',
  `description` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '套餐描述',
  `classes_per_month` INT NULL DEFAULT NULL COMMENT '每月课程次数（会员卡类型）',
  `validity_days` INT NULL DEFAULT NULL COMMENT '有效期天数（会员卡类型）',
  `status` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '启用' COMMENT '状态：启用/停用',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`package_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '套餐表' ROW_FORMAT = DYNAMIC;

-- 3. 创建购买记录表
DROP TABLE IF EXISTS `purchase_records`;
CREATE TABLE `purchase_records` (
  `purchase_id` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '购买记录ID',
  `member_id` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '会员ID',
  `package_id` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '套餐ID',
  `amount` DECIMAL(10, 2) NOT NULL COMMENT '支付金额',
  `payment_status` VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '待支付' COMMENT '支付状态：待支付/已支付/已取消',
  `purchase_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '购买时间',
  `payment_time` DATETIME NULL DEFAULT NULL COMMENT '支付时间',
  PRIMARY KEY (`purchase_id`) USING BTREE,
  INDEX `FK_Purchase_Member`(`member_id` ASC) USING BTREE,
  INDEX `FK_Purchase_Package`(`package_id` ASC) USING BTREE,
  CONSTRAINT `FK_Purchase_Member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Purchase_Package` FOREIGN KEY (`package_id`) REFERENCES `packages` (`package_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '购买记录表' ROW_FORMAT = DYNAMIC;

-- 4. 在booking_records表中添加是否已上课字段
ALTER TABLE `booking_records` 
ADD COLUMN `attended` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否已上课：0未上课，1已上课' AFTER `status`,
ADD COLUMN `attended_time` DATETIME NULL DEFAULT NULL COMMENT '上课时间' AFTER `attended`;

-- 5. 插入默认套餐数据
INSERT INTO `packages` (`package_id`, `package_name`, `package_type`, `membership_type`, `classes_count`, `price`, `description`, `classes_per_month`, `validity_days`, `status`) VALUES
('PACK000001', '年卡会员', 'membership_card', '年卡', NULL, 3000.00, '年卡会员，每月30次课程，有效期12个月', 30, 365, '启用'),
('PACK000002', '季卡会员', 'membership_card', '季卡', NULL, 900.00, '季卡会员，每月20次课程，有效期3个月', 20, 90, '启用'),
('PACK000003', '月卡会员', 'membership_card', '月卡', NULL, 500.00, '月卡会员，每月10次课程，有效期1个月', 10, 30, '启用'),
('PACK000004', '课程包（10次）', 'class_pack', NULL, 10, 200.00, '单独购买10次课程，不改变会员类型', NULL, NULL, '启用');

-- 6. 为现有会员设置默认可用次数
-- 普通会员（没有membership_type或membership_type为空的）设置为3次
UPDATE `members` SET `available_classes` = 3 WHERE `membership_type` IS NULL OR `membership_type` = '' OR `membership_type` = '普通会员';

-- 年卡会员设置为30次
UPDATE `members` SET `available_classes` = 30, `last_reset_date` = CURDATE() WHERE `membership_type` = '年卡';

-- 季卡会员设置为20次
UPDATE `members` SET `available_classes` = 20, `last_reset_date` = CURDATE() WHERE `membership_type` = '季卡';

-- 月卡会员设置为10次
UPDATE `members` SET `available_classes` = 10, `last_reset_date` = CURDATE() WHERE `membership_type` = '月卡';

-- 7. 创建事务记录表（如果不存在）
-- transactions表已存在，无需创建

-- 8. 添加索引优化查询
CREATE INDEX `idx_member_available_classes` ON `members`(`available_classes`);
CREATE INDEX `idx_package_type` ON `packages`(`package_type`);
CREATE INDEX `idx_purchase_member_time` ON `purchase_records`(`member_id`, `purchase_time`);



