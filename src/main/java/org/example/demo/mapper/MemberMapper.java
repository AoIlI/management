package org.example.demo.mapper;

import org.example.demo.entity.Member;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MemberMapper {

    String selectMaxMemberId();

    int insert(Member member);
}
