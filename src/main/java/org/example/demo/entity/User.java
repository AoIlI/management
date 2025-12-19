package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

public class User {
    @Setter @Getter private String member_id;
    @Setter @Getter private String name;
    @Setter @Getter private String phone;
    @Setter @Getter private String membership_type;
    @Setter @Getter private String membership_start_date;
    @Setter @Getter private String membership_end_date;
    @Setter @Getter private String status;
    @Setter @Getter private String account_status;
}
