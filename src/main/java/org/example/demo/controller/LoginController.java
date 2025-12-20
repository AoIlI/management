package org.example.demo.controller;

import org.example.demo.entity.Account;
import org.example.demo.service.LoginService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {

    private final LoginService loginService;

    public LoginController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/login")
    public String login(@RequestParam String username,
                        @RequestParam String password,
                        HttpSession session) {
        Account account = loginService.login(username, password);

        if (account == null) {
            // 登录失败，返回 login.html 模板，并显示错误
            return "login"; // 页面导航已经映射 "/" → login.html
        }

        // 登录成功，写入 session
        session.setAttribute("loginUser", account);

        // 跳转首页模板
        return "index"; // 页面导航已经映射 "/index" → index.html
    }
}
