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
          barcode: ""
        }
      },
      watch: {

      },
      methods: {
        async getInitData(pageNum) {
          const params = {
            pageNum: pageNum ? pageNum : 1,
            pageSize: 10,
            barcode: this.barcode
          }
          await axios.get(location.pathname + '/newdata', {
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
        async handleEdit() {
          const loadding = this.$loading({
            lock: true,
            text: '更新中...请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          await axios.get(location.pathname + '/handleData')
            .then((res) => {
              loadding.close()
              if (res.data.retCode == 200) {
                this.$message.success('更新成功')
              }
            })
            .catch((res) => {
              loadding.close()
              this.$message.error('网络连接错误')
            })
            
        },
        async dismountPost(barcode) {
          await axios.post(location.pathname + '/soldOut', {
              barcode: barcode
            })
            .then((res) => {
              if (res.data.retCode == 200) {
                this.getInitData()
              }
              this.$message.success(res.data.retMsg)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        currentPage: function (index) {
          this.getInitData(index)
        },
        handleDismount: function(row) {
          this.dismountPost(row.barcode)
        },
        search: function(){
          this.getInitData()
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