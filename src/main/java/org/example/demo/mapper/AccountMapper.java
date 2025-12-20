package org.example.demo.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Update;
import org.example.demo.entity.Account;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface AccountMapper {
    int insert(Account account);
    Account selectByUsername(String username);
    Account selectByPhone(String phone);
    Account selectByUsernameAndPassword(@Param("username") String username,
                                        @Param("password") String password);
    int updatePassword(@Param("username") String username, @Param("password") String password);
}
