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

            // 左侧展示
            document.getElementById('nameText').innerText = data.name;
            document.getElementById('memberId').innerText = data.memberId;
            document.getElementById('membershipType').innerText = data.membershipType;
            document.getElementById('status').innerText = data.status;
            document.getElementById('avatar').innerText = data.name ? data.name.charAt(0) : 'U';

            // 右侧表单
            nameInput.value = data.name;
            phoneInput.value = data.phone;
            document.getElementById('dateRange').value = data.membershipStartDate + ' 至 ' + data.membershipEndDate;
            document.getElementById('accountStatus').value = data.accountStatus;

            // 保存原始值
            originName = data.name;
            originPhone = data.phone;

            nameValid = true;
            phoneValid = true;
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

});
