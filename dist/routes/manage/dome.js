var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var request = require('request')
var redis = require('redis');
module.exports = router;

router.get('/', function (req, res, next) {
    var data = {};
    var ull = contModules.javaBasicUrl + "/shop/qrcode";
    if (req.query) {
        var requery = "?";
        for (var key in req.query) {
            // requery+=('&'+key+'='+req.query[key]);
            requery += ('&' + key + '=' + encodeURIComponent(req.query[key]));
        }
        ull = ull + requery;
    }
    request.get({
        url: ull,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
    }).on('response', function (response) {
        console.log(res)
        this.pipe(res)
    });
});


//查询支付状态
router.post('/ispay', function (req, res, next) {
    var redirectUrlId = req.query.redirectUrlId;
    var client = redis.createClient(contModules.redisHost);
    client.get(redirectUrlId, function (err, data) {
        console.log("+++++++++++++++++++++++++");
        console.log('Location：' + data);
        console.log("+++++++++++++++++++++++++");

        if (data) {
            var jsonData = JSON.parse(data);

            //订单状态key
            var orderStatusKey = contModules.keyPrefix.orderPayStatus + jsonData.ordersNum;
            //订单进入支付页面状态
            console.log(orderStatusKey)
        } else {
            res.send("连接已失效！");
        }

        console.log("++++++++++302++++++++");
        client.del(redirectUrlId, function (err, reply) {
            console.log("删除：" + reply);
        });
        res.end();

    });
});

