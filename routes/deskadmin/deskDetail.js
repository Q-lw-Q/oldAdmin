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
    res.render("deskadmin/deskDetail");
})

//获取药品信息
router.post('/newdata', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/replenishmentRecord', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})

//获取药品信息
router.get('/handleData', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/updatestockg', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

// 作废订单
router.post('/replenishment', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/replenishmentStatus', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});
