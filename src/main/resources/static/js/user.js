

document.addEventListener("DOMContentLoaded", function () {
    loadUsers();
});

function loadUsers() {
    fetch('/api/user/list')
        .then(res => res.json())
        .then(data => {
            renderTable(data);
        })
        .catch(err => {
            console.error("加载用户失败", err);
        });
}

function renderTable(users) {
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        console.log(user);
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${user.member_id}</td>
            <td>${user.name}</td>
            <td>${user.phone}</td>
            <td>${user.membership_type}</td>
            <td>${user.membership_start_date}</td>
            <td>${user.membership_end_date}</td>
            <td>${user.status}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditModal('${user.member_id}')">修改</button>
                <button class="action-btn delete-btn" onclick="deleteUser('${user.member_id}')">删除</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function searchUser() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (!keyword) {
        loadUsers(); // 没输入就加载所有用户
        return;
    }

    fetch(`/api/user/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error('搜索用户失败', err));
}


function deleteUser(memberId) {
    console.log("🐖")
    if (!confirm("确定要删除该用户吗？")) {
        return;
    }

    fetch(`/api/user/${memberId}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                alert("删除成功");
                loadUsers(); // 重新加载表格，ID 自动补位
            } else {
                alert("删除失败");
            }
        })
        .catch(err => {
            console.error(err);
            alert("请求出错");
        });
}

function exportExcel() {
    const keyword = document.getElementById("searchInput").value.trim();
    const url = keyword ? `/api/user/export?keyword=${encodeURIComponent(keyword)}` : '/api/user/export';
    window.location.href = url;
}

function openEditModal(memberId) {
    fetch(`/api/user/${memberId}`)
        .then(res => res.json())
        .then(user => {
            document.getElementById('editMemberId').value = user.member_id || '';
            document.getElementById('editName').value = user.name || '';
            document.getElementById('editPhone').value = user.phone || '';
            document.getElementById('editMembershipType').value = user.membership_type || '';
            document.getElementById('editStartDate').value = user.membership_start_date || '';
            document.getElementById('editEndDate').value = user.membership_end_date || '';
            document.getElementById('editStatus').value = user.status || '';

            const modal = document.getElementById('editModal');
            modal.style.display = 'block';
            modal.classList.remove('modal-animate');
            void modal.offsetWidth;
            modal.classList.add('modal-animate');
        });
}


function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}


// 提交修改表单
function submitEditForm(event) {
    event.preventDefault();

    const startDate = document.getElementById('editStartDate').value;
    const endDate = document.getElementById('editEndDate').value;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
        alert('结束时间不得早于开始时间！');
        return; // 阻止提交
    }

    const formData = {
        member_id: document.getElementById('editMemberId').value,
        name: document.getElementById('editName').value,
        phone: document.getElementById('editPhone').value,
        membership_type: document.getElementById('editMembershipType').value,
        membership_start_date: document.getElementById('editStartDate').value || null,
        membership_end_date: document.getElementById('editEndDate').value || null,
        status: document.getElementById('editStatus').value
    };

    fetch('/api/user/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    }).then(res => {
        if(res.ok) {
            alert('修改成功');
            closeEditModal();
            loadUsers(); // 重新加载表格
        } else {
            alert('修改失败');
        }
    });
}


