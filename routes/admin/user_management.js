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
    res.render("admin/user_management");
})

//添加用户
router.post('/addManagement', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/home/add', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

//修改密码
router.post('/edit', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/home/edit', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});


//删除用户
router.post('/delete', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/home/delete', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});


//修改用户邮箱推送
router.get('/receiveremail', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/receiveremail', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});


//用户列表
router.get('/data', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/home/allStaff', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});