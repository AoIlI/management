document.addEventListener("DOMContentLoaded", function () {
    loadCourses();
});

function loadCourses() {
    fetch('/api/courseManage/list')
        .then(res => res.json())
        .then(data => {
            renderTable(data);
        })
        .catch(err => {
            console.error("加载课程失败", err);
        });
}

function renderTable(courses) {
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = '';

    courses.forEach(course => {
        console.log(course);
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${course.class_id}</td>
            <td>${course.class_name}</td>
            <td>${course.coach_id}</td>
            <td>${course.schedule_time}</td>
            <td>${course.duration_minutes}</td>
            <td>${course.max_capacity}</td>
            <td>${course.current_enrollment}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditModal('${course.member_id}')">修改</button>
                <button class="action-btn delete-btn" onclick="deleteUser('${course.member_id}')">删除</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}
