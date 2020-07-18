var obj = {

  bindEvent: function (){

  },

  tdList: function(obj) {
    let tpl = ""
    $.each(obj, function(i, item){
      tpl += `<tr>
          <td>`+item.replenishmentId+`</td>
          <td>`+item.goodsName+`</td>
          <td>`+item.quantity+`</td>
          <td>`+item.barcode+`</td>
          <td>`+item.date+`</td>
        </tr>`
    })
    return tpl
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

  tableurl: location.pathname + '/data',

  init: function () {
    this.initVue()
    let goodsData = {
      replenishmentId: vueObj.getQueryString('replenishmentId')
    }
    vueObj.initPage(goodsData)
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})