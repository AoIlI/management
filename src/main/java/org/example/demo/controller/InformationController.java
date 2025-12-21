package org.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.entity.Account;
import org.example.demo.entity.Member;
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

        Member member = informationService.getMemberInfo(loginUser.getAccountId());
        Account account = informationService.getAccountInfo(loginUser.getAccountId());
        
        // 组合返回数据，包含username和member信息
        Map<String, Object> result = new HashMap<>();
        result.put("memberId", member.getMemberId());
        result.put("accountId", member.getAccountId());
        result.put("username", account.getUsername());  // 用户名（全局唯一）
        result.put("name", member.getName());  // 真实姓名（可以重复）
        result.put("phone", member.getPhone());
        result.put("membershipType", member.getMembershipType());
        result.put("membershipStartDate", member.getMembershipStartDate());
        result.put("membershipEndDate", member.getMembershipEndDate());
        result.put("status", member.getStatus());
        result.put("accountStatus", member.getStatus());  // 使用member的status作为账户状态
        result.put("availableClasses", member.getAvailableClasses());
        result.put("lastResetDate", member.getLastResetDate());
        
        return result;
    }

    @PostMapping("/update")
    public void update(@RequestBody Member member, HttpSession session) {

        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("未登录");
        }

        informationService.updateMemberBaseInfo(
                loginUser.getAccountId(),
                member.getName(),
                member.getPhone()
        );
    }

    @GetMapping("/check")
    public boolean checkUnique(@RequestParam String field,
                               @RequestParam String value,
                               HttpSession session) {

        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("未登录");
        }

        return informationService.isUnique(
                loginUser.getAccountId(),
                field,
                value
        );
    }
}
