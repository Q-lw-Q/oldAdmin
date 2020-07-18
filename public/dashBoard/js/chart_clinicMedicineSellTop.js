$(function () {
    var dom = document.getElementById("clinicMedicineSellTop");
    var myChart = echarts.init(dom);

    var app = {};

    option = {
        backgroundColor: '#2c343c',

        title: {
            text: '诊所问诊购药排行',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
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
        series: [
            {
                name: '销量排名',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                data: [
                    { value: 2335, name: '维C银翘片' },
                    { value: 2310, name: '感冒灵颗粒' },
                    { value: 1974, name: '复方α-酮酸片' },
                    { value: 1235, name: '黑素维生素B6' },
                    { value: 600, name: '舒筋健腰丸' },
                    { value: 400, name: '咽炎片' }
                ].sort(function (a, b) { return a.value - b.value; }),
                roseType: 'radius',
                label: {
                    normal: {
                        textStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
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
            }
        ]
    };

    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

});