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
    private String name;
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
    private String accountStatus;
}
