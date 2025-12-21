// 全局函数：取消预约（需要在全局作用域，以便onclick可以访问）
function cancelBooking(bookingId) {
    if (!bookingId) {
        console.error('bookingId为空');
        alert('预约ID无效');
        return;
    }
    
    if (!confirm("确定要取消该预约吗？")) {
        return;
    }
    
    console.log('取消预约，bookingId:', bookingId);
    
    fetch(`/api/order/cancel/${bookingId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            console.log('取消预约响应状态:', res.status);
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.message || '取消预约失败');
                });
            }
            return res.json();
        })
        .then(result => {
            console.log('取消预约结果:', result);
            if (result.success) {
                alert('取消预约成功');
                // 刷新整个页面，确保所有数据同步更新
                location.reload();
            } else {
                alert('取消预约失败：' + (result.message || '未知错误'));
            }
        })
        .catch(err => {
            console.error('取消预约失败', err);
            alert('取消预约失败：' + (err.message || '请重试'));
        });
}

document.addEventListener("DOMContentLoaded", function () {

    console.log("info.js running");

    /* ========= DOM ========= */
    const editBtn = document.getElementById("editBtn");
    const saveBtn = document.getElementById("saveBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    const nameInput = document.getElementById("nameInput");
    const phoneInput = document.getElementById("phoneInput");

    const nameError = document.getElementById("nameError");
    const phoneError = document.getElementById("phoneError");

    /* ========= 原始值 ========= */
    let originName = "";
    let originPhone = "";

    /* ========= 校验状态 ========= */
    let nameValid = true;
    let phoneValid = true;

    /* ========= 工具函数 ========= */
    function showError(el, msg) {
        el.innerText = msg;
        el.style.display = "block";
    }

    function hideError(el) {
        el.innerText = "";
        el.style.display = "none";
    }

    function checkUnique(field, value) {
        return fetch(`/api/info/check?field=${field}&value=${encodeURIComponent(value)}`)
            .then(res => res.json());
    }

    /* ========= 加载用户信息 ========= */
    fetch('/api/info')
        .then(res => res.json())
        .then(data => {
            console.log('========= API返回的完整数据 =========');
            console.log(data);
            console.log('所有字段名:', Object.keys(data));
            console.log('====================================');

            const role = data.role || 'member';
            const username = data.username || data.user_name || '-';
            const realName = data.name || '';
            const displayStatus = data.status || '-';
            
            // 头像显示用户名的首字母
            document.getElementById('avatar').innerText = username && username !== '-' ? username.charAt(0).toUpperCase() : 'U';
            document.getElementById('usernameText').innerText = username;
            document.getElementById('status').innerText = displayStatus;
            document.getElementById('accountStatus').value = displayStatus;
            
            // 根据角色显示不同的内容
            if (role === 'member') {
                // Member角色：显示会员信息
                const memberId = data.memberId || '';
                const membershipType = data.membershipType || '';
                const membershipStartDate = data.membershipStartDate || '';
                const membershipEndDate = data.membershipEndDate || '';
                const availableClasses = data.availableClasses || 0;
                
                // 显示会员相关信息
                document.getElementById('memberIdItem').style.display = 'flex';
                document.getElementById('membershipTypeItem').style.display = 'flex';
                document.getElementById('availableClassesItem').style.display = 'flex';
                document.getElementById('staffIdItem').style.display = 'none';
                document.getElementById('staffRoleItem').style.display = 'none';
                document.getElementById('departmentItem').style.display = 'none';
                
                document.getElementById('memberId').innerText = memberId || '-';
                document.getElementById('membershipType').innerText = membershipType || '-';
                const availableClassesElement = document.getElementById('availableClasses');
                if (availableClassesElement) {
                    availableClassesElement.innerText = availableClasses + ' 次';
                }
                
                // 显示会员表单字段
                document.getElementById('dateRangeItem').style.display = 'block';
                document.getElementById('emailItem').style.display = 'none';
                document.getElementById('hireDateItem').style.display = 'none';
                document.getElementById('specialtyItem').style.display = 'none';
                
                document.getElementById('dateRange').value = membershipStartDate + (membershipStartDate && membershipEndDate ? ' 至 ' : '') + membershipEndDate;
                
                // 显示已预约课程卡片
                document.getElementById('bookingCard').style.display = 'block';
                
            } else {
                // Admin/Coach角色：显示员工信息
                const staffId = data.staffId || '';
                const staffRole = data.staffRole || '';
                const department = data.department || '-';
                const email = data.email || '-';
                const hireDate = data.hireDate || '-';
                const specialty = data.specialty || '-';
                
                // 显示员工相关信息
                document.getElementById('memberIdItem').style.display = 'none';
                document.getElementById('membershipTypeItem').style.display = 'none';
                document.getElementById('availableClassesItem').style.display = 'none';
                document.getElementById('staffIdItem').style.display = 'flex';
                document.getElementById('staffRoleItem').style.display = 'flex';
                document.getElementById('departmentItem').style.display = 'flex';
                
                document.getElementById('staffId').innerText = staffId || '-';
                document.getElementById('staffRole').innerText = staffRole || '-';
                document.getElementById('department').innerText = department || '-';
                
                // 显示员工表单字段
                document.getElementById('dateRangeItem').style.display = 'none';
                document.getElementById('emailItem').style.display = 'block';
                document.getElementById('hireDateItem').style.display = 'block';
                document.getElementById('specialtyItem').style.display = 'block';
                
                document.getElementById('emailInput').value = email || '-';
                document.getElementById('hireDateInput').value = hireDate || '-';
                document.getElementById('specialtyInput').value = specialty || '-';
                
                // 隐藏已预约课程卡片
                document.getElementById('bookingCard').style.display = 'none';
            }
            
            // 通用字段
            nameInput.value = realName || '';
            phoneInput.value = data.phone || '';

            // 保存原始值
            originName = realName || '';
            originPhone = data.phone || '';

            nameValid = true;
            phoneValid = true;
        })
        .catch(err => {
            console.error('加载用户信息失败:', err);
        });

    /* ========= 修改资料按钮 ========= */
    editBtn.addEventListener("click", function () {
        nameInput.disabled = false;
        phoneInput.disabled = false;

        editBtn.style.display = "none";
        saveBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";

        nameInput.focus();
    });

    /* ========= 取消按钮 ========= */
    cancelBtn.addEventListener("click", function () {
        nameInput.value = originName;
        phoneInput.value = originPhone;

        nameInput.disabled = true;
        phoneInput.disabled = true;

        hideError(nameError);
        hideError(phoneError);

        editBtn.style.display = "inline-block";
        saveBtn.style.display = "none";
        cancelBtn.style.display = "none";
    });

    /* ========= 真实姓名校验（可以重复，可以为空） ========= */
    nameInput.addEventListener("input", function () {
        const value = nameInput.value.trim();

        if (value === originName) {
            hideError(nameError);
            nameValid = true;
            return;
        }

        // 真实姓名可以为空，也可以重复，所以不需要唯一性验证
        hideError(nameError);
        nameValid = true;  // 真实姓名总是有效的
    });

    /* ========= 手机号校验 ========= */
    phoneInput.addEventListener("input", function () {
        const value = phoneInput.value.trim();

        if (value === originPhone) {
            hideError(phoneError);
            phoneValid = true;
            return;
        }

        hideError(phoneError);
        phoneValid = false;

        if (!/^1\d{10}$/.test(value)) {
            showError(phoneError, "手机号必须为 11 位数字");
            return;
        }

        checkUnique("phone", value).then(unique => {
            if (!unique) {
                showError(phoneError, "手机号已存在");
                phoneValid = false;
            } else {
                hideError(phoneError);
                phoneValid = true;
            }
        });
    });

    /* ========= 保存修改按钮 ========= */
    saveBtn.addEventListener("click", function () {

        if (!nameValid || !phoneValid) {
            alert("请先修正输入错误");
            return;
        }

        const payload = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim()
        };

        fetch("/api/info/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (!res.ok) throw new Error("更新失败");
            })
            .then(() => {
                alert("修改成功");

                // 更新原始值
                originName = payload.name;
                originPhone = payload.phone;

                nameInput.disabled = true;
                phoneInput.disabled = true;

                saveBtn.style.display = "none";
                cancelBtn.style.display = "none";
                editBtn.style.display = "inline-block";

                // 重新加载用户信息，确保左右两侧完全同步
                fetch('/api/info')
                    .then(res => res.json())
                    .then(data => {
                        const role = data.role || 'member';
                        const username = data.username || data.user_name || '-';
                        const realName = data.name || '';
                        const displayStatus = data.status || '-';
                        
                        // 更新通用字段
                        document.getElementById("usernameText").innerText = username;
                        document.getElementById("avatar").innerText = username && username !== '-' ? username.charAt(0).toUpperCase() : "U";
                        document.getElementById("status").innerText = displayStatus;
                        document.getElementById('accountStatus').value = displayStatus;
                        
                        if (role === 'member') {
                            // Member角色更新
                            const memberId = data.memberId || '';
                            const membershipType = data.membershipType || '';
                            const membershipStartDate = data.membershipStartDate || '';
                            const membershipEndDate = data.membershipEndDate || '';
                            const availableClasses = data.availableClasses || 0;
                            
                            document.getElementById("memberId").innerText = memberId || '-';
                            document.getElementById("membershipType").innerText = membershipType || '-';
                            const availableClassesElement = document.getElementById('availableClasses');
                            if (availableClassesElement) {
                                availableClassesElement.innerText = availableClasses + ' 次';
                            }
                            document.getElementById('dateRange').value = membershipStartDate + (membershipStartDate && membershipEndDate ? ' 至 ' : '') + membershipEndDate;
                        } else {
                            // Admin/Coach角色更新
                            const staffId = data.staffId || '';
                            const staffRole = data.staffRole || '';
                            const department = data.department || '-';
                            const email = data.email || '-';
                            const hireDate = data.hireDate || '-';
                            const specialty = data.specialty || '-';
                            
                            document.getElementById('staffId').innerText = staffId || '-';
                            document.getElementById('staffRole').innerText = staffRole || '-';
                            document.getElementById('department').innerText = department || '-';
                            document.getElementById('emailInput').value = email || '-';
                            document.getElementById('hireDateInput').value = hireDate || '-';
                            document.getElementById('specialtyInput').value = specialty || '-';
                        }
                        
                        // 更新原始值
                        originName = payload.name;
                        originPhone = payload.phone;
                    })
                    .catch(err => {
                        console.error('重新加载用户信息失败:', err);
                    });
            })
            .catch(err => {
                console.error(err);
                alert("保存失败，请重试");
            });
    });

    /* ========= 加载预约课程 ========= */
    // 将loadBookings定义为全局函数，以便cancelBooking可以调用
    window.loadBookings = function() {
        const bookingList = document.getElementById('bookingList');
        const bookingLoading = document.getElementById('bookingLoading');
        const bookingEmpty = document.getElementById('bookingEmpty');

        if (bookingLoading) bookingLoading.style.display = 'block';
        if (bookingEmpty) bookingEmpty.style.display = 'none';

        fetch('/api/order/my-bookings')
            .then(res => {
                if (!res.ok) {
                    throw new Error('获取预约记录失败');
                }
                return res.json();
            })
            .then(data => {
                console.log('加载的预约记录数据:', data);
                if (bookingLoading) bookingLoading.style.display = 'none';
                if (data && data.length > 0) {
                    // 过滤掉"已取消"状态的记录，只显示有效的预约记录
                    const validBookings = data.filter(booking => {
                        const status = booking.status || '';
                        const statusLower = status.toLowerCase();
                        // 只显示"已确认"状态的记录，过滤掉"已取消"的记录
                        return statusLower === '已确认' || statusLower === 'confirmed' || statusLower === 'active';
                    });
                    
                    if (validBookings.length > 0) {
                        renderBookings(validBookings);
                    } else {
                        if (bookingEmpty) bookingEmpty.style.display = 'block';
                    }
                } else {
                    if (bookingEmpty) bookingEmpty.style.display = 'block';
                }
            })
            .catch(err => {
                console.error('加载预约记录失败', err);
                if (bookingLoading) bookingLoading.style.display = 'none';
                if (bookingEmpty) bookingEmpty.style.display = 'block';
            });
    };
    
    // 立即调用一次
    loadBookings();

    function renderBookings(bookings) {
        console.log('renderBookings 收到的数据:', bookings);
        const bookingList = document.getElementById('bookingList');
        const bookingEmpty = document.getElementById('bookingEmpty');
        bookingEmpty.style.display = 'none';

        if (!bookings || bookings.length === 0) {
            bookingEmpty.style.display = 'block';
            bookingList.innerHTML = '';
            return;
        }

        // 显示所有状态的记录，包括"已取消"
        bookingList.innerHTML = bookings.map(booking => {
            console.log('处理预约记录:', booking);
            // 兼容snake_case和camelCase格式
            const bookingId = booking.booking_id || booking.bookingId || '';
            const status = booking.status || '';
            const dayOfWeek = booking.day_of_week !== undefined ? booking.day_of_week : booking.dayOfWeek;
            const classTime = booking.class_time || booking.classTime;
            const className = booking.class_name || booking.className || '课程信息未知';
            const coachId = booking.coach_id || booking.coachId || '-';
            const durationMinutes = booking.duration_minutes !== undefined ? booking.duration_minutes : booking.durationMinutes;
            const bookingDate = booking.booking_date || booking.bookingDate;
            
            console.log('预约记录状态:', status, 'bookingId:', bookingId);
            
            const statusClass = getStatusClass(status);
            const statusText = getStatusText(status);
            const dayOfWeekText = getDayOfWeekText(dayOfWeek);
            const classTimeStr = formatClassTime(classTime) || '-';
            const bookingDateStr = formatBookingDate(bookingDate);
            
            return `
                <div class="booking-item">
                    <div class="booking-item-info">
                        <div class="booking-item-title">${escapeHtml(className)}</div>
                        <div class="booking-item-meta">
                            <span>📅 ${dayOfWeekText} ${classTimeStr}</span>
                            <span style="margin-left: 15px;">⏱️ ${durationMinutes || 0}分钟</span>
                            <span style="margin-left: 15px;">👤 教练：${escapeHtml(coachId)}</span>
                            <span style="margin-left: 15px;">📝 预约时间：${bookingDateStr}</span>
                        </div>
                    </div>
                    <div class="booking-item-actions">
                        <span class="status-badge ${statusClass}">${statusText}</span>
                        ${status === '已确认' ? `<button class="btn-cancel" onclick="cancelBooking('${bookingId}')">取消预约</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
    
    function formatClassTime(classTime) {
        if (!classTime) return '';
        
        // 如果是字符串，直接返回
        if (typeof classTime === 'string') {
            return classTime;
        }
        
        // 如果是对象（LocalTime序列化后的格式），提取时间部分
        if (typeof classTime === 'object') {
            if (classTime.hour !== undefined && classTime.minute !== undefined) {
                const hour = String(classTime.hour).padStart(2, '0');
                const minute = String(classTime.minute).padStart(2, '0');
                return `${hour}:${minute}`;
            }
            if (Array.isArray(classTime)) {
                return classTime.map(n => String(n).padStart(2, '0')).join(':');
            }
        }
        
        return String(classTime);
    }
    
    function escapeHtml(text) {
        if (!text) return '';
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
    }
    
    function getDayOfWeekText(dayOfWeek) {
        const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
        return days[dayOfWeek] || '';
    }
    
    function formatBookingDate(dateStr) {
        if (!dateStr) return '-';
        // 处理日期格式：2024-11-15 10:30:00 -> 2024-11-15 10:30
        return dateStr.replace('T', ' ').substring(0, 16);
    }
    
    // cancelBooking函数已移到全局作用域，这里不再重复定义

    function getStatusClass(status) {
        if (!status) return 'status-active';
        const s = status.toLowerCase();
        if (s === 'active' || s === '已预约' || s === 'confirmed' || s === '已确认') return 'status-active';
        if (s === 'completed' || s === '已完成') return 'status-completed';
        if (s === 'cancelled' || s === '已取消' || s === 'disabled') return 'status-cancelled';
        return 'status-active';
    }

    function getStatusText(status) {
        if (!status) return '未知';
        const s = status.toLowerCase();
        if (s === 'active' || s === 'confirmed' || s === '已确认') return '已确认';
        if (s === 'completed' || s === '已完成') return '已完成';
        if (s === 'cancelled' || s === '已取消' || s === 'disabled') return '已取消';
        return status;
    }

});
