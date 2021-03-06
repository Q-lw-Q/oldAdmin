var obj = {

  vueThat: "",
  id: "",
  bindEvent: function () {
    let that = this
    // $('#btnSavePayInfo').on('click',function(){
    //   that.getData({
    //     data: $('#sv_merchant_name').val()
    //   })
    // })

    // $('#setshouqian').on('click',function(){
    //   that.getSetsqb({
    //     sn: $('#setsn').val(),
    //     key: $('#setkey').val(),
    //     id: that.id
    //   })
    // })
    
  },

  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          comSN: ""
        }
      },
      methods: {
        async getInit(){
          console.log(123)
          axios.post(location.pathname + '/getCom')
            .then((res) => {
              console.log(res)
              if (res.data.retCode == 200) {
                this.comSN = res.data.retEntity.msn
              }
              // this.$message.error(res.data.retMsg)
            })
            .catch((res) => {
              // this.$message.error('网络连接错误')
            })
        },
        setAiList: function(){
          let that = this
          console.log(123)
          $.ajax({
            type: 'GET',
              dataType: 'json',
              url: location.pathname + '/setSorting',
              data: {
                id: $('.integralRules ul li label :checked').data('id')
              },
              success: function (res) {
                if(res.alert) {
                  that.successMessage(res.alert)
                }
              },
              error: function (res) {
      
              }
          })
        },
        relieveCom: function() {
          axios.post(location.pathname + '/removal')
            .then((res) => {
              if (res.data.retCode == 200) {
                this.$message.success(res.data.retMsg);
                return
              }
              this.$message.error(res.data.retMsg)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        setCom: function() {
          axios.post(location.pathname + '/setval', {
            msn: this.comSN
          })
            .then((res) => {
              if (res.data.retCode == 200) {
                this.$message.success(res.data.retMsg);
                return
              }
              this.$message.error(res.data.retMsg)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        }
      },
      mounted: function () {
        this.getInit()
      },
      watch: {
        tableListdata: function () {

        }
      }
    });
  },

  getAilistId: function (){
    $.ajax({
      type: 'GET',
        dataType: 'json',
        url: location.pathname + '/sorting',
        success: function (res) {
          if (res.data) {
            $('#list'+res.data).click()
          }
        },
        error: function (res) {

        }
    })
  },

  getData: function (data) {
    let that = this
    $.ajax({
      type: 'GET',
        dataType: 'json',
        url: location.pathname + '/setData',
        data: data,
        success: function (res) {
          $('#sv_merchant_name').val(res.msg)
          if(res.alert) {
            that.vueThat.successMessage(res.alert)
          }
        },
        error: function (res) {

        }
    })
  },

  getSetsqb: function (data) {
    let that = this
    $.ajax({
      type: 'GET',
        dataType: 'json',
        url: location.pathname + '/setDatasqb',
        data: data,
        success: function (res) {
          if(res.retCode == 200) {
            that.vueThat.successMessage('保存成功')
          } else {
            that.vueThat.errMessage(res.retMsg)
          }
        },
        error: function (res) {

        }
    })
  },

  getsqb: function(){
    let that = this
    $.ajax({
      type: 'GET',
        dataType: 'json',
        url: location.pathname + '/getDatasqb',
        success: function (res) {
          $('#setsn').val(res.retEntity.merchantPayInfo.terminalSn)
          $('#setkey').val(res.retEntity.merchantPayInfo.terminalKey)
          that.id = res.retEntity.merchantPayInfo.merchantPayInfoId
        },
        error: function (res) {

        }
    })
  },

  init: function () {
    this.initVue()
    this.bindEvent()
    // this.getData()
    // this.getsqb()
    this.getAilistId()
  }
}

$(function () {
  obj.init()
})

