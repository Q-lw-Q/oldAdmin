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
          falgQuesion: true,
          joinTable: [],
          lineupTable: [],
          submitTimer: "",
          getLineTableTimer: "",
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
                if (res.data.retCode == 901) {
                  this.nowDeskFlag = true
                  this.soketLink()
                  this.setCookie('start',1)
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
              this.nowDeskFlag = false
              this.setCookie('start',0)
              this.$message.error(res.data.retMsg)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        async getLineTable() {
          await axios.post(location.pathname + '/disc/linaGood', this.postForm)
          .then((res) => {
            if (res.data.retCode == 200) {
              this.lineupTable = res.data.retEntity;
              return
            }
          })
          .catch((res) => {
            this.$message.error('网络连接错误')
          })
        },
        async quesionDesk() {
          try {
            if (this.nowDeskFlag && this.falgQuesion) {
              this.falgQuesion = false;
              if (this.postForm.barcode) {
                await axios.post(location.pathname + '/post/desk', this.postForm)
                  .then((res) => {
                    setTimeout(() => {
                      this.falgQuesion = true;
                    }, 2000);
                    if (res.data.retCode == 200) {
                      this.$message.success('确认补货！请等待。。。')
                      this.getLineTable()
                      return
                    }
                    this.$message.error(res.data.retMsg)                  
                  })
                  .catch((res) => {
                    this.$message.error('网络连接错误')
                  })
                this.falgQuesion = true;
                return
              }
              this.falgQuesion = true;
              this.$message.error('请填写条形码')
              return
            }

            this.$message.error('请先开始补货模式')
            
          } catch (error) {
            this.falgQuesion = true;
          }
          
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
            that.joinTable.unshift(JSON.parse(evt.data).body.retEntity)
          };

          ws.onclose = function () {
            // 关闭 websocket
            alert("连接已关闭...");
          };
        },
        onSubmit: function () {
          clearTimeout(this.submitTimer)
          this.submitTimer = setTimeout(() => {
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
                if (res.data.retCode == 200) {
                  const data = res.data.retEntity.commodity ? res.data.retEntity.commodity[0] : res.data.retEntity[0];
                  if (!data) {
                    this.$message.error('商品不存在!!!请录入商品后在进行补货...')
                    return
                  }
                  if (!data.length || !data.width || !data.height) {
                    this.$message.error('商品长宽高信息未录入完全,请补全信息后再进行补货..')
                    return;
                  }

                  if (res.data.retEntity.trace) {
                    // 判断溯源码通道
                    this.postForm = { 
                      ...res.data.retEntity.trace,
                      // res.data.retEntity.trace
                      expiryDate: this.filtTimer(res.data.retEntity.trace.expiryDate)
                    }
                  } else {
                    this.postForm = {
                      barcode: this.postForm.barcode,
                      batchNumber: '',
                      expiryDate: '',
                      sourceCode: ''
                    }
                  }
                    
                  data.length = +data.length / 10
                  data.width = +data.width / 10
                  data.height = +data.height / 10
                  
                  const resultArr = [];
                  resultArr.push(data);
                  this.tableData = resultArr
                  this.inputFocus2()
                  return
                }
                this.$message.error(res.data.retMsg)
              })
              .catch((res) => {
                console.log(res)
                this.$message.error('网络连接错误')
              })
          }, 1000);
        },
        onSubmitsourceCode: function () {
          clearTimeout(this.submitTimer)
          this.submitTimer = setTimeout(() => {
            if (!this.nowDeskFlag) {
              this.$message.error('请先开始补货模式')            
              return
            }
            if (!this.postForm.barcode || !this.postForm.sourceCode) {
              return
            }
            // 补货
            axios.post(location.pathname + '/get/sourceCode', {
              "sourceCode": this.postForm.sourceCode
            })
              .then((res) => {
                if (res.data.retCode == 200) {
                  // const data = res.data.retEntity.commodity;
                  // if (!data) {
                  //   this.$message.error('商品不存在!!!请录入商品后在进行补货...')
                  //   return
                  // }
                  // if (!data.length || !data.width || !data.height) {
                  //   this.$message.error('商品长宽高信息未录入完全,请补全信息后再进行补货..')
                  //   return;
                  // }

                  // if (res.data.retEntity.trace) {
                  //   // 判断溯源码通道
                  //   this.postForm = { 
                  //     ...res.data.retEntity.trace,
                  //     // res.data.retEntity.trace
                  //     expiryDate: this.filtTimer(res.data.retEntity.trace.expiryDate)
                  //   }
                  // } else {
                  //   this.postForm = {
                  //     barcode: this.postForm.barcode,
                  //     batchNumber: '',
                  //     expiryDate: '',
                  //     sourceCode: ''
                  //   }
                  // }
                    
                  // data.length = +data.length / 10
                  // data.width = +data.width / 10
                  // data.height = +data.height / 10
                  
                  // const resultArr = [];
                  // resultArr.push(data);
                  // this.tableData = resultArr
                  // batchNumber
                  // expiryDate
                  this.postForm = {
                    ...this.postForm,
                    batchNumber: res.data.retEntity.trace.batchNumber,
                    expiryDate: this.filtTimer(res.data.retEntity.trace.expiryDate)
                  }
                  this.inputFocus()
                  return
                }
                this.$message.error(res.data.retMsg)
              })
              .catch((res) => {
                console.log(res)
                this.$message.error('网络连接错误')
              })
          }, 1000);
        },
        inputFocus: function(e) {
          this.$refs.customerInput.$el.querySelector('input').focus();
        },
        inputFocus2: function(e) {
          this.$refs.customerInputCode.$el.querySelector('input').focus();
        },
        focusCanl: function(e){
          e.stopPropagation();
          // console.log(123)
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
        filtTimer: function(timer) {
          const time = timer.toString();
          return time.slice(0,4) + "-" + time.slice(4,6) + "-" + time.slice(6) + " 00:00:00"
        },
        dateFormat: function(row,column){
          var t=new Date(row.createTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
          return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+" "+t.getHours()+":"+t.getMinutes()+":"+t.getSeconds()+"."+t.getMilliseconds();
        },
      //   dataFormat2:function(row,column){
      //     　　var t=new Date(row.updateTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
      //     　　var year=t.getFullYear(),
      //        　　 month=t.getMonth()+1,
      //        　　 day=t.getDate(),
      //       　　  hour=t.getHours(),
      //       　　  min=t.getMinutes(),
      //       　　  sec=t.getSeconds();
      //   　　  var newTime=year+'-'+
      //       　　  (month<10?'0'+month:month)+'-'+
      //      　　   (day<10?'0'+day:day)+' '+
      //       　　  (hour<10?'0'+hour:hour)+':'+
      //       　　  (min<10?'0'+min:min)+':'+
      //       　　  (sec<10?'0'+sec:sec);
      //   　　  return newTime;
      // 　　},
      },
      mounted: function () {
        // 已经开始补货模式
        if (+this.getCookie('start') === 1) {
          this.soketLink()
          this.nowDeskFlag = true
        }
        clearTimeout(this.getLineTableTimer);
        this.getLineTableTimer = setInterval(() => {
          this.getLineTable();
        }, 10000);
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