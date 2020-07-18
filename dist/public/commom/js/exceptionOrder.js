
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
    ouputBoxcell(id, num) {
      let that = this
      this.$confirm('确认已经手动拿出该货物?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // that.vueThat.openFullScreen()
        $.ajax({
          type: 'get',
          dataType: 'json',
          url: location.pathname + '/updateBoxCell',
          data: {
            ordersNum: num,
            boxCellId: id
          },
          success: function (res) {
            if (res.retCode == 200) {
              vueObj.vueObjGetdata.ordersNum = num
              vueObj.initPage()
              obj.vueThat.successMessage('确认成功')
            } else {
              that.vueThat.warningMessage(res.retMsg)
            }
          },
          error: function (res) {
            that.vueThat.closeloading()
            that.vueThat.warningMessage('请检查网络连接!!!')
          }
        })
      }).catch(() => {
        obj.vueThat.successMessage('已取消')
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

    })
    this.vueThat.tableListdata = objs
    if (this.vueThat.tableListdata.length === 0) {
      obj.vueThat.successMessage('暂无数据')
    }
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
        }
      },
      methods: {

      },
      mounted: function () {

      },
    });
  },

  initTable: function () {

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

