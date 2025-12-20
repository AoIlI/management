function loadEquipment() {
    fetch("/api/equipment/list")
        .then(response => response.json())
        .then(data => {
            console.log("获取到数据：", data);
            notifyCharts(data);
        })
        .catch(err => console.error("请求失败", err));
}

// 页面加载后立即执行一次
loadEquipment();

// 每 30 秒轮询一次
setInterval(loadEquipment, 30000);

const chartSubscribers = [];

function registerChart(fn) {
    chartSubscribers.push(fn);
}

function notifyCharts(data) {
    chartSubscribers.forEach(fn => fn(data));
}

const categoryMap = {
    1: "有氧",
    2: "力量",
    3: "自由重量",
    4: "拉伸",
    6: "综合"
};

const healthStatusMap = ["正常", "磨损", "严重磨损"];
const statusMap = ["空闲中", "使用中", "维修中"];

let categoryPieChart = null;

function updateCategoryPie(data) {
    const countMap = {};

    data.forEach(e => {
        const c = e.category;
        if (categoryMap[c]) {
            countMap[c] = (countMap[c] || 0) + 1;
        }
    });

    const pieData = Object.keys(countMap).map(key => ({
        name: categoryMap[key],
        value: countMap[key]
    }));

    if (!categoryPieChart) {
        categoryPieChart = echarts.init(
            document.getElementById("categoryPie")
        );
    }

    categoryPieChart.setOption({
        title: {
            text: "器材分类占比",
            left: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}：{c} 台 ({d}%)"
        },
        legend: {
            bottom: 0,
            left: "center"
        },
        series: [
            {
                type: "pie",
                radius: "60%",
                data: pieData
            }
        ]
    });
}

let maintenanceBarChart = null;

function updateMaintenanceBar(data) {
    // 取 maintenance_count 不为空的设备
    const list = data
        .filter(e => e.maintenance_count != null)
        .sort((a, b) => b.maintenance_count - a.maintenance_count)
        .slice(0, 10); // Top 10

    const names = list.map(e => e.name || e.equipment_id);
    const values = list.map(e => e.maintenance_count);

    if (!maintenanceBarChart) {
        maintenanceBarChart = echarts.init(
            document.getElementById("maintenanceBar")
        );
    }

    maintenanceBarChart.setOption({
        title: {
            text: "维修次数 Top10 设备",
            left: "center"
        },
        tooltip: {
            trigger: "axis"
        },
        xAxis: {
            type: "category",
            data: names,
            axisLabel: {
                rotate: 30
            }
        },
        yAxis: {
            type: "value",
            name: "维修次数"
        },
        series: [
            {
                type: "bar",
                data: values
            }
        ]
    });
}

let maintenanceLineChart = null;

function updateMaintenanceLine(data) {
    const monthCount = {};

    data.forEach(e => {
        if (!e.last_maintenance_date) return;

        // 取 yyyy-MM
        const month = e.last_maintenance_date.substring(0, 7);
        monthCount[month] = (monthCount[month] || 0) + 1;
    });

    const months = Object.keys(monthCount).sort();
    const values = months.map(m => monthCount[m]);

    if (!maintenanceLineChart) {
        maintenanceLineChart = echarts.init(
            document.getElementById("maintenanceLine")
        );
    }

    maintenanceLineChart.setOption({
        title: {
            text: "设备维修时间趋势",
            left: "center"
        },
        tooltip: {
            trigger: "axis"
        },
        xAxis: {
            type: "category",
            data: months
        },
        yAxis: {
            type: "value",
            name: "维修次数"
        },
        series: [
            {
                type: "line",
                smooth: true,
                data: values
            }
        ]
    });
}

let healthStatusPieChart = null;

