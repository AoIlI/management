-- 健身房课程数据插入脚本
-- 表名：fitness_classes
-- 说明：插入合理的课程测试数据

-- 假设当前日期为2024年，课程安排为接下来一周的时间

-- 清空现有数据（可选，根据实际情况决定是否执行）
-- DELETE FROM fitness_classes;

-- 插入课程数据
-- 注意：schedule_time格式为 'YYYY-MM-DD HH:mm:ss'

-- ============ 周一课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C001', '晨间瑜伽', 'S001', '2024-12-16 07:00:00', 60, 20, 12, 'ACTIVE'),
('C002', '力量训练基础', 'S002', '2024-12-16 09:00:00', 60, 15, 8, 'ACTIVE'),
('C003', '动感单车', 'S003', '2024-12-16 10:30:00', 45, 25, 18, 'ACTIVE'),
('C004', '普拉提', 'S004', '2024-12-16 14:00:00', 60, 18, 10, 'ACTIVE'),
('C005', '有氧健身操', 'S001', '2024-12-16 18:00:00', 45, 30, 22, 'ACTIVE'),
('C006', '核心力量训练', 'S002', '2024-12-16 19:30:00', 60, 20, 15, 'ACTIVE');

-- ============ 周二课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C007', '晨间有氧', 'S001', '2024-12-17 07:30:00', 45, 25, 16, 'ACTIVE'),
('C008', '瑜伽中级', 'S004', '2024-12-17 09:00:00', 75, 18, 12, 'ACTIVE'),
('C009', '杠铃操', 'S002', '2024-12-17 10:00:00', 60, 20, 14, 'ACTIVE'),
('C010', '动感单车', 'S003', '2024-12-17 14:30:00', 45, 25, 20, 'ACTIVE'),
('C011', '拉伸放松', 'S004', '2024-12-17 17:30:00', 45, 22, 8, 'ACTIVE'),
('C012', 'HIIT高强度训练', 'S003', '2024-12-17 19:00:00', 45, 20, 18, 'ACTIVE');

-- ============ 周三课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C013', '晨间瑜伽', 'S004', '2024-12-18 07:00:00', 60, 20, 13, 'ACTIVE'),
('C014', '拳击训练', 'S005', '2024-12-18 09:30:00', 60, 15, 10, 'ACTIVE'),
('C015', '动感单车', 'S003', '2024-12-18 11:00:00', 45, 25, 19, 'ACTIVE'),
('C016', '普拉提', 'S004', '2024-12-18 14:00:00', 60, 18, 11, 'ACTIVE'),
('C017', '有氧健身操', 'S001', '2024-12-18 18:00:00', 45, 30, 24, 'ACTIVE'),
('C018', '力量训练进阶', 'S002', '2024-12-18 19:30:00', 60, 15, 12, 'ACTIVE');

-- ============ 周四课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C019', '晨间有氧', 'S001', '2024-12-19 07:30:00', 45, 25, 15, 'ACTIVE'),
('C020', '瑜伽初级', 'S004', '2024-12-19 09:00:00', 60, 20, 14, 'ACTIVE'),
('C021', '杠铃操', 'S002', '2024-12-19 10:00:00', 60, 20, 13, 'ACTIVE'),
('C022', '动感单车', 'S003', '2024-12-19 14:30:00', 45, 25, 21, 'ACTIVE'),
('C023', '拉伸放松', 'S004', '2024-12-19 17:30:00', 45, 22, 9, 'ACTIVE'),
('C024', 'HIIT高强度训练', 'S003', '2024-12-19 19:00:00', 45, 20, 17, 'ACTIVE');

-- ============ 周五课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C025', '晨间瑜伽', 'S001', '2024-12-20 07:00:00', 60, 20, 11, 'ACTIVE'),
('C026', '力量训练基础', 'S002', '2024-12-20 09:00:00', 60, 15, 9, 'ACTIVE'),
('C027', '动感单车', 'S003', '2024-12-20 10:30:00', 45, 25, 16, 'ACTIVE'),
('C028', '普拉提', 'S004', '2024-12-20 14:00:00', 60, 18, 10, 'ACTIVE'),
('C029', '有氧健身操', 'S001', '2024-12-20 18:00:00', 45, 30, 25, 'ACTIVE'),
('C030', '核心力量训练', 'S002', '2024-12-20 19:30:00', 60, 20, 14, 'ACTIVE');

-- ============ 周六课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C031', '晨间瑜伽', 'S004', '2024-12-21 08:00:00', 60, 20, 15, 'ACTIVE'),
('C032', '拳击训练', 'S005', '2024-12-21 09:30:00', 60, 15, 11, 'ACTIVE'),
('C033', '动感单车', 'S003', '2024-12-21 10:30:00', 45, 25, 20, 'ACTIVE'),
('C034', '瑜伽中级', 'S004', '2024-12-21 14:00:00', 75, 18, 13, 'ACTIVE'),
('C035', 'HIIT高强度训练', 'S003', '2024-12-21 16:00:00', 45, 20, 16, 'ACTIVE'),
('C036', '拉伸放松', 'S004', '2024-12-21 17:30:00', 45, 22, 12, 'ACTIVE');

-- ============ 周日课程 ============
INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
('C037', '晨间有氧', 'S001', '2024-12-22 08:30:00', 45, 25, 18, 'ACTIVE'),
('C038', '瑜伽初级', 'S004', '2024-12-22 10:00:00', 60, 20, 16, 'ACTIVE'),
('C039', '动感单车', 'S003', '2024-12-22 14:00:00', 45, 25, 22, 'ACTIVE'),
('C040', '核心力量训练', 'S002', '2024-12-22 15:30:00', 60, 20, 12, 'ACTIVE'),
('C041', '拉伸放松', 'S004', '2024-12-22 17:00:00', 45, 22, 10, 'ACTIVE');

-- ============ 下周重复课程（可选） ============
-- 如果需要更多数据，可以添加下周的课程
-- INSERT INTO fitness_classes (class_id, class_name, coach_id, schedule_time, duration_minutes, max_capacity, current_enrollment, coursestatus) VALUES
-- ('C042', '晨间瑜伽', 'S001', '2024-12-23 07:00:00', 60, 20, 0, 'ACTIVE'),
-- ... 更多课程


-- 数据说明：
-- 1. 课程ID格式：C001-C041（可根据需要扩展）
-- 2. 教练ID：S001-S005（假设有5位教练）
--    - S001: 有氧、瑜伽教练
--    - S002: 力量训练教练
--    - S003: 动感单车、HIIT教练
--    - S004: 瑜伽、普拉提教练
--    - S005: 拳击教练
-- 3. 课程类型：
--    - 瑜伽类（初级、中级、晨间瑜伽）
--    - 力量训练（基础、进阶、核心力量）
--    - 有氧类（有氧健身操、动感单车、HIIT）
--    - 其他（普拉提、拳击、拉伸放松、杠铃操）
-- 4. 时间段分布：
--    - 早上：7:00-8:30
--    - 上午：9:00-11:00
--    - 下午：14:00-17:30
--    - 晚上：18:00-19:30
-- 5. 课程时长：45分钟、60分钟、75分钟
-- 6. 容量设置：15-30人不等
-- 7. 当前报名人数：设置为0到接近最大容量的合理数值
-- 8. 所有课程状态均为ACTIVE（活跃）

-- 注意事项：
-- 1. 请根据实际日期调整schedule_time中的日期
-- 2. 请根据实际的coach_id调整教练ID
-- 3. 如果表中已有数据，请注意避免ID冲突
-- 4. 建议先查询现有数据：SELECT * FROM fitness_classes;


