package org.example.demo.service;

import org.example.demo.entity.Account;
import org.example.demo.mapper.AccountMapper;
import org.springframework.stereotype.Service;

@Service
public class LoginService {

    private final AccountMapper accountMapper;

    public LoginService(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    public Account login(String username, String password) {
        return accountMapper.selectByUsernameAndPassword(username, password);
    }
}
