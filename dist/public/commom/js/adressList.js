
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
        url: '/checkstand/get/shopping/address',
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
  },
  mounted: function () {

  }
})

var obj = {

  bindEvent: function () {
    let that = this
    $('#export_inventoryList').on('click', function () {
      var form = document.createElement("form")
      form.setAttribute("id", 'getExportList')
      form.setAttribute("method", 'get')
      form.setAttribute("action", location.pathname + '/getExcel')
      document.body.appendChild(form)
      form.submit();
      $('#getExportList').remove()
    })
  },

  tdList: function (objs) {
    let tpl = ""
    this.vueThat.tableListdata = objs.map(item => {
      return {
        barcode: item.barcode, //商品 barcode
        name: item.name, //商品 名称
        length: item.length,
        width: item.width,
        height: item.height,
        qty: item.qty ? item.qty : 0,
        count: item.count ? item.count : 0
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
          dialogFormVisible: false,
          form: {
            boxCode: '',
            zAxis: '',
          },
          formLabelWidth: '120px',
          adressData: [],
          showAdressFalg: false
        }
      },
      methods: {
        openDeleteTrack: function () {
          this.dialogFormVisible = true
        },
        submitTrack: function(){
          let that = this
          if (this.form.boxCode && this.form.zAxis) {
            $.ajax({
              type: 'POST',
              dataType: 'json',
              url: location.pathname + '/delete',
              data: this.form,
              success: function (res) {
                if (res.retCode == 200) {
                  obj.vueThat.$message({
                    type: 'success',
                    duration: '2000',
                    message: res.retMsg
                  })
                } else {
                  obj.vueThat.$message({
                    type: 'info',
                    duration: '2000',
                    message: res.retMsg
                  })
                }
                that.dialogFormVisible = false
              },
              error: function (res) {
                obj.vueThat.$message({
                  type: 'info',
                  duration: '2000',
                  message: '请检查网络连接'
                })
                that.dialogFormVisible = false
              }
            })
          }
        }
      },
      mounted: function () {

      },
      watch: {

      }
    });
  },


  init: function () {
    let callback = function (res) {

    }
    vueObj.initPage('', callback)
    this.initVue()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})