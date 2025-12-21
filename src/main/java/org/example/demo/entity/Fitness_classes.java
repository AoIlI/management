package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalTime;

public class Fitness_classes {
    @Getter
    @Setter
    private String classId;
    @Getter
    @Setter
    private String className;
    @Getter
    @Setter
    private String coachId;
    @Getter
    @Setter
    private String coachName;  // 教练名（从staff表获取，不创建新实体类）
    @Getter
    @Setter
    private Integer dayOfWeek;  // 周几(1-7，1表示周一，7表示周日)
    @Getter
    @Setter
    private LocalTime classTime;  // 上课时间
    @Getter
    @Setter
    private Integer durationMinutes;
    @Getter
    @Setter
    private Integer maxCapacity;
    @Getter
    @Setter
    private Integer currentEnrollment;
}
