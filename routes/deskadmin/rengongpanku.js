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
    res.render("deskadmin/rengongpanku");
})

//开始盘库
router.get('/postStock', function (req, res, next) {
    console.log(req.body)
    commonReq.singleRequest(contModules.javaBasicUrl + '/check/userCheck', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

//开始盘库
router.post('/post/check', function (req, res, next) {
    console.log(req.body)
    commonReq.singleRequest(contModules.javaBasicUrl + '/check/correction', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})