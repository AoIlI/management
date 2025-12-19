package org.example.demo.service.impl;

import org.example.demo.entity.User;
import org.example.demo.mapper.UserMapper;
import org.example.demo.service.Userservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserserviceImpl implements Userservice {

    private final UserMapper userMapper;

    public UserserviceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public List<User> list() {
        return userMapper.selectAll();
    }

    @Override
    public void deleteById(String memberId) {
        userMapper.deleteById(memberId);
    }
}
