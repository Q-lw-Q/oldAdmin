var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var redis = require('redis');
var moment = require('moment');

module.exports = router;

//撤单接口
// router.post('/revoke', function (req, res, next) {
//     var ordersNum=req.body.ordersNum;
//     var orderStatusKey = contModules.keyPrefix.orderPayStatus + ordersNum;

//     //联接rediss
//     var client = redis.createClient(contModules.redisHost);
//     client.get(orderStatusKey, function (err, data) {
//         if (data == contModules.ordersPaySatus.showPay) {
//             //订单进入支付页面状态
//             commonReq.singleRequest(contModules.javaBasicUrl + '/orders/revoke', false, 'post', req, res, function (retData) {
//                 res.send(retData);
//             })
//         } else { 
//             var result = {
//                 "retCode": 200,
//                 "retMsg": "",
//             }
//             res.send(result);
//         }
//     })



// });
router.post('/mobile', function (req, res, next) {
    // var ordersNum=req.body.ordersNum;
    // var orderStatusKey = contModules.keyPrefix.orderPayStatus + ordersNum;

    // //联接rediss
    // var client = redis.createClient(contModules.redisHost);
    // client.get(orderStatusKey, function (err, data) {
    //     if (data == contModules.ordersPaySatus.showPay) {
            //订单进入支付页面状态
            commonReq.singleRequest(contModules.javaBasicUrl + '/revoke/mobile', false, 'post', req, res, function (retData) {
                res.send(retData);
            })
    //     } else { 
    //         var result = {
    //             "retCode": 200,
    //             "retMsg": "",
    //         }
    //         res.send(result);
    //     }
    // })
});
