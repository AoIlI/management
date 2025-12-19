package org.example.demo.service.impl;

import org.example.demo.entity.Member;
import org.example.demo.mapper.UserMapper;
import org.example.demo.service.Userservice;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserserviceImpl implements Userservice {

    private final UserMapper userMapper;

    public UserserviceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public List<Member> list() {
        return userMapper.selectAll();
    }
}
