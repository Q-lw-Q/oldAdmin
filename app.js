var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var log4js = require('log4js');
log4js.configure("./log4jsConfig.json");
var commonReq = require('./common/common_request.js');
var contModules = require('./common/cont_modules.js');
// var redisConfig = require('./redisConfig.json');
// var client = require('redis-connection-pool')('myRedisPool',redisConfig);
// var redis = require('redis');

var compression = require('compression');


//后台管理路由文件


var pay = require('./routes/pay'); //支付

//终端接口路由文件
var tGoods = require('./routes/terminal/goods'); //终端页面主页
var tmiAccount = require('./routes/terminal/tmAccount'); //终端账号
var tmiTrade = require('./routes/terminal/trade'); //终端订单
var tmiMeter = require('./routes/terminal/meter'); //终端测量数据上传
var box = require('./routes/terminal/box'); //捕获APP接口
var replenishment = require('./routes/terminal/replenishment'); //补货APP接口
var revoke = require('./routes/terminal/revoke'); //撤单APP接口
var stock = require("./routes/terminal/stock"); //2.0 自动仓库库存
//人脸识别
var faceRec = require('./routes/terminal/faceRec'); //上传人脸数据
//收银首页
var checkstand = require('./routes/manage/checkstand'); //收银首页
//购物车测试
var dome = require('./routes/manage/dome');
//后台首页
var home = require('./routes/admin/home');
//广告页 and 收费页
var payqrcode = require('./routes/manage/payqrcode');
//库存管理（补货通道）
var goodsStock = require('./routes/admin/goodsStock');
//库存（补货详细列表）
var goodsStockdetail = require('./routes/admin/goodsStockdetail');
//交接班记录
var shredding_records = require('./routes/admin/shredding_records');
//订单管理
var orderManagement = require('./routes/admin/orderManagement');
// 异常订单管理
var exceptionOrder = require('./routes/admin/exceptionOrder');
// 异常列表
var abnormalList = require('./routes/admin/abnormalList');

//用户管理
var userManagement = require('./routes/admin/user_management');
//库存列表
var inventoryList = require('./routes/admin/inventory_list');
//错误商品列表
var shopErrorList = require('./routes/admin/shopErrorList');
//库存位置列表
var adressList = require('./routes/admin/adressList');
//广告页
var advertisement = require('./routes/admin/advertisement');
var advertisementbaa = require('./routes/admin/advertisementbaa');
//登陆主页面
var adminLogin = require('./routes/admin/adminLogin');
var deskadminLogin = require('./routes/deskadmin/deskadminLogin');
//商品列表
var shoppingdetails = require('./routes/admin/shoppingdetails');
// 商品价格
var shoppingprice = require('./routes/admin/shoppingprice')

// 咨询token认证
var rtctoken = require('./routes/admin/rtctoken');

//打印页面
var print_dolop = require('./routes/manage/print_dolop');

// h5智能问诊
var aiInterrogation = require('./routes/android/aiInterrogation');

// 补货台
var replenishmentDesk = require('./routes/deskadmin/replenishmentDesk');
var rengongpanku = require('./routes/deskadmin/rengongpanku');
var deskDetailOrder = require('./routes/deskadmin/deskDetailOrder');
var deskDetail = require('./routes/deskadmin/deskDetail');
var soketDetail = require('./routes/deskadmin/soketDetail');





var app = express();
app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'private')));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'plugins')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(express.static('../vending-node/public')); //主后台node的态静文件目录

//判断是否有token
var token = ""
// 判断cookie 中是否有这二个值 否则 视为未登陆
// userName
// userType

