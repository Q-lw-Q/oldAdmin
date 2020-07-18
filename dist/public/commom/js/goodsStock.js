var obj = {

  bindEvent: function () {
    let that = this
    let sumber

    // 搜索查询
    $('#query_filter_btn2').on('click', function () {
      vueObj.vueObjGetdata.replenishmentNum = $('#contextval').val()
      vueObj.initPage()
    })

    $('#addNewProduct').on('click', function () {
      that.vueThat.openFullScreen()
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: location.pathname + '/addData',
        success: function (res) {
          that.vueThat.closeloading()
          if (res.retCode == 200) {
            that.vueThat.successMessage('正在补货')
          } else {
            that.vueThat.warningMessage(res.retMsg)
          }
        },
        error: function (res) {
          that.vueThat.closeloading()
          that.vueThat.warningMessage('请检查网络连接!!!')
        }
      })
    })

    $('#stopNewProduct').on('click', function () {
      that.vueThat.openFullScreen()
      $.ajax({
        type: 'POST',
        dataType: 'json',
        url: location.pathname + '/stop',
        success: function (res) {
          that.vueThat.closeloading()
          if (res.retCode == 200) {
            that.vueThat.successMessage(res.retMsg)
          } else {
            that.vueThat.warningMessage(res.retMsg)
          }
        },
        error: function (res) {
          that.vueThat.closeloading()
          that.vueThat.warningMessage('请检查网络连接!!!')
        }
      })
    })

    // 手动补货
    $('#addHandNewProduct').on('click', function () {
      $('.loadgin_mask').show()
      sumber = setInterval(() => {
        $('.input_search').focus()
      }, 1000);
    })

    $('#stop_speak').on('click', function () {
      $('.loadgin_mask').hide()
      clearTimeout(sumber)
    })

    $(document).keypress(function (e) {
      if (searchinput()) {
        if (e.keyCode == 13) {
          //执行你想执行的方法，keyCode代表不同的按键　　  
          let number = $('.input_search').val()
          $('.search_num').html(number)
          $.ajax({
            type: 'POST',
            dataType: 'json',
            url: location.pathname + '/handadd',
            data: {
              barcode: number
            },
            success: function (res) {
              $('.input_search').val("")
              if (res.retCode == 200) {
                obj.vueThat.$message({
                  type: 'success',
                  duration: '5000',
                  message: "识别成功"
                })
              } else {
                obj.vueThat.$message({
                  type: 'info',
                  duration: '5000',
                  message: res.retMsg
                })
              }
            },
            error: function (res) {
              $('.input_search').val('')
              obj.vueThat.$message({
                type: 'info',
                duration: '5000',
                message: '请检查网络'
              })
            }
          })
        }
      }
    })

    // 查询是否要录入
    function searchinput() {
      if ($('.loadgin_mask').css('display') === "block") {
        return true
      } else {
        return false
      }
    }

  },

  tdList: function (obj) {
    let tpl = ""
    $.each(obj, function (i, item) {
      switch (+item.status) {
        case -1:
          item.statusString = '作废'
          item.timeString = '补货未完成'
          break;
        case 0:
          item.statusString = '正在补货'
          item.timeString = '补货未完成'
          break;
        case 1:
          item.statusString = '补货完成等待扫描'
          item.timeString = '补货未完成'
          break;
        case 2:
          item.statusString = '扫描进行中'
          item.timeString = '补货未完成'
          break;
        case 3:
          item.statusString = '补货完成'
          item.timeString = item.start + ' 至 ' + item.endl
          break;
        default:
          break;
      }
      tpl += `<tr>
          <td>`+ item.replenishmentNum + `</td>
          <td>`+ item.name + `</td>
          <td>`+ item.countGoods + `</td>
          <td>`+ item.statusString + `</td>
          <td>`+ item.timeString + `</td>
          <td class="caozuo">
            <a class="fl seedetails" href="/admin/goodsStockdetail?replenishmentId=`+ item.replenishmentId + `" target="_blank">查看详情</a>
            <a class="fl seedetails ${(+item.status == 0) ? '' : 'hidden'} " onclick="obj.zuofei(` + item.replenishmentNum + `)">作废该订单</a>
          </td>
        </tr>`
    })
    return tpl
  },

  initVue: function () {
    
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {

        }
      },
      methods: {

      },
      mounted: function () {

      },
      watch: {
        tableListdata: function () {

        }
      }
    });
  },

  tableurl: location.pathname + '/data',

  zuofei: function (replenishmentNum) {
    let that = this
      obj.vueThat.$confirm('确认作废该订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        // type: 'warning'
      }).then(() => {
        that.vueThat.openFullScreen()
       
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: location.pathname + '/replenishment',
          data: {
            replenishmentNum: replenishmentNum
          },
          success: function (res) {
            that.vueThat.closeloading()
            if (res.retCode == 200) {
              that.vueThat.successMessage('作废成功')
              setTimeout(() => {
                window.location.reload()
              }, 2000);
            } else {
              that.vueThat.warningMessage(res.retMsg)
            }
          },
          error: function (res) {
            that.vueThat.closeloading()
            that.vueThat.warningMessage('请检查网络连接!!!')
          }
        })
      }).catch(() => {
        that.vueThat.$message({
          type: 'info',
          message: '已取消'
        });
      });

  },

  init: function () {
    this.initVue()
    vueObj.vueObjGetdata.replenishmentNum = ''
    vueObj.initPage()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})
