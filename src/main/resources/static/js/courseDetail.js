// 课程详情页面JS
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('classId');
    
    if (classId) {
        loadCourseDetail(classId);
    } else {
        document.getElementById('courseDetailContent').innerHTML = '<div class="empty-state">课程ID不存在</div>';
    }
});

function loadCourseDetail(classId) {
    fetch(`/api/order/course/${classId}`)
        .then(res => res.json())
        .then(course => {
            renderCourseDetail(course);
            checkBookingStatus(classId);
        })
        .catch(err => {
            console.error("加载课程详情失败", err);
            document.getElementById('courseDetailContent').innerHTML = '<div class="empty-state">加载失败，请刷新重试</div>';
        });
}

function renderCourseDetail(course) {
    const container = document.getElementById('courseDetailContent');
    
    // 兼容驼峰和下划线命名
    const className = course.class_name || course.className || '未知课程';
    const classId = course.class_id || course.classId || '';
    const classTime = course.class_time || course.classTime;
    const dayOfWeek = course.day_of_week !== undefined ? course.day_of_week : course.dayOfWeek;
    const durationMinutes = course.duration_minutes !== undefined ? course.duration_minutes : course.durationMinutes;
    const maxCapacity = course.max_capacity !== undefined ? course.max_capacity : course.maxCapacity;
    const currentEnrollment = course.current_enrollment !== undefined ? course.current_enrollment : course.currentEnrollment;
    
    const now = new Date();
    const courseForCalc = {
        dayOfWeek: dayOfWeek,
        classTime: classTime
    };
    const nextClassTime = calculateNextClassTime(courseForCalc, now);
    const nextTimeStr = nextClassTime ? formatDateTime(nextClassTime) : '暂无排课';
    const imageClass = getImageClass(className);
    const classTimeStr = formatClassTime(classTime);
    const isFull = (currentEnrollment || 0) >= (maxCapacity || 0);
    
    container.innerHTML = `
        <div class="course-detail-header">
            <div class="course-detail-image ${imageClass}">
                ${getCourseIcon(className)}
            </div>
            <div class="course-detail-info">
                <h1 class="course-detail-title">${escapeHtml(className)}</h1>
                <div class="course-detail-item">
                    <span class="course-detail-label">开课时间：</span>
                    <span>${getDayOfWeekText(dayOfWeek)} ${classTimeStr}</span>
                </div>
                <div class="course-detail-item">
                    <span class="course-detail-label">下次开课：</span>
                    <span>${nextTimeStr}</span>
                </div>
                <div class="course-detail-item">
                    <span class="course-detail-label">课程时长：</span>
                    <span>${durationMinutes || 0} 分钟</span>
                </div>
                <div class="course-detail-item">
                    <span class="course-detail-label">课程容量：</span>
                    <span>${currentEnrollment || 0}/${maxCapacity || 0} 人 ${isFull ? '(已满)' : ''}</span>
                </div>
                <div class="course-detail-item">
                    <span class="course-detail-label">课程ID：</span>
                    <span>${classId}</span>
                </div>
            </div>
        </div>
        
        <div class="course-description">
            <h3>课程介绍</h3>
            <p>${getCourseDescription(className)}</p>
        </div>
        
        <div class="booking-actions">
            <button id="bookBtn" class="btn-book" onclick="bookCourse('${classId}')" ${isFull ? 'disabled' : ''}>
                ${isFull ? '课程已满' : '确认预约'}
            </button>
        </div>
    `;
}

function checkBookingStatus(classId) {
    fetch(`/api/order/check/${classId}`)
        .then(res => res.json())
        .then(result => {
            const bookBtn = document.getElementById('bookBtn');
            if (!result.canBook) {
                bookBtn.disabled = true;
                bookBtn.textContent = result.message || '无法预约';
            }
        })
        .catch(err => {
            console.error("检查预约状态失败", err);
        });
}

