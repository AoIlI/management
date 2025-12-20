package org.example.demo.controller;

import org.example.demo.service.RecoverService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Controller
public class RecoverController {

    private final RecoverService recoverService;

    public RecoverController(RecoverService recoverService) {
        this.recoverService = recoverService;
    }

    @ResponseBody
    @PostMapping("/recover")
    public Map<String,Object> recoverAction(@RequestParam String username,
                                            @RequestParam(required = false) String phone,
                                            @RequestParam(required = false) String newPassword,
                                            @RequestParam String action) {
        Map<String,Object> result = new HashMap<>();
        if("verify".equals(action)) {
            // 验证用户名 + 手机号
            boolean ok = recoverService.checkUsernamePhone(username, phone);
            result.put("success", ok);
        } else if("reset".equals(action)) {
            // 更新密码
            boolean ok = recoverService.resetPassword(username, newPassword);
            result.put("success", ok);
            if(!ok) {
                result.put("message","更新密码失败");
            }
        } else {
            result.put("success", false);
            result.put("message", "非法操作");
        }
        return result;
    }
}
