$(function () {
    var dom = document.getElementById("ageRatio");
    var myChart = echarts.init(dom);

    var app = {};

    option = {
        title: {
            text: '患者年龄层比例',
            x: 'center',
            top: 20,
            left: 'center',
            textStyle: {
                color: '#ccc'
            }
        },
       // backgroundColor: '#2c343c',


        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['12-18', '19-25', '26-30', '31-40', '36-45'],
            textStyle: {
                color: '#ccc'
            }
        },
        series: [
            {
                name: '年龄段',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    { value: 335, name: '12-18' },
                    { value: 310, name: '19-25' },
                    { value: 234, name: '26-30' },
                    { value: 135, name: '31-40' },
                    { value: 1548, name: '36-45' }
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };



    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

});