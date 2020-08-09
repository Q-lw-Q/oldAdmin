// console.log(printJS)
//购物栏中商品ID
var GoodsId = new Array();
//商品ID
var url;
//商品订单号
var ordersNum;
var cmbOrderId;
//当前折扣窗口 为输入折扣 还是金钱 默认为折扣
var discountStatus = 'discount'

// 应收价钱
var yinshouMoney = ""

var timeout = ""

let dayinpaysuccess = false
let dayinpayData = ''
let sqTimer
let queryproductChangeTimer = ""
// var recorder = new Recorder({
//   sampleRate: 44100, //采样频率，默认为44100Hz(标准MP3采样率)
//   bitRate: 128, //比特率，默认为128kbps(标准MP3质量)
//   success: function () { //成功回调函数
//   },
//   error: function (msg) { //失败回调函数
//   },
//   fix: function (msg) { //不支持H5录音回调函数
//   }
// });


//加载初始化数据
function initData() {
  $.ajax({
    type: 'GET',
    dataType: "json",
    url: "/checkstand/data",
    success: function (retData) {
      $('#HeaderBackgroundColor .topAllMessage , #HeaderBackgroundColor .topSelectShowZeor').removeClass('hidden')
      //插入商品类别
      $("#swipers").html(" ")
      var str1 = ""
      $.each(retData.retEntity.Category, function (i, item) {
        str1 += "<div class=\"swipers_list\" data-id=\"237495\" style=\"width: 216.333px; margin-right: 4px;\" onclick='ShopType({id:" + item.categoryId + "}, this )'> " + item.name + "</div>"
      })

      if (retData.retEntity.showZeor) {
        $('#HeaderBackgroundColor .topSelectShowZeor input')[0].checked = true
      }

      $("#swipers").append(str1).css('width', ($("#swipers div").length + 1) * 217 + 'px')

      obj.vueThat.shoppingCount = Math.ceil(retData.retEntity.pageData.count / 40)
      // obj.vueThat.shoppingCount = Number(String(Date.parse(new Date()) / 1000).slice(9))

      //插入商品
      shoppingListTpl(retData.retEntity.pageData.data)
      initShoppingCount(retData.retEntity.GoodsCount,retData.retEntity.GoodsSum)
    },
    error: function () {
      layer.msg("发生错误");
    }
  });

}


function ShopType(data, node) {
  $.ajax({
    method: "POST",
    async: true,    //或false,是否异步
    url: "/checkstand/classify",
    data: data,
    success: function (retData) {
      if (node) {
        obj.vueThat.shoppingIndex = 1
        obj.vueThat.shoppingCount = Math.ceil(retData.retEntity.pageData.count / 40)
        obj.vueThat.shoppingId = data.id
      }
      //插入商品
      shoppingListTpl(retData.retEntity.pageData.data, node)
      initShoppingCount(retData.retEntity.GoodsCount,retData.retEntity.GoodsSum)
    },
    error: function (XMLHttpRequest, tetStatus, errorThrown) {
      layer.msg("商品查询错误!")

    }
  });
}

function shoppingListTpl(retData, node) {
  $("#productlist").html(" ")
  var str = " ";
  if (retData.length === 0) {
    layer.msg("暂无商品!")
  }
  $.each(retData, function (i, item) {
    if (item) {
      str += shoppintList(item)
    }
  })

  $("#productlist").append(str)

  if (node) {
    $(node).addClass('active').siblings().removeClass('active')
  }

  // $('img.img_load_pic').lazyload({
  //     // effect : "fadeIn"
  // })
}

function shoppingPage() {

}

function initShoppingCount (count,sum) {
  $('#HeaderBackgroundColor .topAllMessage em').eq(0).html('药品种类数量：'+count)
  $('#HeaderBackgroundColor .topAllMessage em').eq(1).html('药品库存数量：'+sum)
}

