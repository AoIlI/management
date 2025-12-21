package org.example.demo.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.servlet.HandlerInterceptor;

public class LoginInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String uri = request.getRequestURI();

        // 放行无需登录访问的页面
        if (uri.equals("/")              // 登录页
                || uri.equals("/login")   // 登录表单提交
                || uri.equals("/logout")  // 退出登录
                || uri.equals("/register") // 注册页面
                || uri.startsWith("/api/register") // 注册 AJAX
                || uri.equals("/recover") // 找回密码页面
                || uri.startsWith("/api/recover")) { // 找回密码 AJAX
            return true;
        }

        HttpSession session = request.getSession(false);

        // 未登录，拦截并重定向到登录页
        if (session == null || session.getAttribute("loginUser") == null) {
            response.sendRedirect("/");
            return false;
        }

        // 已登录，放行
        return true;
    }
}
