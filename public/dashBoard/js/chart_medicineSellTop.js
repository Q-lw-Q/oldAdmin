$(function () {
    var dom = document.getElementById("medicineSellTop");
    var myChart = echarts.init(dom);

    var app = {};

    option = {
        backgroundColor: '#ffffff',

        title: {
            // text: '药品销售数据排行',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#222d32'
            }
        },

        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },

        visualMap: {
            show: false,
            min: 80,
            max: 600,
            inRange: {
                colorLightness: [0, 1]
            }
        },
        series: [{
            name: '销量排名',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [{
                    value: 335,
                    name: '阿司匹林缓释片'
                },
                {
                    value: 310,
                    name: '如意珍宝丸'
                },
                {
                    value: 274,
                    name: '复方α-酮酸片'
                },
                {
                    value: 235,
                    name: '穿心莲片'
                },
                {
                    value: 400,
                    name: '感冒灵颗粒'
                }
            ].sort(function (a, b) {
                return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
                normal: {
                    textStyle: {
                        color: '#222d32'
                    }
                }
            },
            labelLine: {
                normal: {
                    // lineStyle: {
                    //     color: 'rgba(255, 255, 255, 0.3)'
                    // },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
                return Math.random() * 200;
            }
        }]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
    // myChart.on("click", function ( b) {
    //     // console.log(e);
    //     console.log(b);
    // });
});