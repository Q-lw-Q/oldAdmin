$(function () {//药店问诊购药排行
    var dom = document.getElementById("drugstoreMedicineSellTop");
    var myChart = echarts.init(dom);
    var app = {};

    option = {
        backgroundColor: '#2c343c',

        title: {
            text: '药店问诊购药排行',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: ['#37a2da', '#ffd85c'],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: ['维C银翘片', '安神补脑液', '胃乃安胶囊', '感冒灵颗粒', '复方氨酚烷胺胶囊','跌打镇痛膏'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine: {
                    lineStyle: {
                        color: '#fff',

                    }
                },
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#fff',

                    }
                },
            }
        ],
        series: [
            {
                name: '数量',
                type: 'bar',
               // barWidth: '60%',
                data: [1526, 800, 795,650 , 630,501],
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '12',
                            color: '#fff',
                            fontWeight: 'bold'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },

            }
        ]
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
});