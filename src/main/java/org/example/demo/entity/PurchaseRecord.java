package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 购买记录实体类
 */
@Getter
@Setter
public class PurchaseRecord {
    private String purchaseId;
    private String memberId;
    private String packageId;
    private BigDecimal amount;
    private String paymentStatus;  // 待支付/已支付/已取消
    private LocalDateTime purchaseTime;
    private LocalDateTime paymentTime;
}



