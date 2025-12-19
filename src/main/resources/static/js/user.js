

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
                <button class="action-btn edit-btn" onclick="editUser('${user.member_id}')">修改</button>
                <button class="action-btn delete-btn" onclick="deleteUser('${user.member_id}')">删除</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function searchUser() {
    const keyword = document.getElementById('searchInput').value;
    fetch(`/api/user/search?keyword=${keyword}`)
        .then(res => res.json())
        .then(data => renderTable(data));
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
    window.location.href = '/api/user/export';
}