function queryproductChange() {
  clearTimeout(queryproductChangeTimer)
  queryproductChangeTimer = setTimeout(() => {
      //取值
    var queryproduct = $("#queryproduct").val();
    // 如果值为空 不进行搜索
    if (!queryproduct) {
      $("#swipers > div").eq(0).click()
      return
    }
    $.ajax({
      method: "POST",
      async: true,    //或false,是否异步
      url: "/checkstand/seek",
      data: {
        seek: queryproduct,
      },
      success: function (retData) {
        obj.vueThat.shoppingCount = 1
        //插入商品
        shoppingListTpl(retData.retEntity)
      },
      error: function (XMLHttpRequest, tetStatus, errorThrown) {
        layer.msg("商品查询错误!")
      }
    });
  }, 1000);
}

function shoppintList(item) {
  var listTpl = "<div onclick=\"add_shoppingcart(this)\"  data-is_no_wholediscount=\"true\" data-sv_is_monthly_performance=\"true\" data-project_config_value=\"0\" data-project_config_type=\"0\" data-sv_spec_masterid=\"0\" data-sv_is_newspec=\"false\" data-producttype_id=\"0\" data-mindiscount=\"0\" data-minunitprice=\"0\" data-memberprice=\"40\" class=\"textlistbox\" data-id=\"0001\" data-prid=\"7076870\" data-pricingmethod=\"0\" data-prcombinationid=\"0\" data-sv_p_unit=\"其它\" data-sv_product_type=\"0\" data-packprice=\"0\" data-printerip=\"\" data-printerport=\"\" data-categoryid=\"237495\" data-url=\"/images/omg1.jpg\" data-smallcategoryid=\"0\" data-sv_p_commissiontype=\"1\" data-sv_p_commissionratio=\"\" data-sv_product_integral=\"\" data-sv_has_iemino=\"false\" data-sv_iemi_no=\"\" data-sv_p_barcode=\"0001\" data-sv_p_artno=\"123\">" +
    "<input type=\"hidden\" class=\"SelectAreaGoodsId\" id = \"goodsid\" value=" + item.goodsDepotId + " name = 'goodsStoreRelation'>" +
    "<input type=\"hidden\"id = \"barcode\" value=" + item.barcode + " name = 'barcode'>" +
    "<a href=\"javascript:void(0);\"> " +
    " <div onclick=\"see_detail(" + item.barcode + ")\" class=\"teimg\">" +
    " <img id=\"img_7076870_pimg\" class=\"img_load_pic\" src=\"" + item.logo + "\" onerror=\this.src='/images/omg1.jpg';\" style=\"height: 80px;\">" +
    "</div>" +
    " <div class=\"teitext\">" +
    "<p class=\"productpicename\">" +
    "<span class=\"name\" name='goodsName'> " + item.goodsName + "</span>" +
    " </p>" +
    "<div class=\"productpice productpice1\"> <span class=\"jiage\" data-sv_p_originalprice=\"20\" name='price'> " + item.price + "</span>元" +
    "<div class=\"producttotal fr stockbottom0\" style=\"\"> " +
    "<input type=\"hidden\" class=\"goodsNumber\" value=" + item.quantity + "> " +
    "<i class=\"producttotaltype active\">库</i>" +
    "<span class=\"sv_p_storage\" name='quantity'> " + item.quantity + "</span>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</a>" +
    "</div>"
  return listTpl
}

//清空搜索栏
function deletebtn() {
  $(" #queryproduct").val("");

  queryproductChange()
}

