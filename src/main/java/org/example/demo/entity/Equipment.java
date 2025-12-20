package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

public class Equipment {
    @Getter
    @Setter
    private String equipment_id;
    @Getter
    @Setter
    private String name;
    @Getter
    @Setter
    private String status;
    @Getter
    @Setter
    private String purchase_date;
    @Getter
    @Setter
    private Integer category;
    @Getter
    @Setter
    private String health_status;
    @Getter
    @Setter
    private Integer service_life;
    @Getter
    @Setter
    private String last_maintenance_date;
    @Getter
    @Setter
    private Integer maintenance_count;
    @Getter
    @Setter
    private Integer usage_count;
    @Getter
    @Setter
    private double price;
    @Getter
    @Setter
    private String area;
}
