package org.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.entity.Account;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserInfoController {

    @GetMapping("/current")
    public Map<String, Object> getCurrentUser(HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        
        Map<String, Object> result = new HashMap<>();
        if (loginUser == null) {
            result.put("loggedIn", false);
            return result;
        }
        
        result.put("loggedIn", true);
        result.put("username", loginUser.getUsername());
        result.put("role", loginUser.getRole());
        result.put("accountId", loginUser.getAccountId());
        
        return result;
    }
}

