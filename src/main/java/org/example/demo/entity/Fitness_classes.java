package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

public class Fitness_classes {
    @Getter
    @Setter
    private String class_id;
    @Getter
    @Setter
    private String class_name;
    @Getter
    @Setter
    private String coach_id;
    @Getter
    @Setter
    private String schedule_time;
    @Getter
    @Setter
    private Integer duration_minutes;
    @Getter
    @Setter
    private Integer max_capacity;
    @Getter
    @Setter
    private Integer current_enrollment;
    @Getter
    @Setter
    private String coursestatus;
}
