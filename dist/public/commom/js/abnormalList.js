
// 列表模板
Vue.component('tablelisttemplate', {
  template: '#listtemplate',
  props: {
    arraydata: {
      type: Array,
    }
  },
  data() {
    return {

    }
  },
  methods: {
    openMessage(id, money) {
      let that = this
      this.$confirm('你确定要执行退款操作,是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: '/admin/orderManagement/refund',
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
            } else {
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
    seeDetail(id, orderNum) {
      let that = this
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/admin/orderManagement/ordersDetails',
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
    processingFreeze(orderNum) {
      let that = this
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: location.pathname + '/freeze/data',
        data: {
          ordersNum: orderNum
        },
        success: function (res) {
          if (res.retCode == 200) {
            obj.vueThat.FreezeList = res.retEntity
            obj.vueThat.FreezeVisible = !obj.vueThat.FreezeVisible
          }
        },
        error: function (res) {
          that.$message({
            type: 'info',
            message: '请检查网络'
          });
        }
      })
    }
  },
  mounted: function () {

  }
})
var obj = {
  bindEvent: function () {
    // search 查询
    $('#query_filter_btn2').on('click', function () {
      vueObj.vueObjGetdata.ordersNum = $('#contextval').val()
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
      } else if (item.payType == 2) {
        item.sqbSn = '收银支付'
      } else if (item.payType == 3) {
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
      item.datatime = vueObj.dateFormat(item.createTime, "yyyy-MM-dd hh:mm")
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

  },
  tableurl: location.pathname + '/data',
  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          tableListdata: that.vueThat.tableListdata || [],
          dialogTableVisible: that.vueThat.dialogTableVisible,
          gridData: that.vueThat.gridData,
          FreezeVisible: false,
          FreezeList: [],
        }
      },
      methods: {
        relieveFnc: function () {
          let that = this
          that.openFullScreen()
          $.ajax({
            type: 'get',
            dataType: 'json',
            url: location.pathname + '/relievepush',
            success: function (res) {
              if (res.retCode == 200) {
                that.successMessage('解除成功')
              } else {
                that.warningMessage(res.retMsg)
              }
              that.closeloading()
            },
            error: function (res) {
              that.errMessage('请检查网络')
              that.closeloading()
            }
          })
        },
        editBoxCode: function (id,index) {
          this.$prompt('请输入确认后的剩余库存数量', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /^[0-9]*$/,
            inputErrorMessage: '格式不正确'
          }).then(({ value }) => {
            $.ajax({
              type: 'GET',
              dataType: 'json',
              url: location.pathname + '/freeze/unfreeze',
              data: {
                id: id,
                qyt: value
              },
              success: function (res) {
                if (res.retCode == 200) {
                  obj.vueThat.FreezeList[index].whether = true
                  obj.vueThat.$message({
                    type: 'success',
                    duration: '2000',
                    message: '修改成功'
                  })
                } else {
                  obj.vueThat.$message({
                    type: 'info',
                    message: res.msg
                  });
                }
              },
              error: function (res) {
                obj.vueThat.$message({
                  type: 'info',
                  message: '请检查网络'
                });
              }
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }
      },
      mounted: function () {

      },
    });
  },

  initTable: function () {
    let callback = function (res) {

    }
    vueObj.initPage()
  },

  init: function () {
    this.initTable()
    this.initVue()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})

