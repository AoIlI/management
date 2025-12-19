package org.example.demo.controller;

import org.example.demo.service.AccountService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
public class PasswordController {

    private final AccountService accountService;

    public PasswordController(AccountService accountService) {
        this.accountService = accountService;
    }

    // 校验用户名和手机号
    @PostMapping("/verify")
    public String verifyUser(@RequestParam String username, @RequestParam String phone) {
        boolean ok = accountService.verifyUsernameAndPhone(username, phone);
        return Boolean.toString(ok); // 返回 "true" 或 "false" 字符串
    }

    // 重设密码
    @PostMapping("/reset")
    public String resetPassword(@RequestParam String username, @RequestParam String password) {
        boolean ok = accountService.resetPassword(username, password);
        return Boolean.toString(ok); // 返回 "true" 或 "false" 字符串
    }
}
