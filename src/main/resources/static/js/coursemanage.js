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

    const weekDays = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    courses.forEach(course => {
        console.log(course);
        const tr = document.createElement('tr');

        // 格式化上课日期 - 使用下划线命名（因为Jackson配置了SNAKE_CASE）
        const dayOfWeekStr = course.day_of_week && course.day_of_week >= 1 && course.day_of_week <= 7 
            ? weekDays[course.day_of_week] 
            : (course.day_of_week || '');

        // 格式化上课时间 - LocalTime格式通常是 "HH:mm:ss"，需要转换为 "HH:mm" 用于显示
        let classTimeStr = course.class_time || '';
        if (classTimeStr && classTimeStr.length > 5) {
            classTimeStr = classTimeStr.substring(0, 5); // 截取前5个字符 "HH:mm"
        }

        tr.innerHTML = `
            <td>${course.class_name || ''}</td>
            <td>${course.coach_name || course.coach_id || ''}</td>
            <td>${dayOfWeekStr}</td>
            <td>${classTimeStr}</td>
            <td>${course.duration_minutes || ''}</td>
            <td>${course.max_capacity || ''}</td>
            <td>${course.current_enrollment || ''}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditModal('${course.class_id}')">修改</button>
                <button class="action-btn delete-btn" onclick="deleteCourse('${course.class_id}')">删除</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function searchCourse() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (!keyword) {
        loadCourses(); // 没输入就加载所有用户
        return;
    }

    fetch(`/api/courseManage/search?keyword=${encodeURIComponent(keyword)}`)
        .then(res => res.json())
        .then(data => renderTable(data))
        .catch(err => console.error('搜索课程失败', err));
}


function deleteCourse(classId) {
    console.log("🐖")
    if (!confirm("确定要删除该课程吗？")) {
        return;
    }

    fetch(`/api/courseManage/${classId}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                alert("删除成功");
                loadCourses(); // 重新加载表格，ID 自动补位
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
    const url = keyword ? `/api/courseManage/export?keyword=${encodeURIComponent(keyword)}` : '/api/courseManage/export';
    window.location.href = url;
}

function openEditModal(classId) {
    fetch(`/api/courseManage/${classId}`)
        .then(res => res.json())
        .then(course => {
            document.getElementById('editClassId').value = course.class_id || '';
            document.getElementById('editClassName').value = course.class_name || '';
            document.getElementById('editCoachId').value = course.coach_id || '';
            document.getElementById('editDayOfWeek').value = course.day_of_week || '';
            // 格式化时间用于time input（需要HH:mm格式）
            let classTimeValue = course.class_time || '';
            if (classTimeValue && classTimeValue.length > 5) {
                classTimeValue = classTimeValue.substring(0, 5);
            }
            document.getElementById('editClassTime').value = classTimeValue;
            document.getElementById('editDurationMinutes').value = course.duration_minutes || '';
            document.getElementById('editMaxCapacity').value = course.max_capacity || '';
            document.getElementById('editCurrentEnrollment').value = course.current_enrollment || '';

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

    // const startDate = document.getElementById('editStartDate').value;
    // const endDate = document.getElementById('editEndDate').value;
    //
    // if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    //     alert('结束时间不得早于开始时间！');
    //     return; // 阻止提交
    // }

    const formData = {
        classId: document.getElementById('editClassId').value,
        className: document.getElementById('editClassName').value,
        coachId: document.getElementById('editCoachId').value,
        dayOfWeek: Number(document.getElementById('editDayOfWeek').value),
        classTime: document.getElementById('editClassTime').value,
        durationMinutes: Number(document.getElementById('editDurationMinutes').value),
        maxCapacity: Number(document.getElementById('editMaxCapacity').value),
        currentEnrollment: Number(document.getElementById('editCurrentEnrollment').value)
    };

    fetch('/api/courseManage/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    }).then(res => {
        if(res.ok) {
            alert('修改成功');
            closeEditModal();
            loadCourses(); // 重新加载表格
        } else {
            alert('修改失败');
        }
    });
}

function openAddModal() {
    document.getElementById('addModal').style.display = 'block';

    const errorDiv = document.getElementById('addErrorMsg');
    errorDiv.style.display = 'none';
    errorDiv.innerText = '';

    document.getElementById('addForm').reset();
}


function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addForm').reset();
}

function submitAddForm(event) {
    event.preventDefault();

    const errorDiv = document.getElementById('addErrorMsg');
    errorDiv.style.display = 'none';
    errorDiv.innerText = '';


    const formData = {
        classId: document.getElementById('addClassId').value,
        className: document.getElementById('addClassName').value,
        coachId: document.getElementById('addCoachId').value,
        dayOfWeek: Number(document.getElementById('addDayOfWeek').value),
        classTime: document.getElementById('addClassTime').value,
        durationMinutes: Number(document.getElementById('addDurationMinutes').value),
        maxCapacity: Number(document.getElementById('addMaxCapacity').value),
        currentEnrollment: 0
    };

    fetch('/api/courseManage/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(async res => {
            const msg = await res.text();

            if (res.ok) {
                closeAddModal();
                loadCourses();
                alert('添加成功');
            } else {
                // ⭐ 显示错误在弹窗中
                errorDiv.innerText = msg || '添加失败';
                errorDiv.style.display = 'block';
            }
        })
        .catch(() => {
            errorDiv.innerText = '网络错误，请稍后再试';
            errorDiv.style.display = 'block';
        });
}
