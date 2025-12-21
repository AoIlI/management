package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class Member {
    @Setter
    @Getter
    private String memberId;
    @Setter
    @Getter
    private String accountId;  // 关联账号ID
    @Setter
    @Getter
    private String name;  // 真实姓名（可以重复）
    @Setter
    @Getter
    private String phone;
    @Setter
    @Getter
    private String membershipType;
    @Setter
    @Getter
    private LocalDate membershipStartDate;
    @Setter
    @Getter
    private LocalDate membershipEndDate;
    @Setter
    @Getter
    private String status;
    @Setter
    @Getter
    private Integer availableClasses;  // 可用课程次数
    @Setter
    @Getter
    private LocalDate lastResetDate;  // 上次重置次数日期
}
