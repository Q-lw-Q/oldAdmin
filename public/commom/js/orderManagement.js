
// 列表模板
Vue.component('tablelisttemplate', {
  template: '#listtemplate',
  props: {
    arraydata: {
      type: Array,
    }
  },
  data () {
    return{

    }
  },
  methods: {
    openMessage(id,money) {
      let that = this
      this.$confirm('你确定要执行退款操作,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: location.pathname + '/refund',
          data: {
            ordersId: id,
            refundMoney: money,
          },
          success: function (res) {
            if (res.retCode == 200) {
              that.$message({
                type: 'success',
                message: '退款成功!'
              });
              setTimeout(() => {
                // window.location.reload()
                $('#page .xl-active').click()
              }, 2000);
            }else {
              that.$message({
                type: 'info',
                message: res.retMsg
              });  
            }
          },
          error: function (res) {
            that.$message({
              type: 'info',
              message: '请检查网络'
            });  
          }
        })

      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退款'
        });          
      });
    },
    seeDetail(id, orderNum){
      let that = this
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: location.pathname + '/ordersDetails',
        data: {
          ordersId: id,
          ordersNum: orderNum
        },
        success: function (res) {
          if (res.retCode == 200) {
            let array = []
            $.each(res.retEntity, function (i, item) {
              array.push({
                name: item.goodsName,
                money: item.price / 100,
                num: item.quantity,
                barcode: item.barcode,
                outQuantity: item.outQuantity || 0,
                allmoney: item.amount / 100
              })
            })
            obj.vueThat.gridData = array
          }
        },
        error: function (res) {
          that.$message({
            type: 'info',
            message: '请检查网络'
          });  
        }
      })
      obj.vueThat.dialogTableVisible = !obj.vueThat.dialogTableVisible
    },
    openshipment(num, type){
        let that = this
        console.log(obj.vueThat)
        this.$confirm('确认出货?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            // type: 'warning'
        }).then(() => {
            obj.vueThat.openFullScreen()
            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: location.pathname + '/orderShipment',
                data: {
                    ordersNum: num
                },
                success: function (res) {
                    obj.vueThat.closeloading()
                    if (res.retCode == 200) {
                        obj.vueThat.successMessage('出货完成')
                        if (type == 3) {
                          window.open(location.protocol + '/' + '/' + location.host + '/print?ordersNum=' + num)
                        }
                        setTimeout(function () {
                            window.location.reload()
                        }, 2000)
                    } else {
                        obj.vueThat.warningMessage(JSON.parse(res.retMsg).retMsg)
                    }
                },
                error: function (res) {
                    obj.vueThat.closeloading()
                    that.$message({
                        type: 'info',
                        message: '请检查网络'
                    });
                }
            })
        }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消出货'
            });
        });
    }
  },
  mounted: function () {

  }
})
var obj = {


  bindEvent: function () {
     // search 查询
     $('#query_filter_btn2').on('click', function () {
      vueObj.vueObjGetdata.ordernum = $('#contextval').val()
      vueObj.initPage()
    })
  },

  vueThat: "",

  tdList: function (objs) {
    let tpl = ""
    $.each(objs, function (i, item) {
      // 判断支付状态
      if (item.pay == 1) {
        if (item.payStatus == "REFUNDED") {
          item.payStatushtml = '退款成功'
        } else if (item.payStatus == "PAID") {
          item.payStatushtml = '支付成功'
        }
      } else {
        item.payStatushtml = '未支付'
      }
      // 支付凭证
      if (item.payType == 1) {
        item.sqbSn = '现金支付'
      } else if(item.payType == 2){
        item.sqbSn = '收银支付'
      } else if(item.payType == 3){
        item.sqbSn = '自助支付'
      }
      // 订单备注
      if (!item.remark) {
        item.remark = '暂无备注'
      }
      // 支付方式
      if (item.payType == 1) {
        item.paymoneytype = "现金"
      } else {
        switch (item.payway) {
          case "1":
            item.paymoneytype = "支付宝"
            break;
          case "3":
            item.paymoneytype = "微信"
            break;
          case "4":
            item.paymoneytype = "百度钱包"
            break;
          case "5":
            item.paymoneytype = "京东钱包"
            break;
          case "6":
            item.paymoneytype = "qq钱包"
            break;
          default:
            if (!item.payStatus) {
              item.paymoneytype = "未支付"
            } else {
              item.paymoneytype = "其他方式"
            }
            break;
        }
      }
      //   tpl += `<tr>
      //       <td>`+item.storeName+`</td>
      //       <td>`+item.ordersNum+`</td>
      //       <td>`+item.sqbSn+`</td>
      //       <td>`+item.is_pay+`</td>
      //       <td>`+item.totalAmount / 100+`</td>
      //       <td>`+item.paymoneytype+`</td>
      //       <td>`+item.remark+`</td>
      //       <td>`+item.datatime+`</td>
      //       <td class="button_box">
      //         <a class="fl refundmoney" href="javascript: void(0);">发起退款</a>
      //         <a class="fl seedetails" href="javascript: void(0);">查看详情</a>
      //       </td>
      //     </tr>`
    })
    this.vueThat.tableListdata = objs
    return false
  },

  data: {
    orderType: 0,
    starttime: '',
    endtime:   '',
    type: 0
  },
  
  tableurl: location.pathname + '/data',

  tableListdata: {
    dialogTableVisible: false,
    gridData: []
  },

  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          tableListdata: that.vueThat.tableListdata || [],
          dialogTableVisible: that.vueThat.dialogTableVisible,
          gridData: that.vueThat.gridData,
          timer: [new Date(vueObj.nowTimer() + ' 00:00:00'), new Date(vueObj.nowTimer() + ' 23:59:59')],
          //   endtime: new Date('2010-10-13 00:00:00'),
          // },
          pickerOptions: {
            onPick: ({maxDate, minDate}) => {
              console.log(this.timer)
            }
          },
          selectType: [{
            value: '4',
            label: '异常订单'
          },{
            value: '1',
            label: '待出货订单'
          }, {
            value: '5',
            label: '未付款订单'
          }, {
            value: '0',
            label: '全部订单'
          }],
          selectPay: [{
            value: '2',
            label: '收银台'
          },{
            value: '5',
            label: '安卓外屏'
          }, {
            value: '4',
            label: '安卓内屏'
          }, {
            value: '0',
            label: '全部'
          }],
          selectTypeValue: '全部订单',
          selectPayValue: '全部',
          CashierReconciliation: false,
          CashData: []
        }
      },
      methods: {
        changeSelect: function(val){
          if (that.data.orderType !== val) {
            that.data.orderType = val
            that.initTable()
          }
        },
        changePaySelect: function(val){
          if (that.data.type !== val) {
            that.data.type = val
            that.initTable()
          }
        },
        pickerNumber: function() {
          console.log(this.timer)
          if (!this.timer) {
            that.data.starttime = ''
            that.data.endtime = ''
          } else if (this.timer[0] && this.timer[1]) {
            that.data.starttime = this.timer[0]
            that.data.endtime = this.timer[1]
          }
          that.initTable()
        },
        async CashierShow() {
          await axios.post(location.pathname + '/getcashie', {
            starttime: that.data.starttime,
            endtime: that.data.endtime
          })
            .then((res) => {
              if (res.data.retCode == 200){
                this.CashData = res.data.retEntity
                this.CashData.map(item => {
                  let list = "<span>成交笔数：" + item.total + "</span>"
                  list += "<span>营收：" + (item.money ? item.money : "0") + "</span>"
                  item.right = list
                  return item
                })
                this.CashierReconciliation = true;
                return
              }
              this.$message.error(res.data.retCode)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        async CashierAction() {
          await axios.post(location.pathname + '/dayin', {
            starttime: that.data.starttime,
            endtime: that.data.endtime
          })
            .then((res) => {
              if (res.data.retCode == 200){
                this.$message.success("打印成功")
                this.CashierReconciliation = false;
                return
              }
              this.$message.error(res.data.retCode)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        }
      },
      mounted: function () {
        
      },
      watch: {
        tableListdata: function () {

        },
      }
    });
  },

  initTable: function(){
    let callback = function (res){
      $('#allmoney').html(res.retEntity.countAmount / 100 +'元')
    }
    vueObj.initPage(this.data, callback)
  },

  init: function () {
    this.data.starttime = vueObj.nowTimer() + ' 00:00:00',
    this.data.endtime = vueObj.nowTimer() + ' 23:59:59'
    this.initTable()
    this.initVue()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})

