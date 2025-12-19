package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.demo.entity.User;

import java.util.List;

@Mapper
public interface UserMapper {
    List<User> selectAll();

    void deleteById(String memberId);

    void updateUser(User user);

    User getUserById(String memberId);

    List<User> searchUsers(String keyword);
}
