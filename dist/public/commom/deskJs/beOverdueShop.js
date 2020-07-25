var obj = {

  bindEvent: function () {
    console.log(123)
    // search 查询
    console.log($('.positionicontype'))
    $('#query_filter_btn2').on('click', function () {
      console.log(123)
      console.log(that.vueThat.getInitData)
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
          barcode: "",
          shopStatus: 1,
          optionsStatus: [{value: 1,label: "已过期"},{value: 2,label: "临期"}]
        }
      },
      watch: {

      },
      methods: {
        async getInitData(pageNum) {
          const params = {
            pageIndex: pageNum ? pageNum : 1,
            pageSize: 10,
          }
          let url
          if (+this.shopStatus === 1) {
            url = location.pathname + '/newdata'
          }
          if (+this.shopStatus === 2) {
            url = location.pathname + '/newdata2'
          }
          await axios.get(url, {
              params: params
            })
            .then((res) => {
              if (res.data.retCode == 200) {
                console.log(this.total)
                this.total = res.data.retEntity.totalCount
                this.tableData = res.data.retEntity.content
              }
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        async handleEdit(url) {
          const loadding = this.$loading({
            lock: true,
            text: '出货中...请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          await axios.get(location.pathname + '/' + url)
            .then((res) => {
              loadding.close()
              if (res.data.retCode == 200) {
                this.getInitData()
              }
              this.$message.success(res.data.retMsg)
            })
            .catch((res) => {
              loadding.close()
              this.$message.error('网络连接错误')
            })
            
        },
        async dismountPost(id) {
          const loadding = this.$loading({
            lock: true,
            text: '出货中...请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let url
          if (this.shopStatus === 1) {
            url = "handleOneData"
          }
          if (this.shopStatus === 2) {
            url = "handleOneData1"
          }
          await axios.get(location.pathname + '/'+url+'?id='+id)
            .then((res) => {
              if (res.data.retCode == 200) {
                this.getInitData()
              }
              this.$message.success(res.data.retMsg)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
            loadding.close()
        },
        currentPage: function (index) {
          this.getInitData(index)
        },
        handleDismount: function(row) {
          this.dismountPost(row.id)
        },
        search: function(){
          this.getInitData()
        },
        changeData: function(){
          this.getInitData(1)
        },
        formTimer: function(row, column, cellValue, index){
          return vueObj.dateFormat(cellValue,"yyyy-MM-dd hh:mm")
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