package org.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PageController {

    @GetMapping({"/", "/index"})
    public String index() {
        return "index"; // 对应 templates/index.html
    }

    @GetMapping("/product")
    public String product() {
        return "product"; // 对应 templates/product.html
    }

    @GetMapping("/order")
    public String order() {
        return "order"; // 对应 templates/order.html
    }

    @GetMapping("/user")
    public String user() {
        return "user"; // 对应 templates/user.html
    }
}
