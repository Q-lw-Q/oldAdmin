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
    res.render("deskadmin/replenishmentDesk");
})

//开始补货
router.post('/start/desk', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/replenishment', true, 'post', req, res, function (retData) {
        res.send(retData);
    })
})

//停止补货
router.post('/stop/desk', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/stop', true, 'post', req, res, function (retData) {
        res.send(retData);
    })
})

//获取药品信息
router.post('/get/desk', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/goodsStock', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})

//设置溯源码
router.post('/get/sourceCode', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/sourceCode', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})

//发送补货
router.post('/post/desk', function (req, res, next) {
    console.log(req.body)
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/replenishmentGoods', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})

//发送补货
router.post('/disc/linaGood', function (req, res, next) {
    console.log(req.body)
    commonReq.singleRequest(contModules.deskHost + '/disc/linaGoods', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})