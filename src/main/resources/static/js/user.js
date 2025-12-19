

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
        `;

        tbody.appendChild(tr);
    });
}
