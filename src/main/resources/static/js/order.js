// 预约课程页面JS
document.addEventListener("DOMContentLoaded", function () {
    loadCourses();
    loadMyBookings(); // 加载用户的预约记录
});

let allCourses = [];
let myBookings = []; // 存储用户的预约记录

function loadCourses(category = '') {
    const url = category ? `/api/order/courses?category=${encodeURIComponent(category)}` : '/api/order/courses';
    
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            console.log('加载的课程数据:', data);
            allCourses = data || [];
            // 如果预约记录已加载，则渲染；否则等待预约记录加载完成
            if (myBookings.length >= 0) { // 即使为空数组也渲染
                renderCourses(allCourses);
            }
        })
        .catch(err => {
            console.error("加载课程失败", err);
            document.getElementById('coursesGrid').innerHTML = '<div class="empty-state">加载失败，请刷新重试<br>' + err.message + '</div>';
        });
}

function filterCourses() {
    const category = document.getElementById('categoryFilter').value;
    loadCourses(category);
}

// 加载用户的预约记录
function loadMyBookings() {
    fetch('/api/order/my-bookings')
        .then(res => {
            if (!res.ok) {
                console.warn('加载预约记录失败:', res.status);
                return [];
            }
            return res.json();
        })
        .then(data => {
            console.log('用户的预约记录:', data);
            myBookings = data || [];
            // 重新渲染课程列表，显示已预约状态（如果课程已加载）
            if (allCourses.length > 0) {
                renderCourses(allCourses);
            }
        })
        .catch(err => {
            console.error('加载预约记录失败', err);
            myBookings = [];
            // 即使失败也渲染课程（不显示已预约状态）
            if (allCourses.length > 0) {
                renderCourses(allCourses);
            }
        });
}

// 检查课程是否已被预约
function isCourseBooked(classId) {
    if (!classId || !myBookings || myBookings.length === 0) {
        return false;
    }
    
    return myBookings.some(booking => {
        const bookingClassId = booking.class_id || booking.classId;
        const status = booking.status || '';
        return bookingClassId === classId && status === '已确认';
    });
}

function renderCourses(courses) {
    const grid = document.getElementById('coursesGrid');
    
    if (!courses || courses.length === 0) {
        grid.innerHTML = '<div class="empty-state">暂无可用课程</div>';
        return;
    }
    
    // 根据当前时间计算并排序课程（离访问时间从近到远）
    const now = new Date();
    const sortedCourses = courses.map(course => {
        // 兼容驼峰和下划线命名
        const className = course.class_name || course.className || '';
        const classId = course.class_id || course.classId || '';
        const classTime = course.class_time || course.classTime;
        const dayOfWeek = course.day_of_week !== undefined ? course.day_of_week : course.dayOfWeek;
        const durationMinutes = course.duration_minutes !== undefined ? course.duration_minutes : course.durationMinutes;
        const maxCapacity = course.max_capacity !== undefined ? course.max_capacity : course.maxCapacity;
        const currentEnrollment = course.current_enrollment !== undefined ? course.current_enrollment : course.currentEnrollment;
        
        // 处理classTime（可能是对象或字符串）
        const classTimeStr = formatClassTime(classTime);
        
        // 计算下一次开课时间
        const courseForCalc = {
            dayOfWeek: dayOfWeek,
            classTime: classTime
        };
        const nextClassTime = calculateNextClassTime(courseForCalc, now);
        
        // 检查是否已预约
        const booked = isCourseBooked(classId);
        
        return {
            classId: classId,
            className: className,
            classTimeStr: classTimeStr,
            dayOfWeek: dayOfWeek,
            durationMinutes: durationMinutes,
            maxCapacity: maxCapacity,
            currentEnrollment: currentEnrollment,
            nextClassTime: nextClassTime,
            booked: booked
        };
    }).sort((a, b) => {
        // 按下次开课时间排序
        if (!a.nextClassTime && !b.nextClassTime) return 0;
        if (!a.nextClassTime) return 1;
        if (!b.nextClassTime) return -1;
        return a.nextClassTime - b.nextClassTime;
    });
    
    console.log('排序后的课程:', sortedCourses);
    
    grid.innerHTML = sortedCourses.map(course => {
        const nextTimeStr = course.nextClassTime 
            ? formatDateTime(course.nextClassTime)
            : '暂无排课';
        const imageClass = getImageClass(course.className || '');
        const className = course.className || '未知课程';
        const classTimeDisplay = course.classTimeStr || '-';
        const isFull = (course.currentEnrollment || 0) >= (course.maxCapacity || 0);
        const booked = course.booked || false;
        
        return `
            <div class="course-card ${booked ? 'booked' : ''}" onclick="goToDetail('${course.classId || ''}')">
                <div class="course-image ${imageClass}">
                    ${getCourseIcon(className)}
                    ${booked ? '<div class="booked-badge">已预约</div>' : ''}
                </div>
                <div class="course-info">
                    <div class="course-title">${escapeHtml(className)}</div>
                    <div class="course-time">
                        <span>📅</span>
                        <span>${getDayOfWeekText(course.dayOfWeek)} ${classTimeDisplay}</span>
                    </div>
                    <div class="course-time">
                        <span>⏰</span>
                        <span>下次开课：${nextTimeStr}</span>
                    </div>
                    <div class="course-meta">
                        <span class="course-capacity ${isFull ? 'full' : ''}">
                            ${course.currentEnrollment || 0}/${course.maxCapacity || 0} 人
                            ${isFull ? '(已满)' : ''}
                        </span>
                        <span>时长：${course.durationMinutes || 0}分钟</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// HTML转义函数，防止XSS攻击
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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

function calculateNextClassTime(course, now) {
    if (course.dayOfWeek === undefined || course.dayOfWeek === null || !course.classTime) {
        return null;
    }
    
    const currentDay = now.getDay(); // 0=周日, 1=周一, ..., 6=周六
    const targetDay = course.dayOfWeek === 7 ? 0 : course.dayOfWeek; // 转换为JS的day格式
    
    // 格式化classTime
    const classTimeStr = formatClassTime(course.classTime);
    if (!classTimeStr) {
        return null;
    }
    
    // 解析时间
    const timeParts = classTimeStr.split(':');
    if (timeParts.length < 2) {
        return null;
    }
    const targetHour = parseInt(timeParts[0]);
    const targetMinute = parseInt(timeParts[1]);
    
    if (isNaN(targetHour) || isNaN(targetMinute)) {
        return null;
    }
    
    // 计算下一次开课时间
    const nextTime = new Date(now);
    nextTime.setHours(targetHour, targetMinute, 0, 0);
    
    // 计算距离目标星期几还有多少天
    let daysUntilTarget = targetDay - currentDay;
    if (daysUntilTarget < 0) {
        daysUntilTarget += 7; // 下周
    } else if (daysUntilTarget === 0) {
        // 如果是今天，检查时间是否已过
        if (nextTime < now) {
            daysUntilTarget = 7; // 下周
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

function goToDetail(classId) {
    window.location.href = `/courseDetail?classId=${classId}`;
}


