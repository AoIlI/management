package org.example.demo.service.impl;

import org.example.demo.entity.User;
import org.example.demo.mapper.AccountMapper;
import org.example.demo.mapper.UserMapper;
import org.example.demo.service.Userservice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
public class UserserviceImpl implements Userservice {

    private final UserMapper userMapper;
    private final AccountMapper accountMapper;

    public UserserviceImpl(UserMapper userMapper, AccountMapper accountMapper) {
        this.userMapper = userMapper;
        this.accountMapper = accountMapper;
    }

    @Override
    public List<User> list() {
        return userMapper.selectAll();
    }

    @Override
    @Transactional
    public void deleteById(String memberId) {
        // 1. 先获取用户的accountId
        User user = userMapper.getUserById(memberId);
        if (user == null) {
            throw new RuntimeException("用户不存在");
        }
        
        String accountId = user.getAccountId();
        if (accountId == null) {
            throw new RuntimeException("用户账号信息不存在");
        }
        
        // 2. 先删除members表记录
        userMapper.deleteById(memberId);
        
        // 3. 删除accounts表记录（由于外键约束，members表是子表，accounts表是父表，
        //    删除members不会自动删除accounts，所以需要手动删除accounts）
        accountMapper.deleteByAccountId(accountId);
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