// 所有用户可以访问login
// 访问其他页而需要权限验证
app.all('*', function (req, res, next) {
  // 思路：
  // 得到请求的url
  // 然后得到request的cookie，根据cookie得到当前登陆的用户
  // 判断用户对应url的权限
  // console.log(123)
    next();
    return;

  var jsPattern = /\.js$/;
  var url = req._parsedUrl.pathname; // req.originalUrl;

  if (jsPattern.test(url)) {
    // 公共部分，放行
    next();
    return;
  }
  var urlLists = []; //免认证的url
  urlLists.push("/manage/user/login"); //登陆页
  urlLists.push("/tmi/tac/login"); //登陆页
  urlLists.push("/pay");
  urlLists.push("/payqrcode");
  urlLists.push("/checkstand/shop/advertising")
  urlLists.push("/pay/payReturl");
  urlLists.push("/pay/payCallback");
  urlLists.push("/pay/notifyUrl");
  urlLists.push("/out/discern/goods");
  urlLists.push("/adminLogin")
  urlLists.push("/deskadminLogin")
  urlLists.push("/adminLogin/login")
  urlLists.push("/admin/home/upload")
  urlLists.push("/tmi/trade/getAndroidVersion")

  urlLists.push("/aiInterrogation")
  urlLists.push("/aiInterrogation/Mobileseek")  
  urlLists.push("/aiInterrogation/get/shoppingdetail")  

  for (i in urlLists) {
    if (urlLists[i] == url) {
      next();
      return;
    }
  }
  var token = req.headers.access_token ? req.headers.access_token : req.headers["access-token"] ? req.headers["access-token"] : req.cookies.token ? req.cookies.token : '';

  if (token) {
    req.headers["access_token"] = token;
    var verifyReq = {
      headers: {
        access_token: token,
        appid: req.headers['appid'] ? (req.headers['appid']) : ''
      },
      query: {
        url: url
      }
    };
    var verifyRes = res;

    // let urlListtype = []
    // urlListtype.push('/admin/rtctoken')

    // for (i in urlListtype) {
    //   if (urlListtype[i] == url) {
    //     client.get('userType',function(err, userType) {
    //       console.log(userType , '++++++++++++++++')
    //       if (userType > 2) {
    //         res.render("erro", {
    //           msg: '权限不足',
    //           type: '2',
    //           pageName: "首页"
    //         });
    //         return
    //       }
    //     })
    //   }
    // }
    console.log(123)
    //验证是否有访问权限
    commonReq.singleRequest(contModules.javaBasicUrl + '/sysRolesFunctions/selectFuncByRoleKey', true, 'get', verifyReq, verifyRes, function (data) {
      console.log(123456,data)
      if (data.retCode == 200 || data.retCode == 210) { //权限验证通过
        if (!req.xhr) { //非 ajax 请求，页面请求則要加入侧导航要栏数据 navigation
          req.navigation = data.retEntity;
        }
        next();
      } else if (data.retCode == 211 || data.retCode == 202) {
        var appid = req.headers.appid;
        if (req.xhr || appid) { //ajax 请求則返回所有信息
          res.send(data);
        } else { //页面请求則返回错误页。
          res.render("erro", {
            msg: data.retMsg
          });
        }
        return;
      }
    })
  } else {
    var appid = req.headers.appid;
    if (req.xhr || appid) { //ajax 请求則返回所有信息
      res.send({
        retCode: 211,
        retMsg: ''
      });
    } else { //页面请求則返回错误页。
      res.render("erro", {
        msg: '请先登录',
        type: '1',
        pageName: "登录页"
      });
    }
    return;
  }
});

//后台管理界面路由

app.use('/pay', pay);

//终端接口路由文件
app.use('/tmi/goods', tGoods); //终端页面主页
app.use('/tmi/tac', tmiAccount); //终端登陆相关
app.use('/tmi/trade', tmiTrade); //终端交易
app.use('/tmi/meter', tmiMeter); //终端测量数据
app.use('/tmi/box', box); //捕获app接口
app.use('/tmi/replenishment', replenishment); //补货app接口
app.use('/tmi/revoke', revoke); //补货app接口
app.use('/tmi/stock', stock); //补货app接口添加库存 2.0 自动仓库
app.use('/tmi/faceRec', faceRec); //人脸识别
app.use('/checkstand', checkstand); //收银首页     
app.use('/dome', dome); //购物车测试
app.use('/admin/home', home); //后台首页
app.use('/payqrcode', payqrcode) //广告 和 收费页
app.use('/admin/advertisement', advertisement) //广告管理
app.use('/admin/advertisementbaa', advertisementbaa) //广告管理
app.use('/admin/goodsStock', goodsStock) //补货管理 
app.use('/admin/goodsStockdetail', goodsStockdetail) //补货详细数据
app.use('/admin/records', shredding_records) //交接班记录
app.use('/admin/orderManagement', orderManagement) //订单管理
app.use('/admin/exceptionOrder', exceptionOrder) //异常订单管理
app.use('/admin/userManagement', userManagement) //用户管理
app.use('/admin/inventoryList', inventoryList) //库存列表
app.use('/admin/shopErrorList', shopErrorList) //库存列表
app.use('/admin/adressList', adressList) //库存位置列表
app.use('/adminLogin', adminLogin) //登陆主页面
app.use('/deskadminLogin', deskadminLogin) //登陆主页面
app.use('/admin/shopping', shoppingdetails) //商品详细信息
app.use('/admin/rtctoken', rtctoken) //咨询token认证
app.use('/print', print_dolop) //打印页
app.use('/aiInterrogation', aiInterrogation) //h5AI问诊
app.use('/admin/abnormalList', abnormalList) //异常列表
app.use('/admin/shoppingprice', shoppingprice) //商品详细信息

app.use('/deskadmin/index', replenishmentDesk) //补货台
app.use('/deskadmin/stock', rengongpanku) //补货台
app.use('/deskadmin/deskDetailOrder', deskDetailOrder) //补货台
app.use('/deskadmin/soketDetail', soketDetail) //补货台
app.use('/deskadmin/deskDetail', deskDetail) //补货台

//模板 star
app.set('', path.join(__dirname, 'views'));
app.engine('html', require('express-art-template'));
app.set('view engine', 'html');
//模板 end

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  // next(createError(404));
  res.send('404....此页面不存在！');
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('服务出错！' + JSON.stringify(err));
});

module.exports = app;