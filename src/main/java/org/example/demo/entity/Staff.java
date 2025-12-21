package org.example.demo.entity;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

public class Staff {
    @Getter
    @Setter
    private String staffId;
    @Getter
    @Setter
    private String accountId;  // 关联账号ID
    @Getter
    @Setter
    private String name;  // 真实姓名（可以重复）
    @Getter
    @Setter
    private String role;
    @Getter
    @Setter
    private String phone;
    @Getter
    @Setter
    private String email;
    @Getter
    @Setter
    private String specialty;
    @Getter
    @Setter
    private LocalDate hireDate;
    @Getter
    @Setter
    private String status;  // 在职/离职
    @Getter
    @Setter
    private String department;
}
