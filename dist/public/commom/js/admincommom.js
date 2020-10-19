const javaBasicUrl = "192.168.3.12:8082"
// 交接班模板
const commomTemplate = `
<el-dialog
  title="交接班"
  class="showChangeAdmin"
  :visible.sync="showChangeAdmin"
  width="45%"
  :before-close="handleClose"
  >
  <div class="block">
    <div id="bill_content">
      <p class="title">收银对账单</p>
      <p class="title" v-html="">{{billMessage.start_Time}} 至 {{billMessage.end_Time}}</p>
      <div class="bill_detail">
        <div class="item" v-for="(val, key) in billMessageTemplate">
          <p class="item_left">{{val.text}}</p>
          <p class="item_right">{{billMessage[val.value] || 0}}</p>
        </div>
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showChangeAdmin = false">取 消</el-button>
    <el-button type="primary" @click="determineChangeAdmin()">交接班并退出</el-button>
  </span>
</el-dialog>
`

{/* <el-date-picker
      v-model="timerValue"
      type="datetimerange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button type="primary" style="width: 80px;height: 40px;padding: 0;">查账</el-button> */}
Vue.component("commomtemplate", {
  props: {

  },
  template: commomTemplate,
  data() {
    return {
      showChangeAdmin: false,
      timerValue: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
      billMessage: {
        'start_Time': '2012-50-50'
      },
      billMessageTemplate: [
        {
          value: 'cashMoney',
          text: '现金收入'
        },
        {
          value: 'sqbMoney',
          text: '收钱吧收入'
        },
        {
          value: 'refund',
          text: '退款金额'
        },
        {
          value: 'number',
          text: '总成交次数'
        },
        {
          value: 'money',
          text: '总收入'
        },
      ],
      billMessageprimary: {},
    }
  },
  methods: {
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {

        })
    },
    showChange() {
      this.showChangeAdmin = !this.showChangeAdmin
    },
    determineChangeAdmin() {
      let _that = this
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/admin/home/loginChange',
        data: _that.billMessageprimary,
        success: function (res) {
          if (res.retCode == 200) {
            _that.$message({
              type: 'success',
              message: '交接成功!'
            });
            setTimeout(() => {
              $('#userLogOut').click()
            }, 2000);
          } else {
            _that.$message({
              type: 'info',
              message: res.retMsg
            });
          }
        },
        error: function (res) {
          _that.$message({
            type: 'info',
            message: '请检查网络'
          });
        }
      })
      // obj.vueThat.openFullScreen()
    },
    allDataAjax() {
      let _that = this
      $.ajax({
        type: 'GET',
        dataType: 'json',
        url: '/admin/home/searchpeople',
        success: function (res) {
          if (res.retCode == 200) {
            for (var key in res.retEntity) {
              if (res.retEntity[key]) {
                _that.billMessageprimary[key] = res.retEntity[key]
              } else {
                _that.billMessageprimary[key] = 0
              }
            }
            if (res.retEntity.refund) {
              _that.billMessageprimary.refundAmount = res.retEntity.refund
            } else {
              _that.billMessageprimary.refundAmount = 0
            }

            res.retEntity.sqbMoney = res.retEntity.sqbMoney / 100
            res.retEntity.cashMoney = res.retEntity.cashMoney / 100
            res.retEntity.refund = res.retEntity.refund / 100
            res.retEntity.money = res.retEntity.money / 100
            _that.billMessage = res.retEntity

          } else {

          }
        },
        error: function (res) {
          console.log(res)
        }
      })
    }
  },
  mounted: function () {

  },
  watch: {
    showChangeAdmin(val) {
      if (val) {
        this.allDataAjax()
      }
    }
  }
});


