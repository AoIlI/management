package org.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.entity.Account;
import org.example.demo.entity.Member;
import org.example.demo.entity.Staff;
import org.example.demo.service.InformationService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/info")
public class InformationController {

    private final InformationService informationService;

    public InformationController(InformationService informationService) {
        this.informationService = informationService;
    }

    @GetMapping
    public Map<String, Object> getInfo(HttpSession session) {

        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("未登录");
        }

        String role = loginUser.getRole();
        Account account = informationService.getAccountInfo(loginUser.getAccountId());
        Map<String, Object> result = new HashMap<>();
        
        // 根据角色返回不同的数据
        if ("member".equals(role)) {
            // member角色：返回member信息
            Member member = informationService.getMemberInfo(loginUser.getAccountId());
            if (member == null) {
                throw new RuntimeException("会员信息不存在");
            }
            
            result.put("role", "member");
            result.put("memberId", member.getMemberId());
            result.put("accountId", member.getAccountId());
            result.put("username", account.getUsername());
            result.put("name", member.getName());
            result.put("phone", member.getPhone());
            result.put("membershipType", member.getMembershipType());
            result.put("membershipStartDate", member.getMembershipStartDate());
            result.put("membershipEndDate", member.getMembershipEndDate());
            result.put("status", member.getStatus());
            result.put("accountStatus", member.getStatus());
            result.put("availableClasses", member.getAvailableClasses());
            result.put("lastResetDate", member.getLastResetDate());
        } else {
            // admin或coach角色：返回staff信息
            Staff staff = informationService.getStaffInfo(loginUser.getAccountId());
            if (staff == null) {
                throw new RuntimeException("员工信息不存在");
            }
            
            result.put("role", role);
            result.put("staffId", staff.getStaffId());
            result.put("accountId", staff.getAccountId());
            result.put("username", account.getUsername());
            result.put("name", staff.getName());
            result.put("phone", staff.getPhone());
            result.put("email", staff.getEmail());
            result.put("staffRole", staff.getRole());  // 职位
            result.put("department", staff.getDepartment());
            result.put("hireDate", staff.getHireDate());
            result.put("status", staff.getStatus());
            result.put("specialty", staff.getSpecialty());
        }
        
        return result;
    }

    @PostMapping("/update")
    public void update(@RequestBody Map<String, String> data, HttpSession session) {

        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("未登录");
        }

        String role = loginUser.getRole();
        String name = data.get("name");
        String phone = data.get("phone");

        if ("member".equals(role)) {
            informationService.updateMemberBaseInfo(
                    loginUser.getAccountId(),
                    name,
                    phone
            );
        } else {
            informationService.updateStaffBaseInfo(
                    loginUser.getAccountId(),
                    name,
                    phone
            );
        }
    }

    @GetMapping("/check")
    public boolean checkUnique(@RequestParam String field,
                               @RequestParam String value,
                               HttpSession session) {

        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("未登录");
        }

        String role = loginUser.getRole();
        return informationService.isUnique(
                loginUser.getAccountId(),
                role,
                field,
                value
        );
    }
}
