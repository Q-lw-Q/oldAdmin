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
    res.render("deskadmin/beOverdueShop");
})

//获取药品信息
router.get('/newdata', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/expiredDrug', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})
router.get('/newdata2', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/fasExpiredDrug', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

//获取药品信息
router.get('/handleData', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/expiredDrugAll', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})
router.get('/handleData1', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/fasExpiredDrugAll', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})
//获取药品信息
router.get('/handleOneData', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/expiredDrugOne', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})
router.get('/handleOneData1', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/goods/fasExpiredDrugOne', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

// //获取药品信息
// router.post('/soldOut', function (req, res, next) {
//     commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/soldOut', false, 'post', req, res, function (retData) {
//         res.send(retData);
//     })
// })