function add_shoppingcart(btn) {

  if (+$(btn).find('.sv_p_storage').html() <= 0) {
    layer.msg('库存不足')
    return
  }

  var price = $(btn).find("[name='price']").html()
  var goodsName = $(btn).find("[name='goodsName']").html()
  var quantity = $(btn).find("[name='quantity']").html()
  var goodsid = $(btn).find("[name='goodsStoreRelation']").val();
  var barcode = $(btn).find("[name='barcode']").val();
  console.log($(btn).find("[name='price']").html())
  //判断数组是否包含ID
  if (GoodsId.includes(goodsid)) {
    $("#Cashlefsit .selected").each(function () {
      var goodsids = $(this).find("[name='goodsid']").val();
      if (goodsids == goodsid) {
        selected();
        $(this).addClass("bgColor");
        add();
      }
    });
  } else {
    //把加入的商品ID 放入数组
    GoodsId.push(goodsid);
    //创建一个新的li,设置内容,追加到tbody下
    var newtr = document.createElement("li");
    newtr.innerHTML = "<li onclick=\"increase(this);\" class = 'selected' name ='selected' >" +
      "<div class=\"naerigh\" >" +
      "<input value=" + goodsid + " name=\"goodsid\" type=\"hidden\">" +

      "<input value=" + quantity + " name=\"goodsNumber\" type=\"hidden\">" +
      "<p class=\"nn1\">" +
      "<span>" + goodsName + "</span>" +
      "</p>" +
      "<p class=\"nn2\">" +
      "<span class=\"fl\">" + barcode + "</span>" +
      "<span class=\"fr\">数量 <text class=\"nump\" data-cnum=\"0\" value=\" 1 \" name=\"num\">1</text>" +
      "</span>" +
      "</p> " +
      "<p class=\"nn3\">" +
      "<span class=\"fl\">¥<text class=\"jiage\" data-rjia=\"60\" value=" + price + " name = \"price\" data-orgprice=\"60\">" + price + "</text></span>" +
      "<span class=\"fr\">¥ <text class=\"zhong\" data-zhekou=\"1\" name=\"totalprice\" > " + price + "</text></span>" +
      "</p>" +

      "</div>" +
      "</li>"
    var tbody = document.getElementById("Cashlefsit");
    tbody.appendChild(newtr);
    sum();
    $('#add_shopping')[0].play()
  }


}

//选中商品
function increase(btn) {
  //清楚所有背景
  selected();
  //添加选中背景颜色
  $(btn).addClass("bgColor");
}

//清空选中框颜色
function selected() {
  $("#Cashlefsit .selected").each(function () {
    if ($(this).hasClass("bgColor")) {
      $(this).removeClass("bgColor");
    }
  });
}

//删除购物车选中商品
function dev() {
  $("#Cashlefsit .selected").each(function () {
    if (this.className == "selected bgColor") {
      var goodsid = $(this).find("[name='goodsid']").val();
      removeByValue(GoodsId, goodsid);
    }
  });
  $("#Cashlefsit").find("[class='selected bgColor']").parent().remove();
  sum();
}

//删除数组里的制定值
function removeByValue(arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1);
      break;
    }
  }
}


//選中商品添加數量 数量不能大于库存
function add() {
  $("#Cashlefsit .selected").each(function () {
    if (this.className == "selected bgColor") {
      //单价
      var price = $(this).find("[name='price']").html();
      //总数量
      var num = $(this).find("[name='num']").html();
      //当前库存
      var goodsNumber = $(this).find("[name='goodsNumber']").val();
      var i = new Number(num);
      let totalnum = i + 1;
      if (totalnum > goodsNumber) {
        layer.msg("当前购买数量大于库存数量！");
      } else {
        //设置当前总数量
        $(this).find("[class='nump']").html(totalnum);
        //设置当前总价钱
        var totalprice = Math.floor(price * totalnum * 1000) / 1000;

        $(this).find("[class='zhong']").html(totalprice);
        $('#add_shopping')[0].play()
        sum();
      }
    }
  });

}

//选中商品减少 不能少于一
function reduce() {
  $("#Cashlefsit .selected").each(function () {
    if (this.className == "selected bgColor") {

      //单价
      var price = $(this).find("[name='price']").html();
      //总数量
      var num = $(this).find("[name='num']").html();
      //当前库存
      var goodsNumber = $(this).find("[name='goodsNumber']").val();
      //当前总价
      // var totalprice =  $(this).find("[name='totalprice']").html();
      var i = new Number(num);
      let totalnum = i - 1;
      if (totalnum <= 0) {
        layer.msg("当前最小数量！");
      } else {
        //设置当前总数量
        $(this).find("[class='nump']").html(totalnum);
        //设置当前总价钱
        var totalprice = Math.floor(price * totalnum * 100) / 100;

        $(this).find("[class='zhong']").html(totalprice);
        sum();
      }
    }
  });
}

