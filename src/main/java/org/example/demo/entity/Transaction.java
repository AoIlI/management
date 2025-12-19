package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

public class Transaction {
    @Getter
    @Setter
    private String transactionId;
    @Getter
    @Setter
    private String memberId;
    @Getter
    @Setter
    private double amount;
    @Getter
    @Setter
    private String transactionType;
    @Getter
    @Setter
    private String date;
    @Getter
    @Setter
    private String description;
}
