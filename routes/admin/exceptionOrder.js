var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var request = require('request')
var redis = require('redis');
module.exports = router;


//转跳主页
router.get('/', function (req, res, next) {
    res.render("admin/exceptionOrder");
})

//获取商品
router.get('/data', function (req, res, next) {
  commonReq.singleRequest(contModules.shoppingHost + '/stock/selectOrdersBoxCell', true, 'get', req, res, function (retData) {
      res.send(retData);
  })
})


//商品 确认拿出
router.get('/updateBoxCell', function (req, res, next) {
  commonReq.singleRequest(contModules.shoppingHost + '/stock/updateBoxCell', true, 'get', req, res, function (retData) {
      res.send(retData);
  })
})