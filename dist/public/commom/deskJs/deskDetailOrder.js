var obj = {

  bindEvent: function () {
    // search 查询
    $('#query_filter_btn2').on('click', function () {
      // vueObj.vueObjGetdata.barcode = $('#contextval').val()
      // vueObj.initPage()
      // timer = true
    })
  },

  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          tableData: [],
          total: 0,
          barcode: ""
        }
      },
      watch: {

      },
      methods: {
        async getInitData(pageNum) {
          const replenishmentId = this.GetRequest().replenishmentId
          const params = {
            pageNum: pageNum ? pageNum : 1,
            pageSize: 10,
            replenishmentId: replenishmentId
          }
          await axios.get(location.pathname + '/data', {
            params: params
          })
            .then((res) => {
              if (res.data.retCode == 200) {
                console.log(this.total)
                this.total = res.data.retEntity.count
                this.tableData = res.data.retEntity.data
              }
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },

        currentPage: function (index) {
          this.getInitData(index)
        },
        GetRequest: function() {  
          var url = location.search; //获取url中"?"符后的字串
          var theRequest = new Object();  
          if (url.indexOf("?") != -1) {  
             var str = url.substr(1);  
             strs = str.split("&");  
             for(var i = 0; i < strs.length; i ++) {  
                theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);  
             }  
          }  
          return theRequest;  
       }  
      },
      mounted: function () {

        this.getInitData()
      },
    });
  },


  init: function () {
    this.bindEvent()
    this.initVue()
  }
}

$(function () {
  obj.init()
})