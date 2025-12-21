package org.example.demo.controller;

import jakarta.servlet.http.HttpSession;
import org.example.demo.entity.Account;
import org.example.demo.entity.Member;
import org.example.demo.entity.Package;
import org.example.demo.entity.PurchaseRecord;
import org.example.demo.mapper.MemberMapper;
import org.example.demo.service.PurchaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/purchase")
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final MemberMapper memberMapper;

    public PurchaseController(PurchaseService purchaseService, MemberMapper memberMapper) {
        this.purchaseService = purchaseService;
        this.memberMapper = memberMapper;
    }

    /**
     * 获取所有套餐
     */
    @GetMapping("/packages")
    public ResponseEntity<List<Package>> getPackages() {
        List<Package> packages = purchaseService.getAllPackages();
        return ResponseEntity.ok(packages);
    }

    /**
     * 获取套餐详情
     */
    @GetMapping("/package/{packageId}")
    public ResponseEntity<Package> getPackage(@PathVariable String packageId) {
        Package pkg = purchaseService.getPackageById(packageId);
        if (pkg == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(pkg);
    }

    /**
     * 创建购买订单
     */
    @PostMapping("/create/{packageId}")
    public ResponseEntity<Map<String, Object>> createPurchase(@PathVariable String packageId, HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "请先登录");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        Member member = memberMapper.selectByAccountId(loginUser.getAccountId());
        if (member == null) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "会员信息不存在");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        try {
            PurchaseRecord purchase = purchaseService.createPurchase(member.getMemberId(), packageId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("purchaseId", purchase.getPurchaseId());
            result.put("amount", purchase.getAmount());
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * 确认支付
     */
    @PostMapping("/confirm/{purchaseId}")
    public ResponseEntity<Map<String, Object>> confirmPayment(@PathVariable String purchaseId, HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "请先登录");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        try {
            purchaseService.confirmPayment(purchaseId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "支付成功");
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * 取消支付
     */
    @PostMapping("/cancel/{purchaseId}")
    public ResponseEntity<Map<String, Object>> cancelPayment(@PathVariable String purchaseId, HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", "请先登录");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }

        try {
            purchaseService.cancelPayment(purchaseId);
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "已取消支付");
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            Map<String, Object> result = new HashMap<>();
            result.put("success", false);
            result.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
        }
    }

    /**
     * 获取我的购买记录
     */
    @GetMapping("/my-purchases")
    public ResponseEntity<List<PurchaseRecord>> getMyPurchases(HttpSession session) {
        Account loginUser = (Account) session.getAttribute("loginUser");
        if (loginUser == null || !"member".equals(loginUser.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Member member = memberMapper.selectByAccountId(loginUser.getAccountId());
        if (member == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<PurchaseRecord> purchases = purchaseService.getMemberPurchases(member.getMemberId());
        return ResponseEntity.ok(purchases);
    }
}
