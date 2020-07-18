var express = require('express');
var router = express.Router();
var commonReq = require('../common/common_request.js');
var contModules = require('../common/cont_modules.js');
var qr = require('qr-image')
var log4js = require('log4js');
var redisConfig = require('../redisConfig.json');
 var client = require('redis-connection-pool')('myRedisPool',redisConfig);
//var redis = require('redis');
module.exports = router;

var buildTradeLogs = log4js.getLogger('buildTrade');
var callBackLogs = log4js.getLogger('tradeCallBack');

/**
 * 页面跳转 (扫二维码后进入的页面)
 */
router.get('/', function (req, res, next) {
    // console.error(req)
    console.log(req.query)
    var redirectUrlId = req.query.redirectUrlId;
   // var client = redis.createClient(contModules.redisHost);
    client.get(redirectUrlId, function (err, data) {

        console.log(err)
        console.log(data)

        if (data) {
            var jsonData = JSON.parse(data);
            console.log(jsonData,'++++++++++++++++++++++++++++++++++')
            //订单状态key
            var orderStatusKey = contModules.keyPrefix.orderPayStatus + jsonData.ordersNum;
            //订单进入支付页面状态
            client.set(orderStatusKey, contModules.ordersPaySatus.showPay);
            client.expire(orderStatusKey, 320);
            var urlParams = "https://qr.shouqianba.com/gateway?" + jsonData.urlParams
            urlParams = encodeURI(urlParams)

            buildTradeLogs.info(jsonData.ordersNum + ":" + urlParams);
            console.log('urlParams++++++++++++++++++++++', urlParams)
            res.writeHead(302, {
                'Location': urlParams
            });
        } else {
            res.send("连接已失效！");
        }

        console.log("++++++++++302++++++++");
        client.del(redirectUrlId, function (err, reply) {
            console.log("删除：" + reply);
        });
        res.end();

    });

    // client.exists('key', function (err, reply) {
    //     if (reply === 1) {

    //     } else {
    //         res.send("订单不存在！");
    //     }
    // });


    // var text ="https://www.baidu.com/s?ie=utf-8&f=3&rsv_bp=0&rsv_idx=1";
    // try {
    //     var code = qr.image(text, { type: 'png' });
    //     res.setHeader('Content-type', 'image/png');  //sent qr image to client side
    //     code.pipe(res);
    // } catch (e) {
    //     res.writeHead(414, {'Content-Type': 'text/html'});
    //     res.end('<h1>414 Request-URI Too Large</h1>');
    // }
});

/**
 * 支付回调(同步回调)
 */
router.get('/payReturl', function (req, res, next) {

    //记录回调参数
    callBackLogs.info("get: payReturl " + (req.header('x-forwarded-for') || req.connection.remoteAddress) + "param :" + JSON.stringify(req.query));
    var retMsg = "";
    if (req.query.status) {

        //支付失败！
        if (req.query.status == "FAIL") {
            retMsg = "支付失败";
        } else if (req.query.status == "SUCCESS") {

            //更新订单状态
            retMsg = "支付成功！";
        }

        // commonReq.singleRequest(contModules.javaBasicUrl + '/trade/updateOrderStatus', true, 'get', req, res, function (retData) {
        //     var retMsg;
        //     if (retData.retCode && retData.retCode != 200) {
        //         retMsg = "支付失败!";
        //     } else {
        //         retMsg = "支付成功!";
        //     }
        //     res.send(retMsg);
        // });
    } else {
        retMsg = "支付失败";
    }
    res.render("afterPay", { data: retMsg });
})

router.post('/notifyUrl', function (req, res, next) {
    callBackLogs.info("post: notifyUrl " + (req.header('x-forwarded-for') || req.connection.remoteAddress) + "param :" + JSON.stringify(req.body));
    res.send("ok");
})

router.post('/payCallback', function (req, res, next) {
    callBackLogs.info("异步回调payCallback" + (req.header('x-forwarded-for') || req.connection.remoteAddress) + "param :" + JSON.stringify(req.body));
    var retMsg = "";
    send("ok");
})