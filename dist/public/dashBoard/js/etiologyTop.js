$(function() {
    var dom = document.getElementById("etiologyTop");
	var myChart = echarts.init(dom);
	var app = {};
	 
    option = {
        backgroundColor: '#2c343c',
        
        title: {
            text: '病因',
            left: 'center',
            top: 20,
            textStyle: {
                color: '#ccc'
            }
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        color: ['#37a2da','#ffd85c'],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data : ['感冒', '发热', '失眠', '口干', '冷汗'],
                axisTick: {
                    alignWithLabel: true
                },
                axisLine:{
                    lineStyle:{
                        color: '#fff',
                         
                    }
                },
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLine:{
                    lineStyle:{
                        color: '#fff',
                         
                    }
                },
            }
        ],
        series : [
            {
                name:'直接访问',
                type:'bar',
                barWidth: '60%',
                data:[50, 30, 10, 5, 3],
                label: {
	                normal: {
	                    show: false,
	                    position: 'center'
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        fontSize: '12',
	                        color:'#fff',
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