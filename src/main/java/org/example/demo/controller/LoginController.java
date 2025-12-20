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

        System.out.println("【LOGIN】开始登录，username=" + username);

        Account account = loginService.login(username, password);

        if (account == null) {
            System.out.println("【LOGIN】登录失败");
            return "login";
        }

        // 登录成功，写入 session
        session.setAttribute("loginUser", account);
        System.out.println("【LOGIN】登录成功，sessionId=" + session.getId());
        System.out.println("【LOGIN】loginUser=" + account);
        // ★ 必须重定向，建立真正的登录态
        return "redirect:/index";
    }

}
