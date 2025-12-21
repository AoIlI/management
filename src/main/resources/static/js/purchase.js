// 购买课程页面JS
document.addEventListener("DOMContentLoaded", function () {
    loadPackages();
});

let currentPurchaseId = null;

function loadPackages() {
    fetch('/api/purchase/packages')
        .then(res => res.json())
        .then(data => {
            console.log('加载的套餐数据:', data);
            renderPackages(data);
        })
        .catch(err => {
            console.error("加载套餐失败", err);
            document.getElementById('packagesGrid').innerHTML = '<div class="empty-state">加载失败，请刷新重试</div>';
        });
}

function renderPackages(packages) {
    const grid = document.getElementById('packagesGrid');
    
    if (!packages || packages.length === 0) {
        grid.innerHTML = '<div class="empty-state">暂无可用套餐</div>';
        return;
    }
    
    grid.innerHTML = packages.map(pkg => {
        const imageClass = getImageClass(pkg);
        const icon = getPackageIcon(pkg);
        const packageName = pkg.package_name || pkg.packageName || '未知套餐';
        const price = pkg.price || 0;
        const packageId = pkg.package_id || pkg.packageId || '';
        
        return `
            <div class="package-card" onclick="goToDetail('${packageId}')">
                <div class="package-image ${imageClass}">
                    ${icon}
                    <div class="package-badge">${getPackageBadge(pkg)}</div>
                </div>
                <div class="package-info">
                    <div class="package-title">${escapeHtml(packageName)}</div>
                    <div class="package-price">
                        <span class="currency">¥</span>${price.toFixed(2)}
                    </div>
                    <ul class="package-features">
                        ${getPackageFeatures(pkg)}
                    </ul>
                </div>
            </div>
        `;
    }).join('');
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

function getPackageBadge(pkg) {
    const packageType = pkg.package_type || pkg.packageType || '';
    if (packageType === 'membership_card') return '会员卡';
    if (packageType === 'class_pack') return '课程包';
    return '套餐';
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
    } else if (packageType === 'class_pack') {
        if (classesCount) {
            features.push(`${classesCount} 次课程`);
        }
        features.push('不改变会员类型');
        features.push('灵活使用');
        features.push('有效期长期有效');
    }
    
    return features.map(f => `<li>${f}</li>`).join('');
}

function goToDetail(packageId) {
    window.location.href = `/packageDetail?packageId=${packageId}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}



