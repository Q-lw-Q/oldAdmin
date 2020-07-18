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
    res.render("admin/goodsStockdetail");
})

//分页数据获取  
router.get('/data', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/replenishment', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});
