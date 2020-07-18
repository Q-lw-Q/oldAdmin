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

  },
  mounted: function () {

  }
})


var obj = {

  bindEvent: function () {
    let that = this

  },

  tdList: function (objs) {
    this.vueThat.tableListdata = objs.map(item => {
      return {
        name: item.name, //账号
        cashMoney: item.cashMoney, //现金收入
        sqbMoney: item.sqbMoney, //收钱吧收入
        refund: item.refund, //退款金额
        number: item.number, //总成交次数
        money: item.money, //总收入
        start: item.start, //时间
        end: item.end, //时间
      }
    })
  },

  vueThat: "",

  tableurl: location.pathname + '/data',


  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          formLabelWidth: '120px',
          tableListdata: that.vueThat.tableListdata || []
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