//选中商品求和
function sum() {
  //所有总数量
  var totalnum = 0;
  //所有总价钱
  var totalprice = 0;
  $("#Cashlefsit .selected").each(function () {

    //当前总数量
    var num = $(this).find("[name='num']").html();
    totalnum += +num;
    //当前总价
    var price = $(this).find("[name='totalprice']").html();
    totalprice += +price;

  });
  var num = Math.round(totalprice * 100000000) / 100000000
  $("#thisProductTotalnumber").html(totalnum);
  $("#jieshuajie").html(num);
  $("#jieshuajie2").html(num);
}

//清空选中栏

function empty() {
  $("#Cashlefsit").find("[name='selected']").parent().remove();
  GoodsId.splice(0, GoodsId.length);//清空数组
  sum();

}

//点击结算
function closePrice(number) {
  // printJS({
  //   printable: 'bdtext',
  //   type: 'html',
  //   // 继承原来的所有样式
  //   targetStyles: ['*'],
  //   scanStyles: 'css'
  // })
  closes()
  if (GoodsId.length == 0) {
    layer.msg("请选择商品后再进行结算！");
  } else {
    $('#layui-layer_pop2').show();  //显示弹窗
    $('#cover').css('display', 'block'); //显示遮罩层
    $('#cover').css('height', document.body.clientHeight + 'px'); //设置遮罩层的高度为当前页面高度
    var money = $("#jieshuajie2").html();
    if (number) {
      yinshouMoney = number
      $("#yinshou").val(number);
      $("#xianjin").val(number)
      $("#daishou,#zhaoling").val(0);
    } else {
      yinshouMoney = money
      $("#yinshou").val(money);
      $("#xianjin").val(money)
      $("#daishou,#zhaoling").val(0);
    }
    $("#ttuser_descount").val("100")
  }
}

//关闭收银
function closed() {
  $('#layui-layer_pop2').hide();  //关闭弹窗
  $('#cover').css('display', 'none');   //显示遮罩层

}

//清除現金栏数据
function clear_screen() {
  $("#xianjin").val("");
  var yinshou = $("#yinshou").val();
  $("#daishou").val(yinshou);
  $("#zhaoling").val("0.00");
  clearNoNum_collect();
}

function clearNoNum_collect() {
  //取出应收价钱
  var yinshou = $("#yinshou").val();

  var mon = $("#xianjin").val();
  var shou = mon - yinshou;
  console.log(shou)
  var num = Math.round(shou * 100000000) / 100000000
  if (shou == 0) {

    $("#daishou,#zhaoling").val("0.00");
  } else if (shou < 0) {

    $("#daishou").val(Math.abs(num));
    $("#zhaoling").val("0.00");
  } else {
    $("#daishou").val(0);
    $("#zhaoling").val(num);
  }

  if ($("#shouqianba").hasClass('active')) {
    var ttuser_descount = $("#ttuser_descount").val();
    $("#zhaoling,#daishou").val("0.00");
    $("#xianjin").val(yinshou)
  } 

}

//折扣
function clearNoNum_descount() {
  if ($("#ttuser_descount").val() > 100) {
    $("#ttuser_descount").val(100)
  }
  if ($("#ttuser_descount").val() < 1) {
    $("#ttuser_descount").val(1)
  }
  //取出折扣
  var ttuser_descount = $("#ttuser_descount").val();
  //取出应收价钱
  var yinshou = yinshouMoney;
  console.log(yinshouMoney)
  var descount = (ttuser_descount * (yinshou * 100)) / 10000;
  //保留两位小数
  var num = Math.round(descount * 100000000) / 100000000
  // console.log(yinshou, descount, num);
  // $("#xianjin").val("");
  $("#yinshou").val(num);
  $("#daishou").val(num);
  clearNoNum_collect()
  // $("#zhaoling").val($("#xianjin").val());
}

//清空备注
function remark() {
  $("#order_remark").val("");
}

//点击添加金额
function addnum(obj) {
  var number = $(obj).attr('value');
  var num = $("#xianjin").val();
  if (num == "0.00") {
    $("#xianjin").val(number);//填充数据逗号隔开

  } else {
    if (number == ".") {
      if ($('#xianjin').val().indexOf('.') === -1 && $('#xianjin').val().length > 0) {
        $("#xianjin").val(num + ".");//填充数据逗号隔开
      } else {
        return
      }
    } else {
      $("#xianjin").val(num + number);//填充数据逗号隔开
    }

  }
  clearNoNum_collect();

}

