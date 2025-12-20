package org.example.demo.mapper;

import org.example.demo.entity.Member;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface MemberMapper {

    String selectMaxMemberId();

    int insert(Member member);

    Member selectByMemberId(@Param("memberId") String memberId);

    int updateBaseInfo(@Param("memberId") String memberId,
                       @Param("name") String name,
                       @Param("phone") String phone);

    Member selectByField(@Param("field") String field,
                         @Param("value") String value);
}
