package org.example.demo.service;

import org.example.demo.entity.Member;

public interface InformationService {

    Member getMemberInfo(String memberId);

    void updateMemberBaseInfo(String memberId, String name, String phone);

    boolean isUnique(String selfId, String field, String value);
}
