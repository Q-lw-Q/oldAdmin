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
    res.render("deskadmin/soketDetail");
})

//获取药品信息
router.get('/newdata', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/newInventory', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

//获取药品信息
router.get('/handleData', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/updatestockg', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

//获取药品信息
router.post('/soldOut', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/soldOut', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})
