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
}
