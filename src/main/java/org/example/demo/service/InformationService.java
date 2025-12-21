package org.example.demo.service;

import org.example.demo.entity.Account;
import org.example.demo.entity.Member;

public interface InformationService {

    Member getMemberInfo(String accountId);  // 通过accountId获取会员信息

    Account getAccountInfo(String accountId);  // 通过accountId获取账号信息

    void updateMemberBaseInfo(String accountId, String name, String phone);

    boolean isUnique(String accountId, String field, String value);
}
