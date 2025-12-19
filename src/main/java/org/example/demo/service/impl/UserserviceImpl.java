package org.example.demo.service.impl;

import org.example.demo.entity.Member;
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
    public List<Member> list() {
        return userMapper.selectAll();
    }

    @Override
    public void deleteById(String memberId) {
        userMapper.deleteById(memberId);
    }

    @Override
    public void updateUser(User user) {
        userMapper.updateUser(user);
    }

    @Override
    public User getUserById(String memberId) {
        return userMapper.getUserById(memberId);
    }

    @Override
    public List<User> searchUsers(String keyword) {
        return userMapper.searchUsers(keyword);
    }
}
