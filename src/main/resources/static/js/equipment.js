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
            left: "center",
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}：{c} 台 ({d}%)",
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#667eea',
            borderWidth: 1,
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            bottom: 10,
            left: "center",
            textStyle: {
                fontSize: 12,
                color: '#555'
            }
        },
        color: [
            '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'
        ],
        series: [
            {
                type: "pie",
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: true,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    label: {
                        fontSize: 14
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                },
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
            left: "center",
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#fa709a',
            borderWidth: 1,
            textStyle: {
                color: '#fff'
            },
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '20%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: "category",
            data: names,
            axisLabel: {
                rotate: 30,
                fontSize: 11,
                color: '#666',
                interval: 0
            },
            axisLine: {
                lineStyle: {
                    color: '#e0e0e0'
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: "value",
            name: "维修次数",
            nameTextStyle: {
                color: '#666',
                fontSize: 12
            },
            axisLabel: {
                color: '#666',
                fontSize: 11
            },
            axisLine: {
                lineStyle: {
                    color: '#e0e0e0'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                type: "bar",
                data: values.map((val, idx) => ({
                    value: val,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#fa709a' },
                                { offset: 1, color: '#fee140' }
                            ]
                        },
                        borderRadius: [4, 4, 0, 0]
                    }
                })),
                barWidth: '60%',
                label: {
                    show: true,
                    position: 'top',
                    color: '#666',
                    fontSize: 11
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(250, 112, 154, 0.5)'
                    }
                },
                animationDelay: function (idx) {
                    return idx * 50;
                }
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
            left: "center",
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#667eea',
            borderWidth: 1,
            textStyle: {
                color: '#fff'
            },
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#667eea'
                }
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: "category",
            data: months,
            axisLabel: {
                color: '#666',
                fontSize: 11
            },
            axisLine: {
                lineStyle: {
                    color: '#e0e0e0'
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: "value",
            name: "维修次数",
            nameTextStyle: {
                color: '#666',
                fontSize: 12
            },
            axisLabel: {
                color: '#666',
                fontSize: 11
            },
            axisLine: {
                lineStyle: {
                    color: '#e0e0e0'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                type: "line",
                smooth: true,
                data: values,
                lineStyle: {
                    width: 3,
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 1,
                        y2: 0,
                        colorStops: [
                            { offset: 0, color: '#667eea' },
                            { offset: 1, color: '#764ba2' }
                        ]
                    }
                },
                itemStyle: {
                    color: '#667eea',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
                            { offset: 1, color: 'rgba(118, 75, 162, 0.1)' }
                        ]
                    }
                },
                symbol: 'circle',
                symbolSize: 8,
                label: {
                    show: true,
                    position: 'top',
                    color: '#666',
                    fontSize: 11
                },
                emphasis: {
                    focus: 'series',
                    itemStyle: {
                        borderWidth: 3,
                        shadowBlur: 10,
                        shadowColor: 'rgba(102, 126, 234, 0.5)'
                    }
                },
                animationDuration: 1000,
                animationEasing: 'cubicOut'
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

    // 健康状态颜色映射：正常-绿色，磨损-橙色，严重磨损-红色
    const healthColors = {
        "正常": ['#84fab0', '#8fd3f4'],
        "磨损": ['#ffecd2', '#fcb69f'],
        "严重磨损": ['#ff9a9e', '#fecfef']
    };
    
    const healthPieData = pieData.map(item => ({
        ...item,
        itemStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    { offset: 0, color: healthColors[item.name]?.[0] || '#667eea' },
                    { offset: 1, color: healthColors[item.name]?.[1] || '#764ba2' }
                ]
            },
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
        }
    }));

    healthStatusPieChart.setOption({
        title: {
            text: "设备健康状态分布",
            left: "center",
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c} ({d}%)",
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#84fab0',
            borderWidth: 1,
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            bottom: 10,
            left: "center",
            textStyle: {
                fontSize: 12,
                color: '#555'
            }
        },
        series: [
            {
                type: "pie",
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    label: {
                        fontSize: 14
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                },
                data: healthPieData
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

    // 使用状态颜色映射：空闲中-蓝色，使用中-绿色，维修中-橙色
    const statusColors = {
        "空闲中": ['#667eea', '#764ba2'],
        "使用中": ['#84fab0', '#8fd3f4'],
        "维修中": ['#ffecd2', '#fcb69f']
    };
    
    const statusPieData = pieData.map(item => ({
        ...item,
        itemStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    { offset: 0, color: statusColors[item.name]?.[0] || '#667eea' },
                    { offset: 1, color: statusColors[item.name]?.[1] || '#764ba2' }
                ]
            },
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
        }
    }));

    statusPieChart.setOption({
        title: {
            text: "设备使用状态分布",
            left: "center",
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}<br/>数量：{c} ({d}%)",
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#667eea',
            borderWidth: 1,
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            bottom: 10,
            left: "center",
            textStyle: {
                fontSize: 12,
                color: '#555'
            }
        },
        series: [
            {
                type: "pie",
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    label: {
                        fontSize: 14
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                },
                data: statusPieData
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
        title: {
            text: "设备使用次数 Top10",
            left: "center",
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: "axis",
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#4facfe',
            borderWidth: 1,
            textStyle: {
                color: '#fff'
            },
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '20%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: "category",
            data: names,
            axisLabel: {
                rotate: 30,
                fontSize: 11,
                color: '#666',
                interval: 0
            },
            axisLine: {
                lineStyle: {
                    color: '#e0e0e0'
                }
            },
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: "value",
            name: "使用次数",
            nameTextStyle: {
                color: '#666',
                fontSize: 12
            },
            axisLabel: {
                color: '#666',
                fontSize: 11
            },
            axisLine: {
                lineStyle: {
                    color: '#e0e0e0'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#f0f0f0',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                type: "bar",
                data: values.map((val, idx) => ({
                    value: val,
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [
                                { offset: 0, color: '#4facfe' },
                                { offset: 1, color: '#00f2fe' }
                            ]
                        },
                        borderRadius: [4, 4, 0, 0]
                    }
                })),
                barWidth: '60%',
                label: {
                    show: true,
                    position: 'top',
                    color: '#666',
                    fontSize: 11
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(79, 172, 254, 0.5)'
                    }
                },
                animationDelay: function (idx) {
                    return idx * 50;
                }
            }
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

    // 区域分布使用多彩渐变色
    const areaColors = [
        ['#667eea', '#764ba2'],
        ['#f093fb', '#f5576c'],
        ['#4facfe', '#00f2fe'],
        ['#43e97b', '#38f9d7'],
        ['#fa709a', '#fee140'],
        ['#30cfd0', '#330867'],
        ['#a8edea', '#fed6e3']
    ];
    
    const areaPieData = pieData.map((item, index) => ({
        ...item,
        itemStyle: {
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                    { offset: 0, color: areaColors[index % areaColors.length][0] },
                    { offset: 1, color: areaColors[index % areaColors.length][1] }
                ]
            },
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
        }
    }));

    areaPieChart.setOption({
        title: {
            text: "各区域设备分布",
            left: "center",
            textStyle: {
                fontSize: 16,
                fontWeight: 'bold',
                color: '#2c3e50'
            }
        },
        tooltip: {
            trigger: "item",
            formatter: "{b}: {c} ({d}%)",
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#667eea',
            borderWidth: 1,
            textStyle: {
                color: '#fff'
            }
        },
        legend: {
            bottom: 10,
            left: "center",
            textStyle: {
                fontSize: 12,
                color: '#555'
            }
        },
        series: [
            {
                type: "pie",
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: true,
                label: {
                    show: true,
                    formatter: '{b}\n{d}%',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                labelLine: {
                    show: true,
                    length: 15,
                    length2: 10
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    label: {
                        fontSize: 14
                    }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                },
                data: areaPieData
            }
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