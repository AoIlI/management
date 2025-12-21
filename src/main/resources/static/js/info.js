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
            console.log('memberId (驼峰):', data.memberId);
            console.log('member_id (下划线):', data.member_id);
            console.log('membershipType (驼峰):', data.membershipType);
            console.log('membership_type (下划线):', data.membership_type);
            console.log('====================================');

            // 兼容两种命名方式：优先使用下划线，如果没有则使用驼峰
            const memberId = data.member_id || data.memberId || '';
            const membershipType = data.membership_type || data.membershipType || '';
            const membershipStartDate = data.membership_start_date || data.membershipStartDate || '';
            const membershipEndDate = data.membership_end_date || data.membershipEndDate || '';
            const accountStatus = data.account_status || data.accountStatus || '';

            console.log('解析后的值 - memberId:', memberId);
            console.log('解析后的值 - membershipType:', membershipType);

            // 左侧展示
            document.getElementById('nameText').innerText = data.name || '-';
            document.getElementById('memberId').innerText = memberId || '-';
            document.getElementById('membershipType').innerText = membershipType || '-';
            document.getElementById('status').innerText = data.status || '-';
            document.getElementById('avatar').innerText = data.name ? data.name.charAt(0).toUpperCase() : 'U';

            // 右侧表单
            nameInput.value = data.name || '';
            phoneInput.value = data.phone || '';
            document.getElementById('dateRange').value = membershipStartDate + (membershipStartDate && membershipEndDate ? ' 至 ' : '') + membershipEndDate;
            document.getElementById('accountStatus').value = accountStatus;

            // 保存原始值
            originName = data.name;
            originPhone = data.phone;

            nameValid = true;
            phoneValid = true;
        })
        .catch(err => {
            console.error('加载用户信息失败:', err);
        });

    // 加载预约课程
    loadBookings();

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

    /* ========= 用户名校验 ========= */
    nameInput.addEventListener("input", function () {
        const value = nameInput.value.trim();

        if (value === originName) {
            hideError(nameError);
            nameValid = true;
            return;
        }

        hideError(nameError);
        nameValid = false;

        if (value.length === 0) {
            showError(nameError, "用户名不能为空");
            return;
        }

        checkUnique("name", value).then(unique => {
            if (!unique) {
                showError(nameError, "用户名已存在");
                nameValid = false;
            } else {
                hideError(nameError);
                nameValid = true;
            }
        });
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

                // 左侧同步更新
                document.getElementById("nameText").innerText = payload.name;
                document.getElementById("avatar").innerText = payload.name ? payload.name.charAt(0) : "U";
            })
            .catch(err => {
                console.error(err);
                alert("保存失败，请重试");
            });
    });

    /* ========= 加载预约课程 ========= */
    function loadBookings() {
        const bookingList = document.getElementById('bookingList');
        const bookingLoading = document.getElementById('bookingLoading');
        const bookingEmpty = document.getElementById('bookingEmpty');

        // TODO: 替换为实际的API接口
        // 示例：fetch('/api/info/bookings')
        //     .then(res => res.json())
        //     .then(data => {
        //         bookingLoading.style.display = 'none';
        //         if (data && data.length > 0) {
        //             renderBookings(data);
        //         } else {
        //             bookingEmpty.style.display = 'block';
        //         }
        //     });

        // 临时显示空状态（待API实现后替换）
        setTimeout(() => {
            bookingLoading.style.display = 'none';
            bookingEmpty.style.display = 'block';
        }, 500);
    }

    function renderBookings(bookings) {
        const bookingList = document.getElementById('bookingList');
        const bookingEmpty = document.getElementById('bookingEmpty');
        bookingEmpty.style.display = 'none';

        let html = `
            <table class="booking-table">
                <thead>
                    <tr>
                        <th>课程名称</th>
                        <th>教练ID</th>
                        <th>上课时间</th>
                        <th>课程时长</th>
                        <th>预约日期</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
        `;

        bookings.forEach(booking => {
            const statusClass = getStatusClass(booking.status || booking.booking_status);
            const statusText = getStatusText(booking.status || booking.booking_status);
            
            html += `
                <tr>
                    <td>${booking.class_name || booking.className || '-'}</td>
                    <td>${booking.coach_id || booking.coachId || '-'}</td>
                    <td>${booking.schedule_time || booking.scheduleTime || '-'}</td>
                    <td>${booking.duration_minutes || booking.durationMinutes || '-'}分钟</td>
                    <td>${booking.booking_date || booking.bookingDate || '-'}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                </tr>
            `;
        });

        html += `
                </tbody>
            </table>
        `;

        bookingList.innerHTML = html;
    }

    function getStatusClass(status) {
        if (!status) return 'status-active';
        const s = status.toLowerCase();
        if (s === 'active' || s === '已预约' || s === 'confirmed') return 'status-active';
        if (s === 'completed' || s === '已完成') return 'status-completed';
        if (s === 'cancelled' || s === '已取消' || s === 'disabled') return 'status-cancelled';
        return 'status-active';
    }

    function getStatusText(status) {
        if (!status) return '未知';
        const s = status.toLowerCase();
        if (s === 'active' || s === 'confirmed') return '已预约';
        if (s === 'completed') return '已完成';
        if (s === 'cancelled' || s === 'disabled') return '已取消';
        return status;
    }

});
