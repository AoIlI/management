package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

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
    private String membershipStartDate;
    @Setter
    @Getter
    private String membershipEndDate;
    @Setter
    @Getter
    private String status;

}
