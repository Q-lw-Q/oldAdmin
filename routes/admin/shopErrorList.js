var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var request = require('request')
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool',redisConfig);
module.exports = router;


//转跳主页
router.get('/', function (req, res, next) {
    res.render("admin/shopErrorList");
})

//分页数据获取
router.get('/data', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/shopAbnormal', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});


//本地同步云端
router.get('/inventoryDetection', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/inventoryDetection', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});


//本地同步云端
router.get('/cellLocation', function (req, res, next) {
    commonReq.singleRequest(contModules.shoppingHost + '/boxCell/cellLocation', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});


//异常是否处理
router.get('/isSolve', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/isSolve', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});
