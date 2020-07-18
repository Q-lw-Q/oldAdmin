var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var request = require('request')
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool', redisConfig);
module.exports = router;


//转跳主页
router.get('/', function (req, res, next) {
    res.render("print_dolop");
})

//打印数据初始化
router.post('/data', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/shop/orderDetails', false, 'post', req, res, function (retData) {
    retData.retEntity.fullName = req.cookies.userName
    res.send(retData);
  })
})