// 单独选择收钱吧
function selectshouqian(obj) {
  if (!$('#cash_func_cashbox_mutipos').hasClass('open')) {
    if ($(obj).attr('id') === 'shouqianba') {
      $("#xianjin").attr("disabled","true")
      $('#xianjinname').html('收取价钱')
      clearNoNum_collect()
    } else if ($(obj).attr('id') === 's_cashPay') {
      $("#xianjin").removeAttr("disabled")
      $('#xianjinname').html('现金')
    }
    $('.nowpayType').removeClass('active')
    $(obj).addClass('active')
  }
}

//收钱吧
function shouqianba() {
  if (timeout) {
    clearInterval(timeout)
  }
  if ($('.nowpayType.active').attr('id') === 'shouqianba') {
    shouqianbaluoji(2)
  } else {
    shouqianbaluoji(1)
  }
}

// 收钱吧收钱 逻辑
function shouqianbaluoji(type) {
  //代收金额
  var money = $("#daishou").val();
  //订单备注
  var remark = $("#order_remark").val();
  //订单折扣
  var descount = $("#ttuser_descount").val();
  //现金金额
  var xianjin = $("#xianjin").val();
  //应收金额
  var yinshou = $("#yinshou").val();

  var goodsOrder = [];
  $("#Cashlefsit .selected").each(function () {
    var goodsitem = {};

    //当前总数量
    var num = $(this).find("[name='num']").html();

    //当前总价
    var price = $(this).find("[name='totalprice']").html();

    //当前商品ID
    var goodsid = $(this).find("[name='goodsid']").val();

    goodsitem.price = price;
    goodsitem.goodsId = goodsid;
    goodsitem.num = num;
    goodsOrder.push(goodsitem);
  });

  sqTimer = setInterval(() => {
    if (dayinpaysuccess) {
      dayinpaysuccess = false
      successPrint(dayinpayData)
    }
  }, 100);

  var data = {};
  data.product = JSON.stringify(goodsOrder);
  data.money = money;
  data.remark = remark;
  data.descount = descount;
  data.yinshou = yinshou;
  data.xianjin = xianjin;
  data.type = type
  data.isMechanicsType =  $('#isMechanicsType').hasClass('active') ? 2 : '' 
  data.ageGroup = obj.vueThat.valueAge
  data.sex = obj.vueThat.valueSex
  obj.vueThat.valueSex = 1
  obj.vueThat.valueAge = 1
  if (type === 1) {
    data.change = $('#zhaoling').val()
    $('.loadgin_mask').show()
    $('.loadgin_mask .content p').html('等待出货中...')
  } else {
    data.xianjin = yinshou;
    $('.loadgin_mask').show()
    $('.loadgin_mask .content p').html('加载中...')
  }
  $.ajax({
    method: "POST",
    async: true,    //或false,是否异步
    url: "/checkstand/buygoods",
    data: data,
    success: function (retData) {
      if (type === 1) {
        $('.loadgin_mask').hide()
        if (retData.retCode == 200) {
          closed()
          $('#paySuccess')[0].play()
          dayinpayData = retData.retEntity.ordersNum
          ordersNum = retData.retEntity.ordersNum
          cmbOrderId = retData.retEntity.cmbOrderId
          if ($('#print_button').hasClass('open')) {
            dayinpaysuccess = true
          }
          layer.msg('现金 交易成功')
          setTimeout(() => {
            obj.paysuccess(retData)
          }, 2000);
        } else {
          closed()
          layer.msg(retData.retMsg);
        }
      } else {
        if (retData.retCode == 200) {
          ordersNum = retData.retEntity.ordersNum;
          cmbOrderId = retData.retEntity.cmbOrderId
          // window.open("http://192.168.0.7:3015/dome?url=" + retData.url, "_blank");
          window.localStorage.payStatusShou = true
          window.localStorage.payUrl = retData.retEntity.urlParams
          $('#stop_pay').removeClass('hidden')
          $('.loadgin_mask .content p').html('等待顾客支付中...')
          $('#use_pay')[0].play()
          ispays();
        } else {
          console.error(retData)
          closed()
          layer.msg(retData.retMsg)
        }

      }
    },
    error: function (XMLHttpRequest, tetStatus, errorThrown) {
      $('.loadgin_mask').hide()
      closed()
      layer.msg("请检查网络连接。");
    }
  });
}

