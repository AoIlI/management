package org.example.demo.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.example.demo.entity.User;

import java.util.List;

@Mapper
public interface UserMapper {
    List<User> selectAll();
}
