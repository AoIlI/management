/*
 Navicat Premium Dump SQL

 Source Server         : mysql8
 Source Server Type    : MySQL
 Source Server Version : 80044 (8.0.44)
 Source Host           : localhost:3306
 Source Schema         : managersystem

 Target Server Type    : MySQL
 Target Server Version : 80044 (8.0.44)
 File Encoding         : 65001

 Date: 21/12/2025 20:37:08
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `account_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '全局唯一账号ID，对应一个真实的人',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录用户名（昵称，全局唯一）',
  `password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '登录密码（建议加密）',
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '手机号，管理员可为空',
  `role` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '身份：admin / coach / member',
  PRIMARY KEY (`account_id`) USING BTREE,
  UNIQUE INDEX `uk_username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '系统统一账号密码表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of accounts
-- ----------------------------
INSERT INTO `accounts` VALUES ('ACC0000001', 'admin', 'admin123', NULL, 'admin');
INSERT INTO `accounts` VALUES ('ACC0000003', 'coach_li', 'coach123', '13800001002', 'coach');
INSERT INTO `accounts` VALUES ('ACC0000004', 'coach_wang', 'coach123', '13800001003', 'coach');
INSERT INTO `accounts` VALUES ('ACC0000005', 'zhangsan_fit', 'member123', '13900001001', 'member');
INSERT INTO `accounts` VALUES ('ACC0000006', 'lisi_gym', 'member123', '13900001002', 'member');
INSERT INTO `accounts` VALUES ('ACC0000007', 'wangwu2024', 'member123', '13900001003', 'member');
INSERT INTO `accounts` VALUES ('ACC0000008', 'zhaoliu_fitness', 'member123', '13900001004', 'member');
INSERT INTO `accounts` VALUES ('ACC0000009', 'qianqi_sport', 'member123', '13900001005', 'member');
INSERT INTO `accounts` VALUES ('ACC0000010', 'sunba_gym', 'member123', '13900001006', 'member');
INSERT INTO `accounts` VALUES ('ACC0000011', 'zhoujiu_fit', 'member123', '13900001007', 'member');
INSERT INTO `accounts` VALUES ('ACC0000012', 'wushi2024', 'member123', '13900001008', 'member');
INSERT INTO `accounts` VALUES ('ACC0000013', 'zhengshiyi', 'member123', '13900001009', 'member');
INSERT INTO `accounts` VALUES ('ACC0000014', 'wangshier', 'member123', '13900001010', 'member');
INSERT INTO `accounts` VALUES ('ACC0000015', 'chen_reception', 'reception123', '13800001005', 'admin');
INSERT INTO `accounts` VALUES ('ACC0000016', '111', '111', '19729177903', 'member');
INSERT INTO `accounts` VALUES ('ACC0000017', '121', '121', '19729177900', 'member');
INSERT INTO `accounts` VALUES ('ACC0000018', '000', '000', '19729177901', 'member');

-- ----------------------------
-- Table structure for booking_records
-- ----------------------------
DROP TABLE IF EXISTS `booking_records`;
CREATE TABLE `booking_records`  (
  `booking_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `booking_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`booking_id`) USING BTREE,
  INDEX `FK_Bookings_Member`(`member_id` ASC) USING BTREE,
  INDEX `FK_Bookings_Class`(`class_id` ASC) USING BTREE,
  CONSTRAINT `FK_Bookings_Class` FOREIGN KEY (`class_id`) REFERENCES `fitness_classes` (`class_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_Bookings_Member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of booking_records
-- ----------------------------
INSERT INTO `booking_records` VALUES ('BOOK000004', 'MEMBER0004', 'CLASS00003', '2024-11-17 14:15:00', '已确认');
INSERT INTO `booking_records` VALUES ('BOOK000008', 'MEMBER0008', 'CLASS00006', '2024-11-21 13:20:00', '已确认');
INSERT INTO `booking_records` VALUES ('BOOK000012', 'MEMBER0002', 'CLASS00003', '2024-11-25 10:15:00', '已确认');
INSERT INTO `booking_records` VALUES ('BOOK000015', 'MEMBER0005', 'CLASS00006', '2024-11-28 12:45:00', '已确认');

-- ----------------------------
-- Table structure for equipment
-- ----------------------------
DROP TABLE IF EXISTS `equipment`;
CREATE TABLE `equipment`  (
  `equipment_id` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '器材编号',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '器材名称',
  `category` int NOT NULL COMMENT '器材类型(1有氧 2力量 3自由重量 4拉伸 6综合)',
  `area` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '所在区域',
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '状态(使用中/维修中/停用)',
  `health_status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '健康状态(正常/磨损/严重磨损)',
  `usage_count` int NULL DEFAULT NULL COMMENT '日均使用次数',
  `price` decimal(10, 2) NULL DEFAULT NULL COMMENT '器材价格',
  `purchase_date` date NULL DEFAULT NULL COMMENT '购入日期',
  `service_life` int NULL DEFAULT NULL COMMENT '使用年限(年)',
  `last_maintenance_date` date NULL DEFAULT NULL COMMENT '最近维护日期',
  `maintenance_count` int NULL DEFAULT NULL COMMENT '维护次数',
  PRIMARY KEY (`equipment_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '健身房器材表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of equipment
-- ----------------------------
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000001', '跑步机A01', 1, '有氧区', '使用中', '正常', 45, 12000.00, '2023-01-10', 5, '2024-10-15', 2);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000002', '跑步机A02', 1, '有氧区', '使用中', '正常', 38, 12000.00, '2023-01-10', 5, '2024-10-15', 2);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000003', '动感单车B01', 1, '有氧区', '使用中', '磨损', 52, 8000.00, '2022-06-20', 5, '2024-09-20', 3);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000004', '动感单车B02', 1, '有氧区', '使用中', '正常', 48, 8000.00, '2023-03-15', 5, '2024-10-10', 1);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000005', '杠铃架C01', 2, '力量区', '使用中', '正常', 30, 15000.00, '2022-12-01', 8, '2024-08-01', 1);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000006', '史密斯机C02', 2, '力量区', '使用中', '正常', 25, 20000.00, '2023-02-10', 8, '2024-09-15', 1);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000007', '哑铃组D01', 3, '自由重量区', '使用中', '正常', 60, 5000.00, '2023-05-01', 5, '2024-10-01', 0);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000008', '杠铃组D02', 3, '自由重量区', '使用中', '磨损', 40, 6000.00, '2022-08-15', 5, '2024-08-20', 2);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000009', '瑜伽垫E01', 4, '拉伸区', '使用中', '正常', 35, 200.00, '2024-01-01', 2, '2024-10-01', 0);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000010', '拉伸架E02', 4, '拉伸区', '使用中', '正常', 20, 3000.00, '2023-07-01', 5, '2024-09-01', 1);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000011', '综合训练器F01', 6, '综合区', '维修中', '严重磨损', 0, 25000.00, '2021-05-10', 8, '2024-09-01', 5);
INSERT INTO `equipment` VALUES ('EQ0000000000000000000000000012', '椭圆机A03', 1, '有氧区', '停用', '严重磨损', 0, 10000.00, '2020-03-20', 5, '2023-12-01', 8);

-- ----------------------------
-- Table structure for fitness_classes
-- ----------------------------
DROP TABLE IF EXISTS `fitness_classes`;
CREATE TABLE `fitness_classes`  (
  `class_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `coach_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `day_of_week` int NOT NULL COMMENT '周几(1-7，1表示周一，7表示周日)',
  `class_time` time NOT NULL COMMENT '上课时间(格式：HH:mm:ss)',
  `duration_minutes` int NOT NULL COMMENT '课程时长(分钟)',
  `max_capacity` int NOT NULL COMMENT '最大容量',
  `current_enrollment` int NOT NULL DEFAULT 0 COMMENT '当前报名人数',
  PRIMARY KEY (`class_id`) USING BTREE,
  INDEX `FK_Classes_Coach`(`coach_id` ASC) USING BTREE,
  CONSTRAINT `FK_Classes_Coach` FOREIGN KEY (`coach_id`) REFERENCES `staff` (`staff_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of fitness_classes
-- ----------------------------
INSERT INTO `fitness_classes` VALUES ('CLASS00003', '瑜伽放松', 'STAFF00003', 2, '18:30:00', 60, 15, 12);
INSERT INTO `fitness_classes` VALUES ('CLASS00006', '普拉提', 'STAFF00003', 4, '18:00:00', 50, 18, 14);
INSERT INTO `fitness_classes` VALUES ('CLASS00009', '拉伸恢复', 'STAFF00003', 6, '10:00:00', 60, 20, 8);

-- ----------------------------
-- Table structure for members
-- ----------------------------
DROP TABLE IF EXISTS `members`;
CREATE TABLE `members`  (
  `member_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `account_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '关联账号ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真实姓名（可以重复）',
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `membership_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `membership_start_date` date NULL DEFAULT NULL,
  `membership_end_date` date NULL DEFAULT NULL,
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '正常',
  PRIMARY KEY (`member_id`) USING BTREE,
  UNIQUE INDEX `phone`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `uk_account_id`(`account_id` ASC) USING BTREE,
  CONSTRAINT `FK_Members_Account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of members
-- ----------------------------
INSERT INTO `members` VALUES ('MEMBER0001', 'ACC0000005', '张三', '13900001001', '年卡', '2024-01-01', '2024-12-31', '正常');
INSERT INTO `members` VALUES ('MEMBER0002', 'ACC0000006', '李四', '13900001002', '年卡', '2024-02-15', '2025-02-14', '正常');
INSERT INTO `members` VALUES ('MEMBER0003', 'ACC0000007', '王五', '13900001003', '半年卡', '2024-06-01', '2024-11-30', '正常');
INSERT INTO `members` VALUES ('MEMBER0004', 'ACC0000008', '赵六', '13900001004', '季卡', '2024-09-01', '2024-11-30', '正常');
INSERT INTO `members` VALUES ('MEMBER0005', 'ACC0000009', '钱七', '13900001005', '年卡', '2023-12-01', '2024-11-30', '正常');
INSERT INTO `members` VALUES ('MEMBER0006', 'ACC0000010', '王五', '13900001006', '月卡', '2024-11-01', '2024-11-30', '正常');
INSERT INTO `members` VALUES ('MEMBER0007', 'ACC0000011', '张三', '13900001007', '年卡', '2024-03-01', '2025-02-28', '正常');
INSERT INTO `members` VALUES ('MEMBER0008', 'ACC0000012', '吴十', '13900001008', '半年卡', '2024-07-01', '2024-12-31', '正常');
INSERT INTO `members` VALUES ('MEMBER0009', 'ACC0000013', '李四', '13900001009', '年卡', '2024-01-15', '2024-12-14', '正常');
INSERT INTO `members` VALUES ('MEMBER0010', 'ACC0000014', '王十二', '13900001010', '季卡', '2024-10-01', '2024-12-31', '正常');
INSERT INTO `members` VALUES ('MEMBER0011', 'ACC0000016', '111', '19729177903', '普通会员', NULL, NULL, '正常');
INSERT INTO `members` VALUES ('MEMBER0012', 'ACC0000018', '000', '19729177901', '普通会员', NULL, NULL, '正常');

-- ----------------------------
-- Table structure for staff
-- ----------------------------
DROP TABLE IF EXISTS `staff`;
CREATE TABLE `staff`  (
  `staff_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '员工ID',
  `account_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '关联账号ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '真实姓名（可以重复）',
  `role` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '职位(教练/管理员/前台等)',
  `phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '邮箱',
  `specialty` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '专长(教练专长领域)',
  `hire_date` date NULL DEFAULT NULL COMMENT '入职日期',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '在职' COMMENT '状态(在职/离职)',
  `department` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '部门',
  PRIMARY KEY (`staff_id`) USING BTREE,
  UNIQUE INDEX `uk_phone`(`phone` ASC) USING BTREE,
  UNIQUE INDEX `uk_account_id`(`account_id` ASC) USING BTREE,
  CONSTRAINT `FK_Staff_Account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '员工表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of staff
-- ----------------------------
INSERT INTO `staff` VALUES ('STAFF00003', 'ACC0000004', '王教练', '教练', '13800001003', 'wang.coach@fitness.com', '瑜伽、普拉提', '2023-03-10', '在职', '教练部');
INSERT INTO `staff` VALUES ('STAFF00004', 'ACC0000001', '刘经理', '管理员', '13800001004', 'liu.manager@fitness.com', NULL, '2022-06-01', '在职', '管理部');
INSERT INTO `staff` VALUES ('STAFF00005', 'ACC0000015', '陈前台', '前台', '13800001005', 'chen.reception@fitness.com', NULL, '2023-05-01', '在职', '前台部');

-- ----------------------------
-- Table structure for transactions
-- ----------------------------
DROP TABLE IF EXISTS `transactions`;
CREATE TABLE `transactions`  (
  `transaction_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `member_id` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` decimal(10, 2) NOT NULL,
  `transaction_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL,
  `transaction_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transaction_id`) USING BTREE,
  INDEX `FK_Transactions_Member`(`member_id` ASC) USING BTREE,
  CONSTRAINT `FK_Transactions_Member` FOREIGN KEY (`member_id`) REFERENCES `members` (`member_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of transactions
-- ----------------------------
INSERT INTO `transactions` VALUES ('TXN0000001', 'MEMBER0001', 3000.00, '会员费', '年卡会员费', '2024-01-01 10:00:00');
INSERT INTO `transactions` VALUES ('TXN0000002', 'MEMBER0002', 3000.00, '会员费', '年卡会员费', '2024-02-15 14:30:00');
INSERT INTO `transactions` VALUES ('TXN0000003', 'MEMBER0003', 1800.00, '会员费', '半年卡会员费', '2024-06-01 11:20:00');
INSERT INTO `transactions` VALUES ('TXN0000004', 'MEMBER0004', 900.00, '会员费', '季卡会员费', '2024-09-01 09:15:00');
INSERT INTO `transactions` VALUES ('TXN0000005', 'MEMBER0005', 3000.00, '会员费', '年卡会员费', '2023-12-01 15:45:00');
INSERT INTO `transactions` VALUES ('TXN0000006', 'MEMBER0006', 500.00, '会员费', '月卡会员费', '2024-11-01 10:30:00');
INSERT INTO `transactions` VALUES ('TXN0000007', 'MEMBER0007', 3000.00, '会员费', '年卡会员费', '2024-03-01 13:20:00');
INSERT INTO `transactions` VALUES ('TXN0000008', 'MEMBER0008', 1800.00, '会员费', '半年卡会员费', '2024-07-01 16:00:00');
INSERT INTO `transactions` VALUES ('TXN0000009', 'MEMBER0009', 3000.00, '会员费', '年卡会员费', '2024-01-15 11:10:00');
INSERT INTO `transactions` VALUES ('TXN0000010', 'MEMBER0010', 900.00, '会员费', '季卡会员费', '2024-10-01 14:00:00');
INSERT INTO `transactions` VALUES ('TXN0000011', 'MEMBER0001', 200.00, '课程费', '私教课程费用', '2024-11-10 10:00:00');
INSERT INTO `transactions` VALUES ('TXN0000012', 'MEMBER0002', 150.00, '课程费', '团课课程费用', '2024-11-12 15:30:00');
INSERT INTO `transactions` VALUES ('TXN0000013', 'MEMBER0003', 200.00, '课程费', '私教课程费用', '2024-11-14 09:20:00');
INSERT INTO `transactions` VALUES ('TXN0000014', 'MEMBER0005', 100.00, '其他', '器材租赁费', '2024-11-20 16:45:00');
INSERT INTO `transactions` VALUES ('TXN0000015', 'MEMBER0007', 150.00, '课程费', '团课课程费用', '2024-11-22 11:00:00');

SET FOREIGN_KEY_CHECKS = 1;
