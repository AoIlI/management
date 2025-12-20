package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.example.demo.entity.Account;

@Mapper
public interface AccountMapper {

    int insert(Account account);

    Account selectByUsername(@Param("username") String username);

    Account selectByPhone(@Param("phone") String phone);

    Account selectByUsernameAndPassword(@Param("username") String username,
                                        @Param("password") String password);

    int updatePassword(@Param("username") String username,
                       @Param("password") String password);

    int updateUsernameAndPhone(@Param("accountId") String accountId,
                               @Param("username") String username,
                               @Param("phone") String phone);
    int updateBaseInfoByAccountId(@Param("accountId") String accountId,
                                  @Param("username") String username,
                                  @Param("phone") String phone);

}
