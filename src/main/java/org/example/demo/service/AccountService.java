package org.example.demo.service;

import org.example.demo.mapper.AccountMapper;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class AccountService {

    private final AccountMapper accountMapper;

    public AccountService(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }
    public boolean verifyUsernameAndPhone(String username, String phone) {
        return accountMapper.countByUsernameAndPhone(username, phone) > 0;
    }

    /**
     * 重设密码
     */
    public boolean resetPassword(String username, String newPassword) {
        // 和你注册时保持一致（如果注册没加密，这里也别加）
        String encrypted = DigestUtils.md5DigestAsHex(newPassword.getBytes());
        return accountMapper.updatePassword(username, encrypted) > 0;
    }
}