function updateHealthStatusPie(data) {
    const counter = {
        "正常": 0,
        "磨损": 0,
        "严重磨损": 0
    };

    data.forEach(e => {
        if (e.health_status && counter.hasOwnProperty(e.health_status)) {
            counter[e.health_status]++;
        }
    });

    const pieData = Object.keys(counter).map(k => ({
        name: k,
        value: counter[k]
    }));

    if (!healthStatusPieChart) {
        healthStatusPieChart = echarts.init(
            document.getElementById("healthStatusPie")
        );
    }

    healthStatusPieChart.setOption({
        title: {
            text: "设备健康状态分布",
            left: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c} ({d}%)"
        },
        legend: {
            bottom: 0,
            left: "center"
        },
        series: [
            {
                type: "pie",
                radius: "60%",
                data: pieData
            }
        ]
    });
}

let statusPieChart = null;

function updateStatusPie(data) {
    const counter = {
        "空闲中": 0,
        "使用中": 0,
        "维修中": 0
    };

    data.forEach(e => {
        if (e.status && counter.hasOwnProperty(e.status)) {
            counter[e.status]++;
        }
    });

    const pieData = Object.keys(counter).map(k => ({
        name: k,
        value: counter[k]
    }));

    if (!statusPieChart) {
        statusPieChart = echarts.init(
            document.getElementById("statusPie")
        );
    }

    statusPieChart.setOption({
        title: {
            text: "设备使用状态分布",
            left: "center"
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c} ({d}%)"
        },
        legend: {
            bottom: 0,
            left: "center"
        },
        series: [
            {
                type: "pie",
                radius: "60%",
                data: pieData
            }
        ]
    });
}
let usageCountChart = null;

function updateUsageCountBar(data) {
    // 按使用次数排序 Top 10
    const sorted = data
        .filter(e => e.usage_count != null)
        .sort((a,b) => b.usage_count - a.usage_count)
        .slice(0, 10);

    const names = sorted.map(e => e.name || e.equipment_id);
    const values = sorted.map(e => e.usage_count);

    if (!usageCountChart) {
        usageCountChart = echarts.init(
            document.getElementById("usageCountBar")
        );
    }

    usageCountChart.setOption({
        title: { text: "设备使用次数 Top10", left: "center" },
        tooltip: { trigger: "axis" },
        xAxis: { type: "category", data: names, axisLabel:{ rotate:30 } },
        yAxis: { type: "value", name: "使用次数" },
        series: [
            { type: "bar", data: values }
        ]
    });
}
let areaPieChart = null;

function updateAreaPie(data) {
    const counter = {};

    data.forEach(e => {
        const area = e.area || "未知";
        counter[area] = (counter[area] || 0) + 1;
    });

    const pieData = Object.keys(counter).map(k => ({
        name: k,
        value: counter[k]
    }));

    if (!areaPieChart) {
        areaPieChart = echarts.init(
            document.getElementById("areaPie")
        );
    }

    areaPieChart.setOption({
        title: { text: "各区域设备分布", left: "center" },
        tooltip: { trigger: "item", formatter: "{b}: {c} ({d}%)" },
        legend: { bottom: 0, left: "center" },
        series: [
            { type: "pie", radius: "60%", data: pieData }
        ]
    });
}
//注册图标
registerChart(updateAreaPie);
registerChart(updateUsageCountBar);
registerChart(updateHealthStatusPie);
registerChart(updateStatusPie);
registerChart(updateMaintenanceLine);
registerChart(updateMaintenanceBar);
registerChart(updateCategoryPie);

// let currentPage = 0;
//
// function showPage(index) {
//     const pages = document.querySelectorAll(".chart-page");
//     pages.forEach(p => p.classList.remove("active"));
//     pages[index].classList.add("active");
//
//     currentPage = index;
//
//     // 触发图表自适应
//     setTimeout(() => {
//         window.dispatchEvent(new Event("resize"));
//     }, 100);
// }
//
// function nextChart() {
//     const pages = document.querySelectorAll(".chart-page");
//     const next = (currentPage + 1) % pages.length;
//     showPage(next);
// }
//
// function prevChart() {
//     const pages = document.querySelectorAll(".chart-page");
//     const prev = (currentPage - 1 + pages.length) % pages.length;
//     showPage(prev);
// }
//
// // 默认显示第一页
// showPage(0);