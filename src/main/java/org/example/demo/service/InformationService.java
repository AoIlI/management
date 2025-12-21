package org.example.demo.service;

import org.example.demo.entity.Account;
import org.example.demo.entity.Member;
import org.example.demo.entity.Staff;

public interface InformationService {

    Member getMemberInfo(String accountId);  // 通过accountId获取会员信息

    Account getAccountInfo(String accountId);  // 通过accountId获取账号信息
    
    Staff getStaffInfo(String accountId);  // 通过accountId获取员工信息

    void updateMemberBaseInfo(String accountId, String name, String phone);
    
    void updateStaffBaseInfo(String accountId, String name, String phone);

    boolean isUnique(String accountId, String role, String field, String value);
}
