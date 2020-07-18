var obj = {

  vueThat: "",

  bindEvent: function () {
    let that = this
    $('#selectDate').on('click', 'li', function (){
      $(this).addClass('active').siblings().removeClass('active')
      that.initPageTop($(this).data('type'))
    })

    $('#selectDateg').on('click', 'li', function (){
      $(this).addClass('active').siblings().removeClass('active')
      that.getAllmoney($(this).data('type'), function(data){
        that.initFalt1(data)
      })
    })

    $('#selectsuccess').on('click', 'li', function (){
      $(this).addClass('active').siblings().removeClass('active')
      that.getAllmoney($(this).data('type'), function(data){
        that.initFalt2(data)
      })
    })

    $('#selectDatef').on('click', 'li', function (){
      $(this).addClass('active').siblings().removeClass('active')
      that.getAllbingzhuangtu($(this).data('type'))
    })

    $('#selectDateC4').on('click', 'li', function (){
      $(this).addClass('active').siblings().removeClass('active')
      that.getAllrefund($(this).data('type'),function(data){
        that.initFalt3(data)
      })
    })

  },

  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {

        }
      },
      methods: {

      },
      mounted: function () {

      },
      watch: {
        tableListdata: function () {

        }
      }
    });
  },

  initPageTop: function (data){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: location.pathname + '/data/detail',
      data: {
        type: data
      },
      success: function (res) {
        if (res.retEntity) {
          $('#allMoney').html(res.retEntity.moneyCount / 100)
          $('#presentMoney').html(res.retEntity.cashCount / 100)
          $('#shouMoney').html(res.retEntity.sqbCount / 100)
          $('#expense_other').html(res.retEntity.count)
          $('#expense_member').html(res.retEntity.refundCount / 100)
        }

      },
      error: function (res) {

      }
    })
  },

  //总收入
  initecharts: function (data){
    let myChart = echarts.init(data.node)
    let option = {
      xAxis: {
        type: 'category',
        data: data.time,
      },
      yAxis: {
        type: 'value',
      },
      tooltip : {
        trigger: 'axis',
      },
      series: [{
        data: data.num,
        type: 'line',
        color: data.color,
        lineStyle: {
          color: data.color,
        }
      }]
    }

    myChart.setOption(option,true)
  },

  //返回对应图标配置
  returnOption: function(data){
    switch (+data.type) {
      case 1:
        data.color = '#FA4A65'
        data.node =  $('#recentSevenDaySalesData')[0]
        break;
      case 2:
        data.color = '#FFB00b'
        data.node =  $('#menberAnalysi')[0]
        break;
      case 3:
        data.color = '#8947EB'
        data.node =  $('#expenditureAnalysis')[0]
        break;
      default:

        break;
    }
    this.initecharts(data)
  },

  //支付方式
  initecharts2: function (data){
    let myChart = echarts.init($('#payType')[0])
    myChart.setOption({
      // title : {
      //   text: '某站点用户访问来源',
      //   subtext: '纯属虚构',
      //   x:'center'
      // },
      tooltip : {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: ['现金收入','收钱吧收入','收银收入']
      },
      series : [
        {
          name: '支付方式',
          type: 'pie',
          radius : '50%',
          center: ['50%', '50%'],
          data: data,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            normal:{
              color:function(params) {
                //自定义颜色
                var colorList = [
                  '#31C17B', '#4788EC','#B22222'
                ];
                return colorList[params.dataIndex]
              }
            }
          }
        }
      ]
    },true)
  },

  getAllbingzhuangtu: function (type) {
    let time = type || 1
    let that = this
    new Promise(function (resolve, reject){
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: location.pathname + '/data/payment',
        data: {
          day: time
        },
        success: function (res) {
          let data = [
            {value:res.retEntity.xj, name:'现金收入'},
            {value:res.retEntity.sqb, name:'收钱吧收入'},
            {value:res.retEntity.zd, name:'收银收入'}
          ]
          resolve(data)
        },
        error: function (res) {
          reject(res.retMsg)
        }
      })

    }).then(function(data) {
      that.initecharts2(data)
    })
  },

  getAllmoney: function(time,callback) {
    let that = this
    new Promise(function (resolve, reject){
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: location.pathname + '/data/allmoney',
        data: {
          day: time
        },
        success: function (res) {
          let data = {
            num: [],
            time: [],
            count: []
          }
          $.each(res.retEntity, function(i, item){
            data.num.push(item.sum / 100)
            data.time.push(item.time.slice(0,10))
            data.count.push(item.count)
          })
          data.num.reverse()
          data.time.reverse()
          data.count.reverse()
          resolve(data)
        },
        error: function (res) {
          reject(res.msg)
        }
      })

    }).then(function(data) {
      callback(data)
    })

  },

  getAllrefund: function(time,callback) {
    let that = this
    new Promise(function (resolve, reject){
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: location.pathname + '/data/refund',
        data: {
          day: time
        },
        success: function (res) {
          let data = {
            num: [],
            time: [],
          }
          $.each(res.retEntity, function(i, item){
            data.num.push(item.sum / 100)
            data.time.push(item.time.slice(0,10))
          })
          data.num.reverse()
          data.time.reverse()
          resolve(data)
        },
        error: function (res) {
          reject(res.msg)
        }
      })
    }).then(function(data) {
      callback(data)
    })

  },


  initoneDay: function (){
    let data = {
      num: [820, 932, 901, 934, 1290, 1330, 1320],
      time: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      type: ''
    }
    let that = this
    
    that.getAllmoney(30, function(data){
      that.initFalt1(data)
      that.initFalt2(data)
    })

    that.getAllrefund(30, function(data) {
      that.initFalt3(data)
    })

    
  },

  initFalt1: function(data){
    this.returnOption({
      num: data.num,
      time: data.time,
      type: 1
    })
  },

  initFalt2: function(data){
    this.returnOption({
      num: data.count,
      time: data.time,
      type: 2
    })
  },

  initFalt3: function(data){
    this.returnOption({
      num: data.num,
      time: data.time,
      type: 3
    })
  },

  init: function () {
    this.initVue()
    this.initPageTop(1)
    this.bindEvent()
    this.getAllbingzhuangtu(30)
    this.initoneDay()
  }
}

$(function () {
  obj.init()
})

