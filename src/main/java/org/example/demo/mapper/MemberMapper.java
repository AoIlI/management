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
    
    Member selectByAccountId(@Param("accountId") String accountId);
    
    int updateAvailableClasses(@Param("memberId") String memberId, 
                              @Param("availableClasses") Integer availableClasses);
    
    int updateMembershipAndClasses(@Param("memberId") String memberId,
                                   @Param("membershipType") String membershipType,
                                   @Param("membershipStartDate") java.time.LocalDate membershipStartDate,
                                   @Param("membershipEndDate") java.time.LocalDate membershipEndDate,
                                   @Param("availableClasses") Integer availableClasses,
                                   @Param("lastResetDate") java.time.LocalDate lastResetDate);
    
    int addAvailableClasses(@Param("memberId") String memberId,
                           @Param("addCount") Integer addCount);
}
