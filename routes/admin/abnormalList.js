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
    res.render("admin/abnormalList");
})

//获取商品
router.get('/data', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/abnormal/list', true, 'get', req, res, function (retData) {
      res.send(retData);
  })
})

//获取商品
router.get('/relievepush', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/relievepush', true, 'get', req, res, function (retData) {
      res.send(retData);
  })
})

//获取报警轨道列表
router.get('/freeze/data', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/abnormal/freezelist', true, 'get', req, res, function (retData) {
      res.send(retData);
  })
})

//获取报警轨道列表
router.get('/freeze/unfreeze', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/abnormal/unfreeze', true, 'get', req, res, function (retData) {
      res.send(retData);
  })
})