function successPrint(data) {
  // alert('调用打印')
  // 打印
  var tempwindow = window.open(); // 先打开页面
  tempwindow.location = location.protocol + '/' + '/' + location.host + '/print?ordersNum=' + data; // 后更改页面地址

};

//查询订单是否支付
function ispays() {
  timeout = setInterval(function () {
    $.ajax({
      method: "POST",
      async: true,    //或false,是否异步
      url: "/checkstand/ispay",
      data: {
        // orderStatusKey: url,
        ordersNum: ordersNum,
        cmbOrderId: cmbOrderId
      },
      success: function (retData) {
        if (retData.retCode == 200) {
          localStorage.removeItem('payStatusShou');
          $('.loadgin_mask').hide()
          closed()
          layer.msg('交易成功')
          $('#paySuccess')[0].play()
          dayinpayData = retData.retEntity.ordersNum
          if ($('#print_button').hasClass('open')) {
            dayinpaysuccess = true
          }
          clearInterval(timeout)
          setTimeout(() => {
            obj.paysuccess(retData)
          }, 2000);
        }
      },
      error: function (res) {
        $('.loadgin_mask').hide()
        localStorage.removeItem('payStatusShou');
        clearInterval(timeout)
        closed()
        layer.msg("支付错误!")
      }
    });
  }, 3000);
}

//打印功能
function print() {
  bdhtml = window.document.body.innerHTML;
  sprnstr = "<!--startprint-->"; //开始打印标识字符串有17个字符
  eprnstr = "<!--endprint-->"; //结束打印标识字符串
  prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17); //从开始打印标识之后的内容
  prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //截取开始标识和结束标识之间的内容
  window.document.body.innerHTML = prnhtml; //把需要打印的指定内容赋给body.innerHTML
  window.print(); //调用浏览器的打印功能打印指定区域
  window.document.body.innerHTML = bdhtml; // 最后还原页面
  //top.layer.closeAll();
}


function closes() {
  // top.layer.closeAll();
  layer.close(layer.index)
}

// 停止当前loadding 收钱吧
function stopPay() {
  $.ajax({
    type: 'POST',
    dataType: "json",
    url: "/checkstand/cancelorder",
    data: {
      ordersNum: ordersNum
    },
    success: function (retData) {
      if (retData.retCode == 200) {
        localStorage.removeItem('payStatusShou');
        clearInterval(sqTimer)
        clearInterval(timeout)
        $('.loadgin_mask').hide()
        $('#stop_pay').addClass('hidden')
      } else {
        layer.msg("发生错误");
      }
    },
    error: function () {
      layer.msg("发生错误");
    }
  });
}

// 折扣部分逻辑
// 打开折扣窗口
function openDiscountPop() {
  $('#layui-layer_pop5,#layui-layer-shade5').removeClass('hidden')
}

function closeDiscountPop() {
  $('#layui-layer_pop5,#layui-layer-shade5').addClass('hidden')
}

function addDiscountNum(object) {
  var number = $(object).attr('data-val');
  var num = $("#discount_value").val();

  if (number == ".") {
    if ($('#discount_value').val().indexOf('.') === -1 && $('#discount_value').val().length > 0) {
      $("#discount_value").val(num + ".");//填充数据逗号隔开
    } else {
      return
    }
  }

  if (discountStatus === 'discount') {
    // 折扣填写
    if (Number(number) != NaN) {
      $("#discount_value").val(num + number)
    }
    if ($("#discount_value").val() > 99) {
      $("#discount_value").val(99)
    }
  } else {
    //金钱填写
    if (Number(number) != NaN) {
      $("#discount_value").val(num + number)
    }
  }
}

function quren_discout() {
  var num = $("#discount_value").val();
  if (num === "") {
    return
  }
  if (discountStatus === 'discount') {
    $('#ttuser_descount').val(num)
    clearNoNum_descount()
    closeDiscountPop()
  } else {
    closePrice(num)
    closeDiscountPop()
  }
}

