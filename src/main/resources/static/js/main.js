// 确保函数在全局作用域中定义
(function() {
    'use strict';
    
    // 定义 togglePopup 函数
    function togglePopup() {
        const popup = document.getElementById("popup");
        if (popup) {
            popup.style.display = popup.style.display === "block" ? "none" : "block";
        }
    }
    
    // 定义 logout 函数
    function logout() {
        if (confirm('确定要退出登录吗？')) {
            window.location.href = '/logout';
        }
    }
    
    // 将函数绑定到 window 对象，确保全局可访问
    window.togglePopup = togglePopup;
    window.logout = logout;
})();

// 根据角色显示/隐藏侧边栏菜单项
document.addEventListener("DOMContentLoaded", function() {
    // 获取当前用户信息
    fetch('/api/user/current')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                const role = data.role; // 'admin', 'member', 'coach'
                
                // 定义角色权限映射（使用完整的href路径匹配）
                const rolePermissions = {
                    'admin': ['/index', '/user', '/equipmentManage', '/staffManage', '/courseManage', '/info'],
                    'member': ['/index', '/purchase_course', '/order', '/equipment', '/info'],
                    'coach': ['/index', '/purchase_course', '/order', '/equipment', '/info'] // coach和member显示相同
                };
                
                // 获取当前角色允许的菜单项
                const allowedMenus = rolePermissions[role] || [];
                
                // 遍历所有侧边栏链接，根据权限显示/隐藏
                const sidebarLinks = document.querySelectorAll('.sidebar a');
                sidebarLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href) {
                        // 检查是否在允许的菜单列表中
                        if (allowedMenus.includes(href)) {
                            link.style.display = 'flex';
                        } else {
                            link.style.display = 'none';
                        }
                    }
                });
                
                // 更新用户名显示
                const usernameElement = document.getElementById('username');
                if (usernameElement) {
                    usernameElement.textContent = data.username;
                }
                
                // 更新弹窗内容：昵称和邮箱
                const popupParagraphs = document.querySelectorAll('#popup p');
                if (popupParagraphs.length >= 2) {
                    // 第一行：昵称
                    popupParagraphs[0].textContent = '昵称：' + data.username;
                    // 第二行：邮箱
                    popupParagraphs[1].textContent = '邮箱：' + (data.email || '无');
                }
            }
        })
        .catch(error => {
            console.error('获取用户信息失败:', error);
        });
});