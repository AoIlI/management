document.addEventListener("DOMContentLoaded", function () {
    loadStaffs();
});

function loadStaffs() {
    fetch('/api/staffManage/list')
        .then(res => res.json())
        .then(data => {
            renderTable(data);
        })
        .catch(err => {
            console.error("加载员工失败", err);
            showToast("加载员工失败", "error");
        });
}

function renderTable(staffs) {
    const tbody = document.querySelector('#staffTable tbody');
    tbody.innerHTML = '';

    if (staffs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="11" style="text-align: center; padding: 20px;">暂无员工数据</td></tr>';
        return;
    }

    staffs.forEach(staff => {
        console.log(staff);
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${staff.staffId || ''}</td>
            <td>${staff.accountId || ''}</td>
            <td>${staff.name || ''}</td>
            <td>${staff.role || ''}</td>
            <td>${staff.phone || ''}</td>
            <td>${staff.email || '-'}</td>
            <td>${staff.specialty || '-'}</td>
            <td>${staff.hireDate || '-'}</td>
            <td>${staff.status || ''}</td>
            <td>${staff.department || '-'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditModal('${staff.staffId}')">修改</button>
                <button class="action-btn delete-btn" onclick="deleteStaff('${staff.staffId}')">删除</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function searchStaff() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (!keyword) {
        loadStaffs(); // 没输入就加载所有员工
        return;
    }

    fetch(`/api/staffManage/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => {
            renderTable(data);
            if (data.length === 0) {
                showToast("未找到匹配的员工", "info");
            }
        })
        .catch(err => {
            console.error('搜索员工失败', err);
            showToast("搜索失败", "error");
        });
}

function deleteStaff(staffId) {
    if (!confirm("确定要删除该员工吗？删除后该员工的账号信息也会被删除！")) {
        return;
    }

    fetch(`/api/staffManage/${staffId}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                showToast("删除成功", "success");
                loadStaffs(); // 重新加载表格
            } else {
                res.text().then(text => {
                    showToast("删除失败: " + text, "error");
                });
            }
        })
        .catch(err => {
            console.error(err);
            showToast("请求出错", "error");
        });
}

function exportExcel() {
    const keyword = document.getElementById("searchInput").value.trim();
    const url = keyword ? `/api/staffManage/export?keyword=${encodeURIComponent(keyword)}` : '/api/staffManage/export';
    window.location.href = url;
}

function openEditModal(staffId) {
    fetch(`/api/staffManage/${staffId}`)
        .then(res => res.json())
        .then(staff => {
            document.getElementById('editStaffId').value = staff.staffId || '';
            document.getElementById('editAccountId').value = staff.accountId || '';
            document.getElementById('editName').value = staff.name || '';
            document.getElementById('editRole').value = staff.role || '';
            document.getElementById('editPhone').value = staff.phone || '';
            document.getElementById('editEmail').value = staff.email || '';
            document.getElementById('editSpecialty').value = staff.specialty || '';
            document.getElementById('editHireDate').value = staff.hireDate || '';
            document.getElementById('editStatus').value = staff.status || '在职';
            document.getElementById('editDepartment').value = staff.department || '';

            const modal = document.getElementById('editModal');
            modal.style.display = 'block';
            modal.classList.remove('modal-animate');
            void modal.offsetWidth;
            modal.classList.add('modal-animate');
        })
        .catch(err => {
            console.error('加载员工信息失败', err);
            showToast("加载员工信息失败", "error");
        });
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function openAddModal() {
    // 清空表单
    document.getElementById('addForm').reset();
    const modal = document.getElementById('addModal');
    modal.style.display = 'block';
    modal.classList.remove('modal-animate');
    void modal.offsetWidth;
    modal.classList.add('modal-animate');
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
}

// 提交修改表单
function submitEditForm(event) {
    event.preventDefault();

    const formData = {
        staffId: document.getElementById('editStaffId').value,
        accountId: document.getElementById('editAccountId').value,
        name: document.getElementById('editName').value,
        role: document.getElementById('editRole').value,
        phone: document.getElementById('editPhone').value,
        email: document.getElementById('editEmail').value || null,
        specialty: document.getElementById('editSpecialty').value || null,
        hireDate: document.getElementById('editHireDate').value || null,
        status: document.getElementById('editStatus').value,
        department: document.getElementById('editDepartment').value || null
    };

    // 验证手机号
    if (!/^1\d{10}$/.test(formData.phone)) {
        alert('手机号格式不正确，请输入11位手机号');
        return;
    }

    fetch('/api/staffManage/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    }).then(res => {
        if (res.ok) {
            showToast("修改成功", "success");
            closeEditModal();
            loadStaffs(); // 重新加载表格
        } else {
            res.text().then(text => {
                showToast("修改失败: " + text, "error");
            });
        }
    }).catch(err => {
        console.error(err);
        showToast("请求出错", "error");
    });
}

// 提交添加表单
function submitAddForm(event) {
    event.preventDefault();

    const formData = {
        name: document.getElementById('addName').value,
        role: document.getElementById('addRole').value,
        phone: document.getElementById('addPhone').value,
        email: document.getElementById('addEmail').value || null,
        specialty: document.getElementById('addSpecialty').value || null,
        hireDate: document.getElementById('addHireDate').value || null,
        status: document.getElementById('addStatus').value,
        department: document.getElementById('addDepartment').value || null
    };

    // 验证手机号
    if (!/^1\d{10}$/.test(formData.phone)) {
        alert('手机号格式不正确，请输入11位手机号');
        return;
    }

    fetch('/api/staffManage/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    }).then(res => {
        if (res.ok) {
            return res.text();
        } else {
            return res.text().then(text => {
                throw new Error(text);
            });
        }
    }).then(message => {
        showToast(message || "添加成功", "success");
        closeAddModal();
        loadStaffs(); // 重新加载表格
    }).catch(err => {
        console.error(err);
        showToast("添加失败: " + err.message, "error");
    });
}

// Toast提示函数
function showToast(message, type = "success") {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    // 根据类型设置颜色
    if (type === "error") {
        toast.style.backgroundColor = "#f56c6c";
    } else if (type === "info") {
        toast.style.backgroundColor = "#409eff";
    } else {
        toast.style.backgroundColor = "#67c23a";
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const addModal = document.getElementById('addModal');
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === addModal) {
        closeAddModal();
    }
}

