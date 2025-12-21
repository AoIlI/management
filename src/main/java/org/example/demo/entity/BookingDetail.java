package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * 预约记录详情（包含课程信息）
 */
@Getter
@Setter
public class BookingDetail {
    private String bookingId;
    private String memberId;
    private String classId;
    private String bookingDate;
    private String status;
    
    // 课程信息
    private String className;
    private String coachId;
    private Integer dayOfWeek;
    private String classTime;
    private Integer durationMinutes;
    private Integer maxCapacity;
    private Integer currentEnrollment;
}


