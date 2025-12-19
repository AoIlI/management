package org.example.demo.controller;

import org.example.demo.entity.Account;
import org.example.demo.mapper.AccountMapper;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    private final AccountMapper accountMapper;

    public LoginController(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password,
                        HttpSession session) {

        Account account = accountMapper.selectByUsername(username);

        // 1️⃣ 用户不存在
        if (account == null) {
            return "redirect:/?error=true";
        }

        // 2️⃣ 密码不匹配
        if (!account.getPassword().equals(password)) {
            return "redirect:/?error=true";
        }

        // 3️⃣ 登录成功 → 写 session
        session.setAttribute("loginUser", account);

        return "redirect:/index";
    }
}
