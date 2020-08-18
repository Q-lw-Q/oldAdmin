var obj = {
  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          tableData: [],
          allSum: 0,
          allType: 0,
          errSum: 0,
          errType: 0,
          startStatus: false,
          // statusTest: "开始盘库",
          selectTableData: [],
          loadding: '',
        }
      },
      watch: {
        startStatus: function () {
          // this.startStatus ? this.statusTest = "停止盘库" : this.statusTest = "开始盘库"
        },
        tableData: function () {
          let errSum = 0
          let alltype = 0
          let errType = 0
          let NumberOfErrors = 0

          this.tableData.map(item => {
            errSum += +item.sum
            NumberOfErrors += Math.abs(+item.oldSum - +item.sum)
            alltype = alltype + 1
            if (+item.oldSum !== +item.sum) {
              errType = errType + 1
            }
          })
          this.errSum = NumberOfErrors
          this.allSum = errSum
          this.allType = alltype
          this.errType = errType
        }
      },
      methods: {
        soketLink: function () {
          const that = this
          var ws = new WebSocket("ws://" + javaBasicUrl + "/websocket/WebSocketServer");
          ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            // ws.send("发送数据");
            // alert("数据发送中...");
          };

          ws.onmessage = function (evt) {
            var received_msg = evt.data;
            // alert("数据已接收...");
            console.log(evt.data)
            let data = JSON.parse(evt.data)
            if (data.status === "endInventory") {
              that.loadding.close()
              // 结束
              that.startStatus = false
              that.$message.success('盘库结束')
              return
            }
            that.tableData.unshift(JSON.parse(evt.data))
          };

          ws.onclose = function () {
            // 关闭 websocket
            alert("连接已关闭...");
          };
        },
        getCookie: (name) => {
          var strcookie = document.cookie; //获取cookie字符串
          var arrcookie = strcookie.split("; "); //分割
          //遍历匹配
          for (var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name) {
              return arr[1];
            }
          }
          return "";
        },
        setCookie: function (c_name, value, expiredays) {
          var exdate = new Date();
          exdate.setDate(exdate.getDate());
          document.cookie = c_name + "=" + escape(value);
        },
        async startStock() {
          // 开始盘库
          // if (!this.startStatus) {
            this.tableData = []
            await axios.get(location.pathname + '/postStock')
              .then((res) => {
                if (res.data.retCode == 200) {
                  // this.loadding = this.$loading({
                  //   lock: true,
                  //   text: '盘库中...请稍后',
                  //   spinner: 'el-icon-loading',
                  //   background: 'rgba(0, 0, 0, 0.7)'
                  // });
                  this.startStatus = true
                  this.$message.success('开始盘库')
                  this.soketLink()
                  return
                }
                this.$message.error(res.data.retMsg)
              })
              .catch((res) => {
                this.$message.error('网络连接错误')
              })
          // }
          // 停止盘库
        },
        async stopStock() {
          // 开始盘库
          // if (!this.startStatus) {
            // this.tableData = []
            await axios.get(location.pathname + '/stopStock')
              .then((res) => {
                if (res.data.retCode == 200) {
                  this.loadding = this.$loading({
                    lock: true,
                    text: '停止中...请稍后',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                  });
                  this.$message.success('停止成功')
                  // this.soketLink()
                  return
                }
                this.$message.error(res.data.retMsg)
              })
              .catch((res) => {
                this.$message.error('网络连接错误')
              })
          // }
          // 停止盘库
        },
        async postEdit(barcode) {
          let barcodes = {
            "barcodes": barcode + ","
          }
          // 开始盘库
          await axios.post(location.pathname + '/post/check', barcodes)
            .then((res) => {
              this.loadding.close();
              if (res.data.retCode == 200) {
                this.$message.success('修正成功')
                return
              }
              this.$message.error(res.data.retMsg)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        toggleSelection: function (rows) {
          let data = this.selectTableData
          let barcode = []
          this.loadding = this.$loading({
            lock: true,
            text: '修正中...请稍后',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          data.forEach((item, key) => {
            barcode.push(item.barcode)
          })

          this.postEdit(barcode.join(','))
        },
        changeFun: function (rows) {
          this.selectTableData = rows
        }
      },
      mounted: function () {
        // 已经开始补货模式
        // this.soketLink()
      },
    });
  },


  init: function () {
    this.initVue()
  }
}

$(function () {
  obj.init()
})