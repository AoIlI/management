document.addEventListener("DOMContentLoaded", function () {
    loadEquipment();
});

function loadEquipment() {
    fetch('/api/equipmentManage/list')
        .then(res => res.json())
        .then(data => {
            renderTable(data);
        })
        .catch(err => {
            console.error("加载设备失败", err);
        });
}

function renderTable(equipments) {
    const tbody = document.querySelector('#equipmentTable tbody');
    tbody.innerHTML = '';

    if (equipments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px 20px; color: #909399;">暂无设备数据</td></tr>';
        return;
    }

    equipments.forEach(equipment => {
        console.log(equipment);
        const tr = document.createElement('tr');

        // 格式化价格，保留两位小数（因为Jackson配置了SNAKE_CASE，所以使用下划线命名）
        const priceStr = equipment.price ? '¥' + parseFloat(equipment.price).toFixed(2) : '-';
        
        // 格式化日期，只显示日期部分（去掉时间）
        const purchaseDateStr = equipment.purchase_date ? equipment.purchase_date.split('T')[0] : '-';
        
        // 使用年限
        const serviceLifeStr = equipment.service_life ? equipment.service_life + '年' : '-';

        tr.innerHTML = `
            <td>
                <a href="javascript:void(0)" onclick="showEquipmentDetail('${equipment.equipment_id}')" 
                   style="color: #409eff; text-decoration: none; cursor: pointer;">
                   ${equipment.name || ''}
                </a>
            </td>
            <td>${equipment.health_status || '-'}</td>
            <td>${priceStr}</td>
            <td>${purchaseDateStr}</td>
            <td>${serviceLifeStr}</td>
            <td>
                <button class="action-btn edit-btn" onclick="openEditModal('${equipment.equipment_id}')">修改</button>
                <button class="action-btn delete-btn" onclick="deleteEquipment('${equipment.equipment_id}')">删除</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

function searchEquipment() {
    const keyword = document.getElementById('searchInput').value.trim();

    if (!keyword) {
        loadEquipment();
        return;
    }

    fetch('/api/equipmentManage/list')
        .then(res => res.json())
        .then(data => {
            // 前端过滤
            const filtered = data.filter(eq => 
                (eq.name && eq.name.includes(keyword))
            );
            renderTable(filtered);
        })
        .catch(err => console.error('搜索设备失败', err));
}

function showEquipmentDetail(equipmentId) {
    fetch(`/api/equipmentManage/${equipmentId}`)
        .then(res => res.json())
        .then(equipment => {
            const detailDiv = document.getElementById('equipmentDetail');
            
            // 格式化价格（因为Jackson配置了SNAKE_CASE，所以使用下划线命名）
            const priceStr = equipment.price ? '¥' + parseFloat(equipment.price).toFixed(2) : '-';
            
            // 格式化日期
            const purchaseDateStr = equipment.purchase_date ? equipment.purchase_date.split('T')[0] : '-';
            const lastMaintenanceDateStr = equipment.last_maintenance_date ? equipment.last_maintenance_date.split('T')[0] : '-';
            
            // 设备类型映射
            const categoryMap = {
                1: '有氧',
                2: '力量',
                3: '自由重量',
                4: '拉伸',
                6: '综合'
            };
            const categoryStr = categoryMap[equipment.category] || equipment.category || '-';
            
            // 使用年限
            const serviceLifeStr = equipment.service_life ? equipment.service_life + '年' : '-';

            detailDiv.innerHTML = `
                <label>设备ID</label>
                <input type="text" value="${equipment.equipment_id || '-'}" readonly>

                <label>设备名称</label>
                <input type="text" value="${equipment.name || '-'}" readonly>

                <label>器材类型</label>
                <input type="text" value="${categoryStr}" readonly>

                <label>所在区域</label>
                <input type="text" value="${equipment.area || '-'}" readonly>

                <label>价格</label>
                <input type="text" value="${priceStr}" readonly>

                <label>使用年限（年）</label>
                <input type="text" value="${equipment.service_life ? equipment.service_life : '-'}" readonly>

                <label>使用状态</label>
                <input type="text" value="${equipment.status || '-'}" readonly>

                <label>健康状态</label>
                <input type="text" value="${equipment.health_status || '-'}" readonly>

                <label>购入日期</label>
                <input type="text" value="${purchaseDateStr}" readonly>

                <label>最近维护日期</label>
                <input type="text" value="${lastMaintenanceDateStr}" readonly>

                <label>维护次数</label>
                <input type="text" value="${equipment.maintenance_count || 0}" readonly>

                <label>日均使用次数</label>
                <input type="text" value="${equipment.usage_count || 0}" readonly>
            `;

            const modal = document.getElementById('detailModal');
            modal.style.display = 'block';
            modal.classList.remove('modal-animate');
            void modal.offsetWidth;
            modal.classList.add('modal-animate');
        })
        .catch(err => {
            console.error('加载设备详情失败', err);
            alert('加载设备详情失败');
        });
}

function closeDetailModal() {
    document.getElementById('detailModal').style.display = 'none';
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const detailModal = document.getElementById('detailModal');
    const editModal = document.getElementById('editModal');
    const addModal = document.getElementById('addModal');
    if (event.target === detailModal) {
        closeDetailModal();
    }
    if (event.target === editModal) {
        closeEditModal();
    }
    if (event.target === addModal) {
        closeAddModal();
    }
}

function exportExcel() {
    const keyword = document.getElementById("searchInput").value.trim();
    const url = keyword ? `/api/equipmentManage/export?keyword=${encodeURIComponent(keyword)}` : '/api/equipmentManage/export';
    window.location.href = url;
}

function openEditModal(equipmentId) {
    const errorDiv = document.getElementById('editErrorMsg');
    errorDiv.style.display = 'none';
    errorDiv.innerText = '';

    fetch(`/api/equipmentManage/${equipmentId}`)
        .then(res => res.json())
        .then(equipment => {
            // 格式化日期用于date input
            let purchaseDateValue = equipment.purchase_date || '';
            if (purchaseDateValue && purchaseDateValue.length > 10) {
                purchaseDateValue = purchaseDateValue.substring(0, 10);
            }
            let lastMaintenanceDateValue = equipment.last_maintenance_date || '';
            if (lastMaintenanceDateValue && lastMaintenanceDateValue.length > 10) {
                lastMaintenanceDateValue = lastMaintenanceDateValue.substring(0, 10);
            }

            document.getElementById('editEquipmentId').value = equipment.equipment_id || '';
            document.getElementById('editName').value = equipment.name || '';
            document.getElementById('editCategory').value = equipment.category || '1';
            document.getElementById('editArea').value = equipment.area || '';
            document.getElementById('editStatus').value = equipment.status || '使用中';
            document.getElementById('editHealthStatus').value = equipment.health_status || '正常';
            document.getElementById('editPrice').value = equipment.price || '';
            document.getElementById('editPurchaseDate').value = purchaseDateValue;
            document.getElementById('editServiceLife').value = equipment.service_life || '';
            document.getElementById('editLastMaintenanceDate').value = lastMaintenanceDateValue;
            document.getElementById('editMaintenanceCount').value = equipment.maintenance_count || 0;
            document.getElementById('editUsageCount').value = equipment.usage_count || 0;

            const modal = document.getElementById('editModal');
            modal.style.display = 'block';
            modal.classList.remove('modal-animate');
            void modal.offsetWidth;
            modal.classList.add('modal-animate');
        })
        .catch(err => {
            console.error('加载设备信息失败', err);
            alert('加载设备信息失败');
        });
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    const errorDiv = document.getElementById('editErrorMsg');
    errorDiv.style.display = 'none';
    errorDiv.innerText = '';
}

function submitEditForm(event) {
    event.preventDefault();

    const errorDiv = document.getElementById('editErrorMsg');
    errorDiv.style.display = 'none';
    errorDiv.innerText = '';

    const formData = {
        equipmentId: document.getElementById('editEquipmentId').value,
        name: document.getElementById('editName').value,
        category: Number(document.getElementById('editCategory').value),
        area: document.getElementById('editArea').value || null,
        status: document.getElementById('editStatus').value,
        healthStatus: document.getElementById('editHealthStatus').value,
        price: parseFloat(document.getElementById('editPrice').value),
        purchaseDate: document.getElementById('editPurchaseDate').value,
        serviceLife: Number(document.getElementById('editServiceLife').value),
        lastMaintenanceDate: document.getElementById('editLastMaintenanceDate').value || null,
        maintenanceCount: Number(document.getElementById('editMaintenanceCount').value) || 0,
        usageCount: Number(document.getElementById('editUsageCount').value) || 0
    };

    fetch('/api/equipmentManage/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(async res => {
            const msg = await res.text();
            if(res.ok) {
                alert('修改成功');
                closeEditModal();
                loadEquipment();
            } else {
                errorDiv.innerText = msg || '修改失败';
                errorDiv.style.display = 'block';
            }
        })
        .catch(err => {
            console.error(err);
            errorDiv.innerText = '网络错误，请稍后再试';
            errorDiv.style.display = 'block';
        });
}

function deleteEquipment(equipmentId) {
    if (!confirm("确定要删除该设备吗？")) {
        return;
    }

    fetch(`/api/equipmentManage/${equipmentId}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.ok) {
                alert("删除成功");
                loadEquipment();
            } else {
                alert("删除失败");
            }
        })
        .catch(err => {
            console.error(err);
            alert("请求出错");
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

    // 获取当前日期
    const today = new Date().toISOString().split('T')[0];

    const formData = {
        equipmentId: document.getElementById('addEquipmentId').value,
        name: document.getElementById('addName').value,
        category: Number(document.getElementById('addCategory').value),
        area: document.getElementById('addArea').value || null,
        status: '使用中',  // 默认值
        healthStatus: '正常',  // 默认值
        price: parseFloat(document.getElementById('addPrice').value),
        purchaseDate: today,  // 默认值为当前日期
        serviceLife: Number(document.getElementById('addServiceLife').value),
        lastMaintenanceDate: today,  // 默认值为当前日期
        maintenanceCount: 0,  // 默认值
        usageCount: 0  // 默认值
    };

    fetch('/api/equipmentManage/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
        .then(async res => {
            const msg = await res.text();

            if (res.ok) {
                closeAddModal();
                loadEquipment();
                alert('添加成功');
            } else {
                errorDiv.innerText = msg || '添加失败';
                errorDiv.style.display = 'block';
            }
        })
        .catch(() => {
            errorDiv.innerText = '网络错误，请稍后再试';
            errorDiv.style.display = 'block';
        });
}