function bookCourse(classId) {
    if (!confirm("确定要预约该课程吗？")) {
        return;
    }
    
    const bookBtn = document.getElementById('bookBtn');
    bookBtn.disabled = true;
    bookBtn.textContent = '预约中...';
    
    fetch(`/api/order/book/${classId}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('预约成功！');
                window.location.href = '/order';
            } else {
                alert('预约失败：' + result.message);
                bookBtn.disabled = false;
                bookBtn.textContent = '确认预约';
            }
        })
        .catch(err => {
            console.error("预约失败", err);
            alert('预约失败，请重试');
            bookBtn.disabled = false;
            bookBtn.textContent = '确认预约';
        });
}

function calculateNextClassTime(course, now) {
    if (course.dayOfWeek === undefined || course.dayOfWeek === null || !course.classTime) {
        return null;
    }
    
    const currentDay = now.getDay();
    const targetDay = course.dayOfWeek === 7 ? 0 : course.dayOfWeek;
    
    // 格式化classTime
    const classTimeStr = formatClassTime(course.classTime);
    if (!classTimeStr) {
        return null;
    }
    
    const timeParts = classTimeStr.split(':');
    if (timeParts.length < 2) {
        return null;
    }
    const targetHour = parseInt(timeParts[0]);
    const targetMinute = parseInt(timeParts[1]);
    
    if (isNaN(targetHour) || isNaN(targetMinute)) {
        return null;
    }
    
    const nextTime = new Date(now);
    nextTime.setHours(targetHour, targetMinute, 0, 0);
    
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget < 0) {
        daysUntilTarget += 7;
    } else if (daysUntilTarget === 0) {
        if (nextTime < now) {
            daysUntilTarget = 7;
        }
    }
    
    nextTime.setDate(now.getDate() + daysUntilTarget);
    return nextTime;
}

function formatDateTime(date) {
    if (!date) return '';
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
}

function getDayOfWeekText(dayOfWeek) {
    const days = ['', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    return days[dayOfWeek] || '';
}

// 格式化classTime（处理LocalTime对象或字符串）
function formatClassTime(classTime) {
    if (!classTime) return '';
    
    // 如果是字符串，直接返回
    if (typeof classTime === 'string') {
        return classTime;
    }
    
    // 如果是对象（LocalTime序列化后的格式），提取时间部分
    if (typeof classTime === 'object') {
        // LocalTime序列化后可能是 {hour: 10, minute: 30} 或类似格式
        if (classTime.hour !== undefined && classTime.minute !== undefined) {
            const hour = String(classTime.hour).padStart(2, '0');
            const minute = String(classTime.minute).padStart(2, '0');
            return `${hour}:${minute}`;
        }
        // 或者可能是数组格式 [10, 30]
        if (Array.isArray(classTime)) {
            return classTime.map(n => String(n).padStart(2, '0')).join(':');
        }
    }
    
    return String(classTime);
}

function getImageClass(className) {
    if (!className || typeof className !== 'string') {
        return 'cardio';
    }
    const name = className.toLowerCase();
    if (name.includes('瑜伽') || name.includes('普拉提') || name.includes('拉伸')) {
        return 'yoga';
    } else if (name.includes('力量') || name.includes('增肌') || name.includes('核心')) {
        return 'strength';
    } else if (name.includes('hiit') || name.includes('高强度')) {
        return 'hiit';
    } else {
        return 'cardio';
    }
}

function getCourseIcon(className) {
    if (!className || typeof className !== 'string') {
        return '🏋️';
    }
    const name = className.toLowerCase();
    if (name.includes('瑜伽')) return '🧘';
    if (name.includes('力量') || name.includes('增肌')) return '💪';
    if (name.includes('有氧') || name.includes('燃脂')) return '🏃';
    if (name.includes('hiit')) return '⚡';
    if (name.includes('普拉提')) return '🤸';
    return '🏋️';
}

// HTML转义函数
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCourseDescription(className) {
    if (!className || typeof className !== 'string') {
        return '专业的健身课程，由经验丰富的教练指导，帮助您达到健身目标。';
    }
    const name = className.toLowerCase();
    if (name.includes('力量') || name.includes('增肌')) {
        return '专注于肌肉力量训练和体型塑造，适合想要增肌和提升力量的人群。课程包含基础力量训练动作指导，帮助您安全有效地进行力量训练。';
    } else if (name.includes('有氧') || name.includes('燃脂')) {
        return '高效的有氧运动课程，帮助您燃烧卡路里，提升心肺功能，塑造完美身材。适合所有健身水平的学员。';
    } else if (name.includes('瑜伽')) {
        return '通过瑜伽体式练习，帮助您放松身心，提升柔韧性，改善体态。适合想要缓解压力、提升身体柔韧性的学员。';
    } else if (name.includes('普拉提')) {
        return '普拉提核心训练课程，专注于核心肌群的强化，改善身体姿态，提升身体控制能力。';
    } else if (name.includes('hiit') || name.includes('高强度')) {
        return '高强度间歇训练，短时间内高效燃脂，提升心肺功能和代谢水平。适合有一定运动基础的学员。';
    } else {
        return '专业的健身课程，由经验丰富的教练指导，帮助您达到健身目标。';
    }
}