// 打印开关
function printSelect(obj) {
  if ($(obj).hasClass('open')) {
    $(obj).removeClass('open')

  } else {
    $(obj).addClass('open')

  }
}

// 组合支付
function oepnPay(node) {
  if ($(node).hasClass('open')) {
    $(node).removeClass('open')
    $('.nowpayType').removeClass('active')
    $('#daoshouname').html('待收')
    $('#xianjinname').html('现金')
    $('#s_cashPay').addClass('active')
  } else {
    $(node).addClass('open')
    $('#daoshouname').html('收取价钱')
    $('.nowpayType').addClass('active')
  }
  $('#xianjinname').html('现金')
}

// 修改窗口时 折扣 还是金钱
function Update_money(type) {
  if (type === 'money') {
    discountStatus = 'money'
    $('.ratio_discount').hide()
    $('.money_discount').show()
  } else if (type === 'discount') {
    discountStatus = 'discount'
    $('.ratio_discount').show()
    $('.money_discount').hide()
  }
}

function clearDiscount() {
  $("#discount_value").val($("#discount_value").val().slice(0, $("#discount_value").val().length - 1))
}

// 麦克风
function microphoneClass() {

  // $('.loadgin_mask').show()
  // $('.loadgin_mask .content p').html('请说话...')
  // $('.loadgin_mask .content #stop_speak').removeClass('hidden')

}

function blobToDataURL(blob, callback) {
  let a = new FileReader();
  a.onload = function (e) {
    callback(e.target.result);
  }
  a.readAsDataURL(blob);
}

