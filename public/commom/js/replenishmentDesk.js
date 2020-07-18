var obj = {
  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          tableData: [],
          input: '',
          nowDeskFlag: false,
          deskStr: "开始补货",
          postForm: {
            barcode: '',
            batchNumber: '',
            expiryDate: '',
            sourceCode: ''
          },
          joinTable: []
        }
      },
      watch: {
        nowDeskFlag: function(){
          this.deskStr = this.nowDeskFlag ? "停止补货" : "开始补货"
        }
      },
      methods: {
        async startDesk() {
          // 判断是补货 还是 停止
          // 开始
          if (!this.nowDeskFlag) {
            await axios.post(location.pathname + '/start/desk')
              .then((res) => {
                if (res.data.retCode == 200) {
                  this.nowDeskFlag = true
                  this.$message.success('开始补货，请填写条形码。')
                  this.soketLink()
                  this.setCookie('start',1)
                  return
                }
                this.$message.error(res.data.retMsg)
              })
              .catch((res) => {
                this.$message.error('网络连接错误')
              })

            return
          }

          // 停止
          await axios.post(location.pathname + '/stop/desk')
            .then((res) => {
              if (res.data.retCode == 200) {
                this.$message.success('停止成功')
                this.nowDeskFlag = false
                this.setCookie('start',0)
                return
              }
              this.$message.error(res.data.retMsg)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        async quesionDesk() {
          if (this.nowDeskFlag) {
            if (this.postForm.barcode) {
              await axios.post(location.pathname + '/post/desk', this.postForm)
                .then((res) => {
                  if (res.data.retCode == 200) {
                    this.$message.success('确认补货！请等待。。。')
                    return
                  }
                  this.$message.error(res.data.retMsg)                  
                })
                .catch((res) => {
                  this.$message.error('网络连接错误')
                })
              return
            }
            this.$message.error('请填写条形码')
            return
          }
          this.$message.error('请先开始补货模式')
        },
        soketLink: function(){
          const that = this
          var ws = new WebSocket("ws://"+javaBasicUrl+"/websocket/WebSocketServer");
          ws.onopen = function () {
            // Web Socket 已连接上，使用 send() 方法发送数据
            // ws.send("发送数据");
            // alert("数据发送中...");
          };

          ws.onmessage = function (evt) {
            var received_msg = evt.data;
            // alert("数据已接收...");
            console.log(123)
            that.joinTable.push(JSON.parse(evt.data).body.retEntity)
          };

          ws.onclose = function () {
            // 关闭 websocket
            alert("连接已关闭...");
          };
        },
        onSubmit: function () {
          if (!this.nowDeskFlag) {
            this.$message.error('请先开始补货模式')            
            return
          }
          if (!this.postForm.barcode) {
            return
          }
          // 补货
          axios.post(location.pathname + '/get/desk', {
            "barcode": this.postForm.barcode
          })
            .then((res) => {
              this.tableData = res.data.retEntity
              console.log(this.tableData)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        inputFocus: function(e) {
          this.$refs.customerInput.$el.querySelector('input').focus();
        },
        focusCanl: function(e){
          e.stopPropagation();
          console.log(123)
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
        setCookie: function(c_name, value, expiredays) {                   
          var exdate = new Date();                   
          exdate.setDate(exdate.getDate());                   
          document.cookie = c_name + "=" + escape(value);
        },
      },
      mounted: function () {
        // 已经开始补货模式
        if (+this.getCookie('start') === 1) {
          this.soketLink()
          this.nowDeskFlag = true
        }
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