// 套餐详情页面JS
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const packageId = urlParams.get('packageId');
    
    if (packageId) {
        loadPackageDetail(packageId);
    } else {
        document.getElementById('packageDetailContent').innerHTML = '<div class="empty-state">套餐ID不存在</div>';
    }
});

let currentPurchaseId = null;
let currentPackage = null;

function loadPackageDetail(packageId) {
    fetch(`/api/purchase/package/${packageId}`)
        .then(res => res.json())
        .then(pkg => {
            currentPackage = pkg;
            renderPackageDetail(pkg);
        })
        .catch(err => {
            console.error("加载套餐详情失败", err);
            document.getElementById('packageDetailContent').innerHTML = '<div class="empty-state">加载失败，请刷新重试</div>';
        });
}

function renderPackageDetail(pkg) {
    const container = document.getElementById('packageDetailContent');
    const imageClass = getImageClass(pkg);
    const icon = getPackageIcon(pkg);
    const packageName = pkg.package_name || pkg.packageName || '未知套餐';
    const price = pkg.price || 0;
    const description = pkg.description || '暂无描述';
    const packageId = pkg.package_id || pkg.packageId || '';
    
    container.innerHTML = `
        <div class="package-detail-header">
            <div class="package-detail-image ${imageClass}">
                ${icon}
            </div>
            <div class="package-detail-info">
                <h1 class="package-detail-title">${escapeHtml(packageName)}</h1>
                <div class="package-detail-price">
                    <span class="currency">¥</span>${price.toFixed(2)}
                </div>
                <ul class="package-features">
                    ${getPackageFeatures(pkg)}
                </ul>
            </div>
        </div>
        
        <div class="package-description">
            <h3>套餐介绍</h3>
            <p>${escapeHtml(description)}</p>
        </div>
        
        <div class="purchase-actions">
            <button class="btn-buy-large" onclick="openPaymentModal('${packageId}')">立即购买</button>
        </div>
    `;
}

function getImageClass(pkg) {
    const packageType = pkg.package_type || pkg.packageType || '';
    const membershipType = pkg.membership_type || pkg.membershipType || '';
    
    if (membershipType === '年卡') return 'year-card';
    if (membershipType === '季卡') return 'quarter-card';
    if (membershipType === '月卡') return 'month-card';
    if (packageType === 'class_pack') return 'class-pack';
    return 'year-card';
}

function getPackageIcon(pkg) {
    const membershipType = pkg.membership_type || pkg.membershipType || '';
    const packageType = pkg.package_type || pkg.packageType || '';
    
    if (membershipType === '年卡') return '💎';
    if (membershipType === '季卡') return '⭐';
    if (membershipType === '月卡') return '✨';
    if (packageType === 'class_pack') return '🎯';
    return '🏋️';
}

function getPackageFeatures(pkg) {
    const packageType = pkg.package_type || pkg.packageType || '';
    const membershipType = pkg.membership_type || pkg.membershipType || '';
    const classesPerMonth = pkg.classes_per_month || pkg.classesPerMonth;
    const classesCount = pkg.classes_count || pkg.classesCount;
    const validityDays = pkg.validity_days || pkg.validityDays;
    
    let features = [];
    
    if (packageType === 'membership_card') {
        if (classesPerMonth) {
            features.push(`每月 ${classesPerMonth} 次课程`);
        }
        if (validityDays) {
            const months = Math.floor(validityDays / 30);
            features.push(`有效期 ${months} 个月`);
        }
        features.push('专业教练指导');
        features.push('优先预约课程');
        features.push('24小时健身房使用权');
    } else if (packageType === 'class_pack') {
        if (classesCount) {
            features.push(`${classesCount} 次课程`);
        }
        features.push('不改变会员类型');
        features.push('灵活使用');
        features.push('有效期长期有效');
        features.push('可随时预约');
    }
    
    return features.map(f => `<li>${f}</li>`).join('');
}

function openPaymentModal(packageId) {
    if (!currentPackage) {
        alert('套餐信息加载中，请稍候');
        return;
    }
    
    const price = currentPackage.price || 0;
    
    // 创建购买订单
    fetch(`/api/purchase/create/${packageId}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                currentPurchaseId = result.purchaseId;
                document.getElementById('paymentAmount').textContent = `¥${price.toFixed(2)}`;
                document.getElementById('paymentModal').classList.add('show');
            } else {
                alert('创建订单失败：' + result.message);
            }
        })
        .catch(err => {
            console.error("创建订单失败", err);
            alert('创建订单失败，请重试');
        });
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('show');
    currentPurchaseId = null;
}

function confirmPayment() {
    if (!currentPurchaseId) {
        alert('订单信息错误');
        return;
    }
    
    fetch(`/api/purchase/confirm/${currentPurchaseId}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('支付成功！');
                closePaymentModal();
                window.location.href = '/purchase_course';
            } else {
                alert('支付失败：' + result.message);
            }
        })
        .catch(err => {
            console.error("支付失败", err);
            alert('支付失败，请重试');
        });
}

function cancelPayment() {
    if (!currentPurchaseId) {
        closePaymentModal();
        return;
    }
    
    if (!confirm("确定要取消支付吗？")) {
        return;
    }
    
    fetch(`/api/purchase/cancel/${currentPurchaseId}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(result => {
            if (result.success) {
                alert('已取消支付');
            } else {
                alert('取消支付失败：' + result.message);
            }
            closePaymentModal();
        })
        .catch(err => {
            console.error("取消支付失败", err);
            alert('取消支付失败，请重试');
            closePaymentModal();
        });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 点击弹窗外部关闭弹窗
window.onclick = function(event) {
    const modal = document.getElementById('paymentModal');
    if (event.target === modal) {
        closePaymentModal();
    }
}