function dataURLtoFile(dataurl, filename) {
  //将base64转换为文件
  var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

function see_detail(barcode) {
  $.ajax({
    type: 'GET',
    dataType: "json",
    url: "/checkstand/get/shoppingdetail",
    data: {
      barcode: barcode
    },
    success: function (retData) {
      if (retData.retCode == 200) {
        $('.shopping_detail img').attr('src', retData.retEntity.logo)
        $('#effect').html(retData.retEntity.effect || '暂无说明')
        $('#dosage').html(retData.retEntity.dosage || '暂无说明')
        $('#attention').html(retData.retEntity.attention || '暂无说明')
        $('#taboo').html(retData.retEntity.taboo || '暂无说明')
        $('.shopping_detail').show()
        $('#barcodeNum').html(barcode)
      } else {
        layer.msg("发生错误");
      }
    },
    error: function () {
      layer.msg("发生错误");
    }
  });
  $.ajax({
    type: 'GET',
    dataType: "json",
    url: "/checkstand/get/shopping/address",
    data: {
      barcode: barcode,
      isSingle: true
    },
    success: function (retData) {
      let tpl = ''
      if (retData.retCode == 200) {
        retData.retEntity.forEach(element => {
          tpl += ' <p>【' + element.box_code + '柜' + element.z_axis +'层' + element.sort_num +'列】'+ + element.sum +'</p> '
        });
        $('#shoppingAddress').html(tpl)
      } else {
        layer.msg("发生错误");
      }
    },
    error: function () {
      layer.msg("发生错误");
    }
  });
  window.event ? window.event.cancelBubble = true : e.stopPropagation();
}

function timerInver() {
  var qrcode = new QRCode("qrcode",{
      text: "http://www.baidu.com",
      width: 150,
      height: 150,
      colorDark : "#000000",
      colorLight : "#ffffff",
      typeNumber:4,
      correctLevel : QRCode.CorrectLevel.H
  });

  $('.close_qrcode_pop').on("click", function() {
    localStorage.removeItem('payStatusShou');
    $('.qrcode_pop').hide()
  })

  timer = setInterval(() => {
    // 检测需要是否二维码
    if (localStorage.payStatusShou === "true") {
      if (window.localStorage.payUrl) {
        qrcode.clear(); // 清除代码
        qrcode.makeCode(window.localStorage.payUrl); // 生成另外一个二维码
        // var imgUrl = window.localStorage.payUrl
        // $('.qrcode_pop .pop_content img').attr('src', imgUrl)
        $('.qrcode_pop').show()
      }
    } else {
      $('.qrcode_pop').hide()
    }
  }, 3000);
}


window.onload = function () {
  obj.init()
  initData();

  // 引入时间
  setInterval(function () {
    var title = '销售时间：';
    var date = new Date();
    var sign1 = "-";
    var sign2 = ":";
    var year = date.getFullYear() // 年
    var month = date.getMonth() + 1; // 月
    var day = date.getDate(); // 日
    var hour = date.getHours(); // 时
    var minutes = date.getMinutes(); // 分
    var seconds = date.getSeconds() //秒
    var weekArr = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    var week = weekArr[date.getDay()];
    // 给一位数数据前面加 “0”
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (day >= 0 && day <= 9) {
      day = "0" + day;
    }
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    //获取id=Date的标签，加入内容。
    var d = document.getElementById('date_ss');
    d.innerHTML = title + year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds + " " + week;
  }, 1000)

  // 给购买栏 最大高度
  $('.maxbox,#Cashlefsit').css('max-height', window.innerHeight - 350 + 'px')
  // 商品列表 最大高度
  $('.productmorelist').css('max-height', window.innerHeight - 106 + 'px')

  // 右侧栏 高度
  $('.nafrigh2').css('height', $('.naflet').height() + 'px')
  localStorage.removeItem('payStatusShou');
  // 商品列表高度
  $('.productmorelist >li').css('height', $('.main-box').height() - 120 + 'px')
  $('.close_shopping_detail').on('click', function () {
    $('.shopping_detail').hide()
  })

  // 翻页
  $('#next_button').on('click', function () {
    $('.swiper_shooping_list').animate({ scrollLeft: $('.swiper_shooping_list').scrollLeft() + 600 }, 200)
  })

  $('#prev_button').on('click', function () {
    $('.swiper_shooping_list').animate({ scrollLeft: $('.swiper_shooping_list').scrollLeft() - 600 }, 200)
  })

  timerInver()

};

var obj = {
  vueThat: "",
  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {
          showcollect: '进入后台',
          shoppingCount: 1,
          shoppingId: 0,
          shoppingIndex: 1,
          activeMechanicsFalg: false,
          showOrderMessage: false,
          orderMessageFrom: [
            // {
            //   name: '盐酸左氧沙星胶囊',
            //   content: [
            //     {
            //       z: 3,
            //       y: 4
            //     },
            //     {
            //       z: 2,
            //       y: 1
            //     }
            //   ]
            // },
            // {
            //   name: '对乙酰氨基酚混滴剂（泰诺林）',
            //   barcode: "1234567",
            //   content: [
            //     {
            //       z: 3,
            //       y: 4
            //     },
            //     {
            //       z: 2,
            //       y: 1
            //     }
            //   ]
            // }
          ],
          valueSex: 1,
          valueAge: 1
        }
      },
      methods: {
        pageSize: function (val) {
          ShopType({
            id: this.shoppingId,
            pageNum: val,
            pageSize: 40
          })
        },
        isMechanics: function() {
          this.activeMechanicsFalg = !this.activeMechanicsFalg
        }
      },
      mounted: function () {

      },
      watch: {
        tableListdata: function () {

        },
        shoppingCount: function (newVal, oldVal) {
          // console.log(newVal, oldVal)
          if (this.shoppingCount === 0) {
            this.shoppingCount = 1
          }
        }
      }
    });
  },

  paysuccess: function (retData) {
    // 清空商品列表
    $('#Cashlefsit').html('')
    // 重新计算价钱
    sum()
    // 重置搜索框
    $('#queryproduct').val('')
    // 点击全部分类
    $('#allshopping').click()
    // 重置选中 数组
    GoodsId = new Array()
    // 机械出货
    if (retData.retEntity.ordersNum) {
      // 弹出立即出货订单
      obj.vueThat.$children[0].$options.methods.openshipment(ordersNum)

    } else {
      // 人工出货
      obj.vueThat.orderMessageFrom = retData.retEntity
      obj.vueThat.activeMechanicsFalg = false
      obj.vueThat.showOrderMessage = true
    }
  },

  init: function () {
    this.initVue()
  }
}

