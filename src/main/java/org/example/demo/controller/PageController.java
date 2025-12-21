package org.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({"/index"})
    public String index() {
        return "index"; // 对应 templates/index.html
    }

    @GetMapping("/purchase_course")
    public String purchase_course() {
        return "purchase_course"; // 对应 templates/purchase_course.html
    }

    @GetMapping("/order")
    public String order() {
        return "order"; // 对应 templates/order.html }
    }

    @GetMapping("/user")
    public String user() {
        return "user"; // 对应 templates/user.html
    }

    @GetMapping("/info")
    public String info() {
        return "information"; // 对应 templates/purchase_card.html
    }

    @GetMapping("/")
    public String login() {
        return "login"; // 对应 templates/login.html
    }

    @GetMapping("/register")
    public String register() {
        return "register"; // 对应 templates/register.html
    }

    @GetMapping("/equipment")
    public String equipment() {
        return "equipment"; // 对应 templates/equipment.html
    }

    @GetMapping("courseManage")
    public String courseManage() {
        return "courseManage"; // 对应 templates/courseManage.html
    }

    @GetMapping("/equipmentManage")
    public String equipmentManage() {
        return "equipmentManage"; // 对应 templates/equipmentManage.html
    }

    @GetMapping("/staffManage")
    public String staffManage() {
        return "staffManage"; // 对应 templates/staffManage.html
    }

    @GetMapping("/recover")
    public String recover() {return "recover"; }

    @GetMapping("/favicon.ico")
    public ResponseEntity<Void> favicon() {
        // 返回204 No Content，避免404错误
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
    @GetMapping("/courseDetail")
    public String courseDetail() {
        return "courseDetail"; // 对应 templates/courseDetail.html
    }

    @GetMapping("/packageDetail")
    public String packageDetail() {
        return "packageDetail"; // 对应 templates/packageDetail.html
    }
}
