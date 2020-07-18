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
          const params = {
            pageNum: pageNum ? pageNum : 1,
            pageSize: 10,
            replenishmentNum: this.barcode
          }
          await axios.post(location.pathname + '/newdata', params)
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
        async handleZuofei(replenishmentNum) {
          await axios.post(location.pathname + '/replenishment', {
            replenishmentNum: replenishmentNum
          })
          .then((res) => {
            if (res.data.retCode == 200) {
              this.$message.success(res.data.retMsg)
              return
            }
            this.$message.success(res.data.retMsg)

          })
          .catch((res) => {
            loadding.close()
            this.$message.error('网络连接错误')
          })
        },
        zuofei: function(replenishmentNum) {
          this.$confirm('确定作废该订单?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(() => {
            this.handleZuofei(replenishmentNum)
          }).catch(() => {
            that.vueThat.$message({
              type: 'info',
              message: '已取消'
            });
          });
        },
        currentPage: function (index) {
          this.getInitData(index)
        },
        formStatus: function (val) {
          switch (+val.status) {
            case -1:
              return '作废'
            case 0:
              return '正在补货'
            case 1:
              return '补货完成等待扫描'
            case 2:
              return '扫描进行中'
            case 3:
              return '补货完成'
          }
        },
        formTime: function (val) {
          switch (+val.status) {
            case -1:
              return '补货未完成'
            case 0:
              return '补货未完成'
            case 1:
              return '补货未完成'
            case 2:
              return '补货未完成'
            case 3:
              return val.start + ' 至 ' + val.endl
          }
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