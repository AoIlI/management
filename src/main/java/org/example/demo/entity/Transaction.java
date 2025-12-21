package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Transaction {
    @Getter
    @Setter
    private String transactionId;
    @Getter
    @Setter
    private String memberId;
    @Getter
    @Setter
    private BigDecimal amount;
    @Getter
    @Setter
    private String transactionType;
    @Getter
    @Setter
    private LocalDateTime transactionTime;
    @Getter
    @Setter
    private String description;
}
