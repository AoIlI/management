package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * 套餐实体类
 */
@Getter
@Setter
public class Package {
    private String packageId;
    private String packageName;
    private String packageType;  // membership_card / class_pack
    private String membershipType;  // 年卡/季卡/月卡（仅会员卡类型）
    private Integer classesCount;  // 课程次数（仅课程包类型）
    private BigDecimal price;
    private String description;
    private Integer classesPerMonth;  // 每月课程次数（会员卡类型）
    private Integer validityDays;  // 有效期天数（会员卡类型）
    private String status;  // 启用/停用
}



