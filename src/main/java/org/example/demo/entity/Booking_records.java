package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

public class Booking_records {
    @Getter
    @Setter
    private String bookingId;
    @Getter
    @Setter
    private String memberId;
    @Getter
    @Setter
    private String classId;
    @Getter
    @Setter
    private String bookingDate;
    @Getter
    @Setter
    private String status;
}
