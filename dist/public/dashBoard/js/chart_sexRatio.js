$(function () {
    var dom = document.getElementById("sexRatio");
    var myChart = echarts.init(dom);

    var app = {};
  //  app.title = '男女患者占比';

    option = {
     
        title: {
            text: '男女患者占比',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: 'left',
            data:['男','女']
        },
        series: [
            {
                name:'药量',
                type:'pie',
                selectedMode: 'single',
                radius: [0, '30%'],
             
                label: {
                    normal: {
                        position: 'inner',
                        textStyle: {
                            color: '#ccc'
                        }
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:[
                    {value:335, name:'男', selected:true},
                    {value:679, name:'女'},
             
                ]
            },
            {
                name:'患者',
                type:'pie',
                radius: ['40%', '55%'],
                label: {
                    normal: {
                        formatter: ' {c} \n {per|{d}%}  ',
                        textStyle: {
                            color: '#ccc'
                        },
                        rich: {
                            
                        }
                    }
                },
                data:[
                    {value:200, name:'男'},
                    {value:106, name:'女'},
                   
                ]
            }
        ]
    };


    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }

});