var vueObj = {

  nowTimer: function (str) {
    let now = new Date(); //当前日期 
    let nowDayOfWeek = now.getDay(); //今天本周的第几天 
    let nowDay = now.getDate(); //当前日 
    nowDay = nowDay < 10 ? '0' + nowDay : nowDay
    let nowMonth = now.getMonth() + 1; //当前月 
    let nowYear = now.getFullYear(); //当前年
    if (str) {
      switch (str) {
        case 'year':
          return nowYear
          break;
        case 'month':
          return nowMonth
          break;
        case 'day':
          return nowDay
          break;
        default:
          break;
      }
    }
    return nowYear + '-' + nowMonth + '-' + nowDay
  },

  // 初始化模板 特殊数据 || 查询数据
  vueObjGetdata: {},

  bindEvent: function () {
    let that = this
    // $('body').on('click', '#userLogOut', function () {
    //   $.ajax({
    //     type: 'POST',
    //     dataType: 'json',
    //     url: '/admin/home/loginOut',
    //     success: function (res) {
    //       window.location.href = '/adminLogin'
    //     },
    //     error: function (res) {
    //       console.log(res)
    //     }
    //   })
    // })
  },

  selectPage: function (pageNum, pageSize, first, callback) {
    let that = this
    let data = {}
    let adddata = {}
    if (that.vueObjGetdata) {
      adddata = that.vueObjGetdata
      adddata.pageNum = pageNum // 页数
      adddata.pageIndex = pageNum // 页数
      adddata.pageSize = pageSize // 页条数
      data = adddata
    } else {
      data = {
        pageNum: pageNum,
        pageIndex: pageNum,
        pageSize: pageSize,
      }
    }
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: obj.tableurl,
      data: data,
      success: function (res) {
        if (callback) {
          callback(res)
        }
        if (!res.retEntity || res.retEntity.count == 0) {
          obj.tdList([])
          $('#page').hide()
          return
        }
        let data
        if (res.retEntity.data) {
          data = res.retEntity.data
        } else if (res.retEntity.orders) {
          data = res.retEntity.orders
        } else if (res.retEntity.members) {
          data = res.retEntity.members
        } else if (res.retEntity.content) {
          data = res.retEntity.content
        } else if (res.retEntity) {
          data = res.retEntity
        }
        let htmlTemplate = obj.tdList(data)
        if (htmlTemplate) {
          $('#ProductModifyPricelist').html(htmlTemplate)
        }
        if (first) {
          if (res.retEntity.count ? res.retEntity.count > pageSize : res.retEntity.totalCount > pageSize) {
            $('#page').show()
            that.pageInit(res.retEntity.count ? res.retEntity.count : res.retEntity.totalCount)
          } else {
            $('#page').hide()
          }
        }
      },
      error: function (res) {
        console.log(res)
      }
    })
  },

  pageInit: function (count) {
    let that = this
    $("#page").paging({
      nowPage: 1, // 当前页码,默认为1
      pageNum: Math.ceil(count / 10), // 总页码
      buttonNum: 7, //要展示的页码数量，默认为7，若小于5则为5
      callback: function (num) { //回调函数,num为当前页码
        that.selectPage(num, 10)
      }
    });
  },

  initPage: function (data, callback) {
    let that = this
    if (data) {
      that.vueObjGetdata = data
    }
    that.selectPage(1, 10, true, callback)
  },

  initVue: function () {

  },

  // 获取cookie
  getCookie: function (name) {
    var cookies = document.cookie;
    var list = cookies.split("; ");          // 解析出名/值对列表

    for (var i = 0; i < list.length; i++) {
      var arr = list[i].split("=");          // 解析出名和值
      if (arr[0] == name)
        return decodeURIComponent(arr[1]);   // 对cookie值解码
    }
    return "";
  },

  // 定义vue全局方法
  vueCommomInit: function () {
    // 开启 loading
    Vue.prototype.openFullScreen = function () {
      obj.vueThat.loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    // 关闭loading
    Vue.prototype.closeloading = function () {
      obj.vueThat.loading.close()
    }
    // 成功提示
    Vue.prototype.successMessage = function (message) {
      obj.vueThat.$message({
        message: message,
        type: 'success'
      });
    }
    // 警告提示
    Vue.prototype.warningMessage = function (message) {
      obj.vueThat.$message({
        message: message,
        type: 'warning'
      });
    }
    // 失败提示
    Vue.prototype.errMessage = function (message) {
      obj.vueThat.$message.error(message);
    }
  },

  getQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    var q = window.location.pathname.substr(1).match(reg_rewrite);
    if (r != null) {
      return unescape(r[2]);
    } else if (q != null) {
      return unescape(q[2]);
    } else {
      return null;
    }
  },

  dateFormat: function (s, format) {
    var date = s ? new Date(s) : new Date();
    var map = {
      "M": date.getMonth() + 1, //月份
      "d": date.getDate(), //日
      "h": date.getHours(), //小时
      "m": date.getMinutes(), //分
      "s": date.getSeconds(), //秒
      "q": Math.floor((date.getMonth() + 3) / 3), //季度
      "S": date.getMilliseconds() //毫秒
    };
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      var v = map[t];
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v;
          v = v.substr(v.length - 2);
        }
        return v;
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length);
      }
      return all;
    });
    return format;
  },

  init: function () {
    this.bindEvent()
    this.vueCommomInit()
  }
}

$(function () {
  vueObj.init()
})
