package org.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.entity.Account;
import org.example.demo.entity.Staff;
import org.example.demo.mapper.StaffMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserInfoController {

    private final StaffMapper staffMapper;

    public UserInfoController(StaffMapper staffMapper) {
        this.staffMapper = staffMapper;
    }

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
        
        // 根据角色获取邮箱
        String role = loginUser.getRole();
        String email = "无";
        
        if ("admin".equals(role) || "coach".equals(role)) {
            // admin或coach从staff表获取邮箱
            Staff staff = staffMapper.selectByAccountId(loginUser.getAccountId());
            if (staff != null && staff.getEmail() != null && !staff.getEmail().trim().isEmpty()) {
                email = staff.getEmail();
            }
        }
        // member角色邮箱显示"无"
        
        result.put("email", email);
        
        return result;
    }
}

