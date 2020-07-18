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
    res.render("admin/inventoryList");
})

//分页数据获取
router.get('/data', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/inventory', true, 'get', req, res, function (retData) {
        client.get('prescriptionStatus',function (err, data) {
            if (!data) {
                client.set('prescriptionStatus','0')
            }
            retData.prescriptionStatus = data
            res.send(retData);
        })
    })
});


//下架商品
router.get('/lowershopping', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/soldOut', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});

//修改库存
router.post('/editQuantity', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/amend', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

//同步云端库存
router.get('/update/shoppingNum', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/updatestockg', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});

//同步助码器
router.get('/triggerEs', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/triggerEs', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});

//同步商品信息
router.get('/shopUpdate', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/shopUpdate', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});

//导出药品库
router.get('/getExcel', function (req, res, next) {
    var token = req.headers.access_token ? req.headers.access_token : req.cookies.token ? req.cookies.token : req.query.accessToken ? req.query.accessToken : req.body.accessToken ? req.body.accessToken : '';
    var ull = contModules.javaBasicUrl + "/backstage/export";
    request.get({
        url: ull,
        headers: {
            'access_token': token,
            'Content-Type': 'application/octet-stream'
        },
    }).on('response', function (response) {
        console.log(res)
        this.pipe(res)
    })
})

//修改开关
router.post('/editPrescription', function (req, res, next) {
    client.get('prescriptionStatus',function (err, olddata) {
        client.set('prescriptionStatus',req.body.key)
        res.send({
            retCode: 200,
            alert: '修改成功'
        })
    })
});