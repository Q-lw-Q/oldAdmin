
  let shoppingList = {}
  let tips = ''
  let audioMute = true
  let zsysObj = new ZNXY.Diagnose({
    app_id: '5df061299ea2ea6449d16e38',
    autorender: true,
    view: {
      container: '#container'
    }
  }).on('append-question', question => {
    tips = question.title
    if (audioMute) {
      setVoice(tips)
    }

  }).on('result', function (result) {
    this.render(result);
    // console.log(result)
    let ajaxContent = []
    let resultArr = []
    let ajaxNum = 0
    if (result.results) {
      result.results.forEach(element => {
        if (element.rst) {
          element.rst.forEach(rstItem => {
            ajaxContent.push(rstItem)
          })
        } else if (element.items) {
          element.items.forEach(rstItem => {
            ajaxContent.push(rstItem)
          })
        }

      });
      if (ajaxContent) {
        getContentItem()
      }
    }

    function getContentItem() {
      // if ((resultArr.length >= 6) || (ajaxNum == (ajaxContent.length - 1))) {
      //   setContent()
      // } else {
      let getName = []
      let getdisease = []
      $.each(ajaxContent, function (key, value) {
        getName.push(value.name)
        getdisease.push(ajaxContent[ajaxNum].for_symptoms ? ajaxContent[ajaxNum].for_symptoms.value.trim() : ajaxContent[ajaxNum].for_diseases.value.trim())
        ajaxNum++
      })


      $.ajax({
        method: "POST",
        async: true,    //或false,是否异步
        url: "/aiInterrogation/Mobileseek",
        data: {
          seek: JSON.stringify(getName),
          getdisease: JSON.stringify(getdisease)
        },
        success: function (retData) {
          if (retData.retEntity.length > 0) {
            retData.retEntity.some(element => {
              if (resultArr.length < 6) {
                resultArr.push(element)
              } else {
                return true;
              }
            })
            // ajaxNum++
            // getContentItem()
            // } else {
            // ajaxNum++
            // getContentItem()
          }
          setContent()
        },
        error: function (XMLHttpRequest, tetStatus, errorThrown) {
          Toast("商品查询错误!")
        }
      })
      // }

    }

    function setContent() {
      initBodyItem(JSON.stringify(resultArr))
      $('.shoppingList').removeClass('hidden')
      $('.audioMute').remove()
    }

    return false
  }).start()

  let obj = {
    bindEvent: function () {
      // 
      $('.detailClose').on('click', function () {
        $('.shoppingDetail').addClass('hidden')
      })
      // 刷新 重载
      $('.refalsh').on('click', function () {
        window.location.reload()
      })

      $('#panel-body').on('click', '.seeDetail', function () {
        let $this = $(this)
        let data = JSON.parse($this.attr('data'))
        let barcode = data.barcode
        $.ajax({
          method: "GET",
          async: true,    //或false,是否异步
          url: "/aiInterrogation/get/shoppingdetail",
          data: {
            barcode: barcode
          },
          success: function (retData) {
            if (retData.retCode == 200) {
              obj.initDetail(retData.retEntity)
            } else {
              Toast(retData.retMsg)
            }
          },
          error: function (XMLHttpRequest, tetStatus, errorThrown) {
            Toast("商品查询错误!")
          }
        })
      })

      // 添加购物车
      $('#panel-body').on('click', '.addShopping', function () {
        let $this = $(this)
        let data = JSON.parse($this.attr('data'))
        let barcode = data.barcode
        if (data.quantity == 0) {
          Toast('该商品已无库存!!!')
        } else if (shoppingList[barcode]) {
          Toast('已添加到购物车!!!')
        } else {
          shoppingList[barcode] = data
          shoppingList[barcode].shopingQty = 1
          $('#add_shopping')[0].play()
          initShoppingDepot()
        }
      })
      //减少数量
      $('#contentShoppingCard').on('click', '.editjian', function () {
        let $this = $(this)
        let parentsLi = $this.parents('li')
        let barcode = parentsLi.attr('barcode')
        let num = parentsLi.find('.num').html()

        if (num == 1) {
          delete shoppingList[barcode]
          initShoppingDepot()
        } else {
          shoppingList[barcode].shopingQty--
          parentsLi.find('.num').html(--num)
          initShoppingDepot(true)
        }
      })
      //增加数量
      $('#contentShoppingCard').on('click', '.editadd', function () {
        let $this = $(this)
        let parentsLi = $this.parents('li')
        let barcode = parentsLi.attr('barcode')
        let num = parentsLi.find('.num').html()
        let maxNum = shoppingList[barcode].quantity
        if (num == maxNum) {
          Toast('已添加全部库存！！！')
        } else {
          shoppingList[barcode].shopingQty++
          parentsLi.find('.num').html(++num)
        }
        initShoppingDepot(true)
      })

      // 下订单
      // $('#orderGoAndroid').on('click', function () {
      //   let orderArr = []
      //   $.each(shoppingList, function (key, value) {
      //     orderArr.push({
      //       barcode: value.barcode,
      //       qty: value.shopingQty
      //     })
      //   })
      //   console.log(orderArr)
      // })

      // 静音
      $('.audioMute').on('click', function () {
        audioMute = !audioMute
        if (audioMute) {
          $(this).html('点击</br>静音')
        } else {
          $(this).html('取消</br>静音')
        }
      })
    },
    initDetail: function(data){
      $('.shoppingDetail #pictrue ').attr('src', data.logo)
      $('.shoppingDetail #shoppingName').html(data.goodsName || '未知')
      $('.shoppingDetail #effect').html(data.effect || '暂无说明')
      $('.shoppingDetail #dosage').html(data.dosage || '暂无说明')
      $('.shoppingDetail #attention').html(data.attention || '暂无说明')
      $('.shoppingDetail #taboo').html(data.taboo || '暂无说明')
        
      $('.shoppingDetail').removeClass('hidden')
    },
    init: function () {
      this.bindEvent()
    }
  }

  // 初始化购物车 isflag 只算价钱
  function initShoppingDepot(isflag) {
    let money = 0
    let tpl = ''
    let i = 1
    $.each(shoppingList, function (key, value) {
      if (!isflag) {
        tpl += `<li barcode="${value.barcode}">
                <p>${i}</p>
                <p>${value.goodsName}</p>
                <p>${value.unit ? value.unit : '盒'}</p>
                <p>￥${value.price}元</p>
                <p class="edit">
                  <span class="editjian">-</span>
                  <span class="num">${value.shopingQty}</span>
                  <span class="editadd">+</span>
                </p>
              </li>`
      }
      money += (value.price * 100) * value.shopingQty
      i++
    })

    if (tpl || !isflag) {
      $('#contentShoppingCard').html(tpl)
    }
    $('#allMoney').html('￥' + (money / 100) + '元')
    getShoppingOrder()
  }

  // 计算购物车跳转 订单
  function getShoppingOrder() {
    let orderArr = []
    $.each(shoppingList, function (key, value) {
      orderArr.push({
        barcode: value.barcode,
        qty: value.shopingQty,
        price: value.price
      })
    })
    $('#orderGoAndroid').attr('href', 'myapp://tonative/param?data=' + JSON.stringify(orderArr))

  }

  // 初始化药品列表
  function initBodyItem(data) {
    let item = ''
    JSON.parse(data).forEach(items => {
      item += `<div class="item-list">
                <div class="item-icon seeDetail" data='${JSON.stringify(items)}' >
                  <img src="${'/servicepictures/' + items.barcode + '.jpg'}" />
                </div>
                <div class="flex1">
                  <div class="title">${items.goodsName}</div>
                  <p class="symptomatic">
                    对症：${items.disease}
                    <span class="otc hidden">${items.otc ? '非处方药' : '处方药'}</span>
                  </p>
                  <p class="money">￥${items.price}元
                    <span class="num">剩余库存：${items.quantity}</span>
                  </p>
                </div>
                <div class="flex2">
                  <p class="addShopping" data='${JSON.stringify(items)}'>加入购物车</p>
                </div>
               </div>`
    })
    $('#panel-body').html(item)
  }

  // 获取URL参数
  function GetRequest(urlStr) {
    if (typeof urlStr == "undefined") {
      var url = decodeURI(location.search); //获取url中"?"符后的字符串
    } else {
      var url = "?" + urlStr.split("?")[1];
    }
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
      var str = url.substr(1);
      strs = str.split("&");
      for (var i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
      }
    }
    return theRequest;
  }

  // msg:文案信息；duration：毫秒数；minWidth：宽度值，单位为rem；
  function Toast(msg, duration, minWidth) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "    word-break: keep-all;max-width:60%;padding:.2rem .4rem;color: rgb(255, 255, 255);text-align: center;border-radius: .2rem;position: fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);z-index: 999999;background: rgba(0, 0, 0,.7);font-size: .8rem;" + "min-width:" + minWidth + "rem";

    document.body.appendChild(m);
    setTimeout(function () {
      var d = 0.5;
      m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
      m.style.opacity = '0';
      setTimeout(function () { document.body.removeChild(m) }, d * 1000);
    }, duration);
  }

  obj.init()
