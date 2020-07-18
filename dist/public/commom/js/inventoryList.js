
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
      userType: vueObj.getCookie('userType') || ''
    }
  },
  methods: {
    editLowerShopping: function (id, name) {
      let _that = this
      this.$confirm('你确定要下架' + name + ',是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: location.pathname + '/lowershopping',
          data: {
            barcode: id,
          },
          success: function (res) {
            if (res.retCode == 200) {
              _that.$message({
                type: 'success',
                message: '下架成功'
              });
            } else {
              _that.$message({
                type: 'info',
                message: res.retMsg
              });
            }
          },
          error: function (res) {
            _that.$message({
              type: 'info',
              message: '请检查网络'
            });
          }
        })
      }).catch(() => {

      })
    },
    editQuantity: function (id,item) {
      let _that = this
      this.$prompt('请输入库存', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[0-9]+$/,
        inputErrorMessage: '请输入数字'
      }).then(({ value }) => {
        $.ajax({
          type: 'POST',
          url: location.pathname + '/editQuantity',
          data: {
            barcode: id,
            num: value
          },
          success: function (res) {
            if (res.retCode == 200) {
              _that.$message({
                type: 'success',
                message: '修改成功'
              });
              item.quantity = value
            } else {
              _that.$message({
                type: 'info',
                message: res.retMsg
              });
            }
          },
          error: function (res) {
            _that.$message({
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
    },
  },
  mounted: function () {

  }
})

var obj = {

  bindEvent: function () {
    let that = this
    // search 查询
    $('#query_filter_btn2').on('click', function () {
      vueObj.vueObjGetdata = {}
      vueObj.vueObjGetdata.barcode = $('#contextval').val()
      console.log(vueObj.vueObjGetdata)
      vueObj.initPage()
    })

    $('#export_inventoryList').on('click', function(){
      var form = document.createElement("form")
      form.setAttribute("id",'getExportList')
      form.setAttribute("method", 'get')
      form.setAttribute("action", location.pathname + '/getExcel')
      document.body.appendChild(form)
      form.submit();
      $('#getExportList').remove()
    })

    $('#awayShoppingNum').on('click', function(){
      obj.vueThat.openFullScreen()
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: location.pathname + '/update/shoppingNum',
        success: function (res) {
          if (res.retCode == 200) {
            obj.vueThat.successMessage(res.retMsg)
            setTimeout(() => {
              $('.xl-active').click()
            }, 2000);
          } else {
            obj.vueThat.warningMessage(res.retMsg)
          }
          obj.vueThat.closeloading()
        },
        error: function (res) {
          obj.vueThat.errMessage('请检查网络')
          obj.vueThat.closeloading()

        }
      })
    })


    $('#checkShowprescriptions').on("click",function(){
      console.log(123)
      let key 
      if ($('#checkShowprescriptions:checked').length > 0){
        key = 0
      } else {
        key = 1
      }
      $.ajax({
        type: 'post',
        dataType: 'json',
        url: location.pathname + '/editPrescription',
        data: {
          key: key,
        },
        success: function (res) {
          if (res.retCode == 200) {
            that.vueThat.$message({
              type: 'success',
              message: '修改成功'
            });
          } else {
            that.vueThat.$message({
              type: 'info',
              message: res.retMsg
            });
          }
        },
        error: function (res) {
          that.vueThat.$message({
            type: 'info',
            message: '请检查网络'
          });
        }
      })
    })

  },

  tdList: function (objs) {
    let tpl = ""
    this.vueThat.tableListdata = objs.map(item => {
      return {
        barcode: item.barcode, //商品 barcode
        goodsName: item.goodsName, //商品 名称
        quantity: item.quantity, //商品 库存
        locklQuantity: item.locklQuantity
      }
    })
    return false
  },

  vueThat: "",

  tableurl: location.pathname + '/data',

  userType: "",

  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          tableListdata: that.vueThat.tableListdata || [],
        }
      },
      methods: {
        awayCode: function(){
          let _that = this
          obj.vueThat.openFullScreen()
          $.ajax({
            type: 'GET',
            url: location.pathname + '/triggerEs',
            success: function (res) {
              if (res.retCode == 200) {
                _that.$message({
                  type: 'success',
                  message: '同步成功'
                });
              } else {
                _that.$message({
                  type: 'info',
                  message: res.retMsg
                });
              }
              obj.vueThat.closeloading()

            },
            error: function (res) {
              _that.$message({
                type: 'info',
                message: '请检查网络'
              });
              obj.vueThat.closeloading()
            }
          })
        },
        getShoppingMessage: function(){
          let _that = this
          obj.vueThat.openFullScreen()
          $.ajax({
            type: 'GET',
            url: location.pathname + '/shopUpdate',
            success: function (res) {
              if (res.retCode == 200) {
                _that.$message({
                  type: 'success',
                  message: '同步成功'
                });
              } else {
                _that.$message({
                  type: 'info',
                  message: res.retMsg
                });
              }
              obj.vueThat.closeloading()

            },
            error: function (res) {
              _that.$message({
                type: 'info',
                message: '请检查网络'
              });
              obj.vueThat.closeloading()
            }
          })
        }
      },
      mounted: function () {

      },
      watch: {

      }
    });
  },


  init: function () {
    let callback = function(res) {
      switch (+res.prescriptionStatus) {
        case 0:
          $('#checkShowprescriptions')[0].checked = true
          break;
        case 1:
          $('#checkShowprescriptions')[0].checked = false          
          break;
      
        default:
          break;
      }
    }
    vueObj.initPage('',callback)
    this.initVue()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})