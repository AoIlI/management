package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

public class Booking_records {
    @Getter
    @Setter
    private String booking_id;
    @Getter
    @Setter
    private String member_id;
    @Getter
    @Setter
    private String class_id;
    @Getter
    @Setter
    private String booking_date;
    @Getter
    @Setter
    private String status;
}
