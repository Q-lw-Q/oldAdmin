
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
    getShopPosition: function(barcode) {
      let that = this
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: location.pathname + '/cellLocation',
        data: {
          barcode: barcode,
        },
        success: function (res) {
          if (res.retEntity && res.retEntity.content) {
            obj.vueThat.adressData = res.retEntity.content
          }
          obj.vueThat.showAdressFalg = true
        },
        error: function (res) {
          console.log(res)
        }
      })
    },
    setSolve: function(id){
      let _that = this
      this.$confirm('你确定要已经处理完成?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: location.pathname + '/isSolve',
          data: {
            id: id,
          },
          success: function (res) {
            if (res.retCode == 200) {
              _that.$message({
                type: 'success',
                message: '处理成功'
              });
              vueObj.initPage()
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
    }
  },
  mounted: function () {

  }
})

var obj = {

  bindEvent: function () {
    let that = this
    // search 查询
    // $('#query_filter_btn2').on('click', function () {
    //   vueObj.vueObjGetdata = {}
    //   vueObj.vueObjGetdata.barcode = $('#contextval').val()
    //   console.log(vueObj.vueObjGetdata)
    //   vueObj.initPage()
    // })

    $('#getShopTo').on('click', function(){
      obj.vueThat.openFullScreen()
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: location.pathname + '/inventoryDetection',
        success: function (res) {
          if (res.retCode == 200) {
            obj.vueThat.successMessage(res.retMsg)
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


  },

  tdList: function (objs) {
    let tpl = ""
    this.vueThat.tableListdata = objs.map(item => {
      return {
        barcode: item.barcode, //商品 barcode
        goodsName: item.goodsName ? item.goodsName : '-', //商品 名称
        remark: item.remark, //商品 库存
        createdTime: vueObj.dateFormat(item.createdTime,"yyyy-MM-dd hh:mm"),
        solveStr: item.solve == true ? '已处理' : '未处理',
        solve: item.solve,
        id: item.id,

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
          adressData: [],
          showAdressFalg: false
        }
      },
      methods: {

      },
      mounted: function () {

      },
      watch: {

      }
    });
  },

  init: function () {
    vueObj.initPage()
    this.initVue()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})