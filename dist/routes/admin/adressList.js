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
    res.render("admin/adressList");
})

//转跳主页
router.get('/h5', function (req, res, next) {
    res.render("admin/adressListH5");
})

//分页数据获取
router.get('/data', function (req, res, next) {
    commonReq.singleRequest(contModules.shoppingHost + '/stock/goodsAisleList', true, 'get', req, res, function (retData) {
        retData.retEntity.count = retData.retEntity.totalCount
        res.send(retData);
    })
});

//清除轨道数据
router.post('/delete', function (req, res, next) {
    commonReq.singleRequest(contModules.shoppingHost + '/stock/cleanTier', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});


//导出药品库
router.get('/getExcel', function (req, res, next) {
    // commonReq.singleRequest(contModules.shoppingHost + '/stock/export', true, 'get', req, res, function (retData) {
    //     console.log(retData)
    //     // res.send(retData);
    // })
    var token = req.headers.access_token ? req.headers.access_token : req.cookies.token ? req.cookies.token : req.query.accessToken ? req.query.accessToken : req.body.accessToken ? req.body.accessToken : '';
    // var ull = contModules.shoppingHost + "/stock/export";
    var ull = contModules.shoppingHost + '/stock/export'
    // var ull = 'http://192.168.31.171:3015/admin/home/getExcel2'
    request.get({
        url: ull,
        headers: {
            'access_token': token,
            'Content-Type': 'application/octet-stream'
        },
    }).on('response', function (response) {
        this.pipe(res)
    })
})
