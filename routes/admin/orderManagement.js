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
    res.render("admin/orderManagement");
})


//分页数据获取
router.get('/data', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/allorder', true, 'get', req, res, function (retData) {
      res.send(retData);
  })
});

//退款
router.post('/refund', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/zsRefund', false, 'post', req, res, function (retData) {
      res.send(retData);
  })
});

//查看详情
router.post('/ordersDetails', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/ordersDetails', false, 'post', req, res, function (retData) {
      res.send(retData);
  })
});

//出货
router.get('/orderShipment', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/shipment', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});


