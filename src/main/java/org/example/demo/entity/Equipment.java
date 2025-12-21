package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

public class Equipment {
    @Getter
    @Setter
    private String equipmentId;
    @Getter
    @Setter
    private String name;
    @Getter
    @Setter
    private String status;
    @Getter
    @Setter
    private String purchaseDate;
    @Getter
    @Setter
    private Integer category;
    @Getter
    @Setter
    private String healthStatus;
    @Getter
    @Setter
    private Integer serviceLife;
    @Getter
    @Setter
    private String lastMaintenanceDate;
    @Getter
    @Setter
    private Integer maintenanceCount;
    @Getter
    @Setter
    private Integer usageCount;
    @Getter
    @Setter
    private double price;
    @Getter
    @Setter
    private String area;
}
