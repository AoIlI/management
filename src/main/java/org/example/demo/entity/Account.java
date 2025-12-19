package org.example.demo.entity;

import lombok.Data;

@Data
public class Account {

    private String accountId; // 全局ID（staff_id / member_id）
    private String username;
    private String password;
    private String phone;
    private String role; // admin / coach / member
}
