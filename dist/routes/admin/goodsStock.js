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
    res.render("admin/goodsStock");
})

//分页数据获取  
router.get('/data', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/primary', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});

// 补货
router.post('/addData', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/replenishment', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

//  停止补货
router.post('/stop', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/stop', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

//  手动补货
router.post('/handadd', function (req, res, next) {
    commonReq.singleRequest(contModules.nodeBasicUrl + '/stock/disc', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

// 作废订单
router.post('/replenishment', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/replenishmentStatus', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});
