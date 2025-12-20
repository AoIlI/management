package org.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.entity.Account;
import org.example.demo.entity.Member;
import org.example.demo.service.InformationService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/info")
public class InformationController {

    private final InformationService informationService;

    public InformationController(InformationService informationService) {
        this.informationService = informationService;
    }

    @GetMapping
    public Member getInfo(HttpSession session) {

        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null) {
            throw new RuntimeException("未登录");
        }

        return informationService.getMemberInfo(loginUser.getAccountId());
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
