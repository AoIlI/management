package org.example.demo.service;

import org.example.demo.mapper.AccountMapper;
import org.example.demo.entity.Account;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RecoverService {

    private final AccountMapper accountMapper;

    public RecoverService(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    public boolean checkUsernamePhone(String username, String phone) {
        Account account = accountMapper.selectByUsername(username);
        return account != null && phone.equals(account.getPhone());
    }

    @Transactional
    public boolean resetPassword(String username, String newPassword) {
        Account account = accountMapper.selectByUsername(username);
        if (account == null) return false;

        int updated = accountMapper.updatePassword(username, newPassword);
        return updated > 0;
    }
}
