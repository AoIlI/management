-- 健身房课程数据插入脚本（动态日期版本）
-- 说明：此版本使用MySQL日期函数，自动从当前日期开始计算
-- 使用方式：将脚本中的 CURDATE() 替换为具体日期，或使用 CURRENT_DATE + INTERVAL N DAY

-- 设置起始日期（可以根据需要修改）
SET @start_date = CURDATE(); -- 使用今天作为起始日期，或改为具体日期如 '2024-12-16'

-- ============ 周一课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C001', '晨间瑜伽', 'S001', DATE_ADD(@start_date, INTERVAL 0 DAY) + INTERVAL 7 HOUR, 60, 20, 12, 'ACTIVE'),
('C002', '力量训练基础', 'S002', DATE_ADD(@start_date, INTERVAL 0 DAY) + INTERVAL 9 HOUR, 60, 15, 8, 'ACTIVE'),
('C003', '动感单车', 'S003', DATE_ADD(@start_date, INTERVAL 0 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 45, 25, 18, 'ACTIVE'),
('C004', '普拉提', 'S004', DATE_ADD(@start_date, INTERVAL 0 DAY) + INTERVAL 14 HOUR, 60, 18, 10, 'ACTIVE'),
('C005', '有氧健身操', 'S001', DATE_ADD(@start_date, INTERVAL 0 DAY) + INTERVAL 18 HOUR, 45, 30, 22, 'ACTIVE'),
('C006', '核心力量训练', 'S002', DATE_ADD(@start_date, INTERVAL 0 DAY) + INTERVAL 19 HOUR + INTERVAL 30 MINUTE, 60, 20, 15, 'ACTIVE');

-- ============ 周二课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C007', '晨间有氧', 'S001', DATE_ADD(@start_date, INTERVAL 1 DAY) + INTERVAL 7 HOUR + INTERVAL 30 MINUTE, 45, 25, 16, 'ACTIVE'),
('C008', '瑜伽中级', 'S004', DATE_ADD(@start_date, INTERVAL 1 DAY) + INTERVAL 9 HOUR, 75, 18, 12, 'ACTIVE'),
('C009', '杠铃操', 'S002', DATE_ADD(@start_date, INTERVAL 1 DAY) + INTERVAL 10 HOUR, 60, 20, 14, 'ACTIVE'),
('C010', '动感单车', 'S003', DATE_ADD(@start_date, INTERVAL 1 DAY) + INTERVAL 14 HOUR + INTERVAL 30 MINUTE, 45, 25, 20, 'ACTIVE'),
('C011', '拉伸放松', 'S004', DATE_ADD(@start_date, INTERVAL 1 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 45, 22, 8, 'ACTIVE'),
('C012', 'HIIT高强度训练', 'S003', DATE_ADD(@start_date, INTERVAL 1 DAY) + INTERVAL 19 HOUR, 45, 20, 18, 'ACTIVE');

-- ============ 周三课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C013', '晨间瑜伽', 'S004', DATE_ADD(@start_date, INTERVAL 2 DAY) + INTERVAL 7 HOUR, 60, 20, 13, 'ACTIVE'),
('C014', '拳击训练', 'S005', DATE_ADD(@start_date, INTERVAL 2 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 60, 15, 10, 'ACTIVE'),
('C015', '动感单车', 'S003', DATE_ADD(@start_date, INTERVAL 2 DAY) + INTERVAL 11 HOUR, 45, 25, 19, 'ACTIVE'),
('C016', '普拉提', 'S004', DATE_ADD(@start_date, INTERVAL 2 DAY) + INTERVAL 14 HOUR, 60, 18, 11, 'ACTIVE'),
('C017', '有氧健身操', 'S001', DATE_ADD(@start_date, INTERVAL 2 DAY) + INTERVAL 18 HOUR, 45, 30, 24, 'ACTIVE'),
('C018', '力量训练进阶', 'S002', DATE_ADD(@start_date, INTERVAL 2 DAY) + INTERVAL 19 HOUR + INTERVAL 30 MINUTE, 60, 15, 12, 'ACTIVE');

-- ============ 周四课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C019', '晨间有氧', 'S001', DATE_ADD(@start_date, INTERVAL 3 DAY) + INTERVAL 7 HOUR + INTERVAL 30 MINUTE, 45, 25, 15, 'ACTIVE'),
('C020', '瑜伽初级', 'S004', DATE_ADD(@start_date, INTERVAL 3 DAY) + INTERVAL 9 HOUR, 60, 20, 14, 'ACTIVE'),
('C021', '杠铃操', 'S002', DATE_ADD(@start_date, INTERVAL 3 DAY) + INTERVAL 10 HOUR, 60, 20, 13, 'ACTIVE'),
('C022', '动感单车', 'S003', DATE_ADD(@start_date, INTERVAL 3 DAY) + INTERVAL 14 HOUR + INTERVAL 30 MINUTE, 45, 25, 21, 'ACTIVE'),
('C023', '拉伸放松', 'S004', DATE_ADD(@start_date, INTERVAL 3 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 45, 22, 9, 'ACTIVE'),
('C024', 'HIIT高强度训练', 'S003', DATE_ADD(@start_date, INTERVAL 3 DAY) + INTERVAL 19 HOUR, 45, 20, 17, 'ACTIVE');

-- ============ 周五课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C025', '晨间瑜伽', 'S001', DATE_ADD(@start_date, INTERVAL 4 DAY) + INTERVAL 7 HOUR, 60, 20, 11, 'ACTIVE'),
('C026', '力量训练基础', 'S002', DATE_ADD(@start_date, INTERVAL 4 DAY) + INTERVAL 9 HOUR, 60, 15, 9, 'ACTIVE'),
('C027', '动感单车', 'S003', DATE_ADD(@start_date, INTERVAL 4 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 45, 25, 16, 'ACTIVE'),
('C028', '普拉提', 'S004', DATE_ADD(@start_date, INTERVAL 4 DAY) + INTERVAL 14 HOUR, 60, 18, 10, 'ACTIVE'),
('C029', '有氧健身操', 'S001', DATE_ADD(@start_date, INTERVAL 4 DAY) + INTERVAL 18 HOUR, 45, 30, 25, 'ACTIVE'),
('C030', '核心力量训练', 'S002', DATE_ADD(@start_date, INTERVAL 4 DAY) + INTERVAL 19 HOUR + INTERVAL 30 MINUTE, 60, 20, 14, 'ACTIVE');

-- ============ 周六课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C031', '晨间瑜伽', 'S004', DATE_ADD(@start_date, INTERVAL 5 DAY) + INTERVAL 8 HOUR, 60, 20, 15, 'ACTIVE'),
('C032', '拳击训练', 'S005', DATE_ADD(@start_date, INTERVAL 5 DAY) + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 60, 15, 11, 'ACTIVE'),
('C033', '动感单车', 'S003', DATE_ADD(@start_date, INTERVAL 5 DAY) + INTERVAL 10 HOUR + INTERVAL 30 MINUTE, 45, 25, 20, 'ACTIVE'),
('C034', '瑜伽中级', 'S004', DATE_ADD(@start_date, INTERVAL 5 DAY) + INTERVAL 14 HOUR, 75, 18, 13, 'ACTIVE'),
('C035', 'HIIT高强度训练', 'S003', DATE_ADD(@start_date, INTERVAL 5 DAY) + INTERVAL 16 HOUR, 45, 20, 16, 'ACTIVE'),
('C036', '拉伸放松', 'S004', DATE_ADD(@start_date, INTERVAL 5 DAY) + INTERVAL 17 HOUR + INTERVAL 30 MINUTE, 45, 22, 12, 'ACTIVE');

-- ============ 周日课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C037', '晨间有氧', 'S001', DATE_ADD(@start_date, INTERVAL 6 DAY) + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 45, 25, 18, 'ACTIVE'),
('C038', '瑜伽初级', 'S004', DATE_ADD(@start_date, INTERVAL 6 DAY) + INTERVAL 10 HOUR, 60, 20, 16, 'ACTIVE'),
('C039', '动感单车', 'S003', DATE_ADD(@start_date, INTERVAL 6 DAY) + INTERVAL 14 HOUR, 45, 25, 22, 'ACTIVE'),
('C040', '核心力量训练', 'S002', DATE_ADD(@start_date, INTERVAL 6 DAY) + INTERVAL 15 HOUR + INTERVAL 30 MINUTE, 60, 20, 12, 'ACTIVE'),
('C041', '拉伸放松', 'S004', DATE_ADD(@start_date, INTERVAL 6 DAY) + INTERVAL 17 HOUR, 45, 22, 10, 'ACTIVE');

-- 说明：
-- 1. 此脚本使用 @start_date 变量作为起始日期
-- 2. 默认使用 CURDATE()（当前日期），可以改为具体日期如 '2024-12-16'
-- 3. 使用 DATE_ADD 和 INTERVAL 来自动计算后续日期和时间
-- 4. 执行前请确保表中没有相同的 class_id，或先清空/删除现有数据


