// 首页JavaScript文件
document.addEventListener("DOMContentLoaded", function() {
    // 获取当前用户信息
    fetch('/api/user/current')
        .then(response => response.json())
        .then(data => {
            if (data.loggedIn) {
                const role = data.role; // 'admin', 'member', 'coach'
                
                // 根据角色加载不同的首页内容
                if (role === 'admin') {
                    loadAdminDashboard();
                } else {
                    loadUserDashboard(data.accountId);
                }
            } else {
                // 未登录，跳转到登录页
                window.location.href = '/';
            }
        })
        .catch(error => {
            console.error('获取用户信息失败:', error);
        });
});

// 加载管理员首页
function loadAdminDashboard() {
    // 显示管理员首页容器
    document.getElementById('adminDashboard').style.display = 'block';
    document.getElementById('userDashboard').style.display = 'none';
    
    // 加载统计数据
    fetch('/api/dashboard/stats')
        .then(response => response.json())
        .then(data => {
            // 更新统计卡片
            document.getElementById('totalUsers').textContent = data.totalUsers || 0;
            document.getElementById('totalCourses').textContent = data.totalCourses || 0;
            document.getElementById('totalEquipment').textContent = data.totalEquipment || 0;
            document.getElementById('totalStaff').textContent = data.totalStaff || 0;
            document.getElementById('totalBookings').textContent = data.totalBookings || 0;
            document.getElementById('activeMembers').textContent = data.activeMembers || 0;
        })
        .catch(error => {
            console.error('获取统计数据失败:', error);
        });
}

// 加载普通用户首页
function loadUserDashboard(accountId) {
    // 显示普通用户首页容器
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'block';
    
    // 加载用户数据
    fetch(`/api/dashboard/user/${accountId}`)
        .then(response => response.json())
        .then(data => {
            // 更新会员卡信息
            if (data.membership) {
                document.getElementById('membershipType').textContent = data.membership.type || '无';
                document.getElementById('membershipStart').textContent = data.membership.startDate || '-';
                document.getElementById('membershipEnd').textContent = data.membership.endDate || '-';
                document.getElementById('membershipStatus').textContent = data.membership.status || '-';
            }
            
            // 更新预约课程数
            document.getElementById('myBookings').textContent = data.totalBookings || 0;
            
            // 更新可用设备数
            document.getElementById('availableEquipment').textContent = data.availableEquipment || 0;
            
            // 加载最近的预约
            if (data.recentBookings && data.recentBookings.length > 0) {
                const bookingsList = document.getElementById('recentBookingsList');
                bookingsList.innerHTML = '';
                data.recentBookings.slice(0, 5).forEach(booking => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="booking-item">
                            <span class="booking-course">${booking.courseName || '未知课程'}</span>
                            <span class="booking-date">${booking.date || '-'}</span>
                            <span class="booking-time">${booking.time || '-'}</span>
                        </div>
                    `;
                    bookingsList.appendChild(li);
                });
            } else {
                document.getElementById('recentBookingsList').innerHTML = '<li class="no-data">暂无预约记录</li>';
            }
        })
        .catch(error => {
            console.error('获取用户数据失败:', error);
        });
}

