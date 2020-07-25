var template = `
<section>
<div class="container-fluid">
    <input type="hidden" value="">
    <a class="shoplogo" id="smalllogoimg" href="/admin/home">
    <!-- <img class="shoplogoimg" id="logoid"
        src="http://pt.decerp.cn/distributorLogo/distributorLogo_1/logo.png?v=381"> -->
        收银后台
    </a>
    <span class="hidden topAllMessage">
      <em>药品种类数量：0</em>
      <em>药品库存数量：0</em>
    </span>
    <ul class="header-right-nav" id="headermove">
    <li class="username active">
        <div class="message">
        <div class="fl" style="height:46px;display: flex;flex-direction: column;align-items: center;">
            <i style="height: 23px;line-height:25px;font-size: 12px;" class="usename" id="username">胜控科技</i>
            <p class="headerusertext" style=""><i class="" id="postion" name="postion">{{userTypeFrom[userType]}}</i> <i class=""
                id="dianzhu" name="dianzhu">{{userName}}</i></p>
        </div>
        <i class="caret fr triangle"></i>
        </div>
        <input type="hidden" id="userid" name="userid" value="48406207">
    </li>
    </ul>
    <li id="systemInformation"  @click=shownewcenter() class=" fr" style="padding-right: 10px;"><div id="Messagenumberbox" class="message"><i class="iconfont2 icon1 el-icon-message-solid"></i></div></li>
    <a class="fr showcollect" id="showcollect" v-bind:href="showcollecttext == '前台收银' ? '/checkstand' : '/admin/home'" >
    <i style="font-size: 18px;" class="indexIconfont el-icon-s-finance" v-bind:class= "showcollecttext == '进入后台' ? 'indexIconfont el-icon-s-cooperation' : 'indexIconfont el-icon-s-finance'"  ></i>
    {{showcollecttext}}
    </a>
    <a class="fr showcollect" id="showcollect" href="/admin/orderManagement" >
      <i style="font-size: 18px;" class="indexIconfont iconfont icon-nav i2"   ></i>
      查询订单
    </a>
    <label class="topSelectShowZeor fr hidden " >
      <input type="checkbox" class="checkinput" @click="editShowZero" id="checkShowprescription" />
      <p>不显示零库存药品</p>
    </label>
</div>
<div class="nav-content usercenter" style="right: 20px;">
    <ul style="margin: 0;padding: 8px 0;">
        <li class="text-center usercenterhref">
            <a id="handover" href="javascript:void(0);" @click="showChange()" class="handover_hide">
                <i class="iconfont2 iconphoto"></i>交接班&nbsp;&nbsp;&nbsp;
            </a>
            <a id="userLogOut" @click="out" href="javascript:void(0);" class="">
                <i class="iconfont2 iconphoto"></i>退出系统
            </a>
        </li>
    </ul>
</div>
<div class="newscenter" id="newscenter" :style="{right: rightNewScenter}">
    <div class="newscenter-nav">
        <ul id="newscenter-nav">
            <li class="active">出货消息</li>
        </ul>
    </div>
    <!--业务消息-->
    <div class="newscenter-content active">
        <ul id="messagehtml">
          <li v-for="(value, key) in GETalllist">
            <a href="javascript:void(0);" @click="openshipment(value.ordersNum,value.payType)">
            <p class="new-title">点击确认订单号为{{value.ordersNum}}的订单出货</p>
            <p class="colorc1cad4">{{value.datatime}}</p>
            </a>
          </li>
        </ul>
    </div>
    <!--业务消息-->
    <!--系统公告-->
    <div class="newscenter-content">
        <ul id="systemMessageList_new"></ul>
    </div>
    <!--系统公告-->
    <!--升级公告-->
    <div class="newscenter-content">
        <ul id="logMessageList_new"></ul>
    </div>
    <!--升级公告-->
</div>
<el-alert
  v-if="showPlice"
  :title="pliceTitle"
  type="error"
  :description="pliceDes"
  @close="closePlice"
  show-icon>
</el-alert>
</section>
`
{/* <li class="col-xs-3" id="systemInformation" @click=shownewcenter()>
<div class="message" id="Messagenumberbox">
    <i class="message-counts" id="Messagenumber">99</i>
    <i class="iconfont2 icon1 el-icon-message-solid"></i>
</div>
</li> */}
Vue.component("Topnav", {
  props: {
    showcollecttext: {
      type: String,
      default: '前台收银'
    }
  },
  template: template,
  data() {
    return {
      showPlice: false,// 显示预警内容
      pliceTitle: '',
      pliceDes: '',
      showChangeAdmin: false,
      userType: vueObj.getCookie('userType') || '',
      userName: vueObj.getCookie('userName') || '',
      branchName: vueObj.getCookie('branchName') || '',
      userTypeFrom: {
        0: '极客管理员',
        1: '极客',
        2: '管理员',
        3: '子账号',
        4: '自助收银机(商户内终端)',
        5: '自助收银机(商户外终端)',
      },
      rightNewScenter: -370 + 'px',
      GETalllist: []
    }
  },
  methods: {
    showChange() {
      $.each(obj.vueThat.$children, function (i, item) {
        // obj.vueThat.$children[i].showChangeAdmin = true
        let element = $(obj.vueThat.$children[i].$el)
        if (element.hasClass('showChangeAdmin')) {
          obj.vueThat.$children[i].showChangeAdmin = true
        }
      })
    },
    shownewcenter() {
      let that = this
      if (this.rightNewScenter === 0 && ($('#newscenter').css('display') == "block")) {
        this.rightNewScenter = -370 + 'px'
      } else {
        $('#newscenter').show()
        this.rightNewScenter = 0
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: '/admin/orderManagement/data',
          data: {
            starttime: '2019-01-01 00:00:00',
            endtime: vueObj.nowTimer() + ' 23:59:59',
            type: 0,
            orderType: 1,
            pageNum: 1,
            pageSize: 10
          },
          success: function (res) {
            that.GETalllist = []
            $.each(res.retEntity.orders, function (i, item) {
              if (item.payStatus == "PAID" && item.shipment == 0) {
                that.GETalllist.push(item)
              }
            })
          },
          error: function (res) {

          }
        })
      }
    },
    openshipment(num, type) {
      let that = this
      obj.vueThat.$confirm('确认现在立即出货?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning'
      }).then(() => {
        obj.vueThat.openFullScreen()
        $.ajax({
          type: 'GET',
          dataType: 'json',
          url: '/admin/orderManagement/orderShipment',
          data: {
            ordersNum: num
          },
          success: function (res) {
            obj.vueThat.closeloading()
            if (res.retCode == 200) {
              obj.vueThat.successMessage('开始出货')
              if (type == 3) {
                window.open(location.protocol + '/' + '/' + location.host + '/print?ordersNum=' + num)
              }
              $('#newscenter').hide()
              // setTimeout(function () {
              //     window.location.reload()
              // }, 2000)
            } else {
              obj.vueThat.warningMessage(JSON.parse(res.retMsg).retMsg)
            }
          },
          error: function (res) {
            obj.vueThat.closeloading()
            that.$message({
              type: 'info',
              message: '请检查网络'
            });
          }
        })
      }).catch(() => {
        if (this.$message) {
          this.$message({
            type: 'info',
            message: '已取消出货'
          });
        }

      });
    },
    showPliceAlt(title,des) {
      this.showPlice = true
      this.pliceTitle = '异常原因：' + title
      if (des) {
        this.pliceDes = '出错订单单号：' + des
      } else {
        this.pliceDes = ''
      }
    },
    hidePliceAlt() {
      this.showPlice = false
    },
    closePlice() {
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/admin/home/remove/callPoliceErrBoxIn',
        success: function (res) {

        },
        error: function (res) {
          
        }
      })
    },
    editShowZero() {
      console.log()
      $.ajax({
        type: 'get',
        dataType: 'json',
        url: '/checkstand/editZero',
        success: function (res) {
          $('#allshopping').click()
        },
        error: function (res) {
          
        }
      })
    },
    out() {
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: '/admin/home/loginOut',
        success: function (res) {
          window.location.href = '/adminLogin'
        },
        error: function (res) {
          console.log(res)
        }
      })
    }
  },
  mounted: function () {
    $('#headermove .username').on('click', function (e) {
      $('#HeaderBackgroundColor .usercenter').toggle()
      e.stopPropagation()
    })
    $('#HeaderBackgroundColor .usercenter').hover(function () {

    }, function () {
      $('#HeaderBackgroundColor .usercenter').hide()
    })
    $('body').on('click', function () {
      $('#HeaderBackgroundColor .usercenter').hide()
    })
  }
});


const websocket = {
  socketInit: function() {
    var wsServer = new WebSocket('ws://'+location.hostname+':2999');
    wsServer.onopen = function (e) {
      wsServer.send(e);//向后台发送数据
    };

    wsServer.onmessage = function (e) {//后台返回消息的时候触发
      if (e.data.size == 0) {
        obj.vueThat.$children.some(element => {
          if(element.hidePliceAlt){
            element.hidePliceAlt()
            return true
          }
        })
      } else {
        let skString = JSON.parse(e.data)
        obj.vueThat.$children.some(element => {
          if(element.showPliceAlt){
            element.showPliceAlt(skString[0],skString[1])
            return true
          }
        })
      }
    }
  },
  init: function () {
    this.socketInit()
  }
}
$(function(){
  websocket.init()
})
