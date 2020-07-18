$(function() {
    var dom = document.getElementById("container2");
    var myChart = echarts.init(dom);
    var app = {};
    option = null;
    option = {
        
        legend: {
            x : 'center',
            y : 'bottom',
            itemWidth: 7,
            itemHeight: 7,
            textStyle:{//图例文字的样式
                color:'#fff',
                fontSize:12
            },

        },
        calculable : true,
        series : [
            {
                name:'面积模式',
                type:'pie',
                radius : [30, 100],
                center : ['50%', '45%'],
                roseType : 'area',
                data:[
                    {value:vm.online.v1, name:'感冒药',itemStyle:{normal:{color:'#ff7800'}}},
                    {value:vm.online.v2, name:'止咳化痰药',itemStyle:{normal:{color:'#23eb6a'}}},
                    {value:vm.online.v3, name:'维生素',itemStyle:{normal:{color:'#7627cb'}}},
                    {value:vm.online.v4, name:'妇科药',itemStyle:{normal:{color:'#fffc00'}}},
                    {value:vm.online.v5, name:'保健品',itemStyle:{normal:{color:'#46afdb'}}}
                 
                ]
            }
        ]
    };
    ;
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
});