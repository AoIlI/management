package org.example.demo.controller;

import org.example.demo.service.RegisterService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class RegisterController {

    private final RegisterService registerService;

    public RegisterController(RegisterService registerService) {
        this.registerService = registerService;
    }

    @PostMapping("/register")
    public String register(@RequestParam String username,
                           @RequestParam String password,
                           @RequestParam String phone,
                           @RequestParam(required = false) String realName) {
        try {
            registerService.registerMember(username, password, phone, realName);
            // 注册成功，跳回登录页
            return "redirect:/";
        } catch (RuntimeException e) {
            // 注册失败，回到注册页，并加错误参数
            return "redirect:/register.html?error=" + e.getMessage();
        }
    }

    @ResponseBody
        @GetMapping("/api/register/check-username")
        public boolean checkUsername(@RequestParam String username) {
            return registerService.usernameExists(username);
        }
        /**
         * 校验手机号是否存在（AJAX）
         */
        @ResponseBody
        @GetMapping("/api/register/check-phone")
        public boolean checkPhone(@RequestParam String phone) {
            return registerService.phoneExists(phone);
        }
    }

