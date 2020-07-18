var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var qr = require('qr-image')
var UUID = require('uuid');
var _ = require('lodash')
// var redis = require('redis');
const http = require('http')

var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool', redisConfig);

var outOrdersDetailsKey = "outOrdersDetailsKey";

module.exports = router;

//生成订单
router.post('/add', function (req, res, next) {
    var postData = {};
    postData.storeCode = req.body.storeCode;
    postData.inquiryNum = req.body.inquiryNum;
    postData.ordersDetails = JSON.stringify(req.body.ordersDetails);
    //postData.ordersDetails = req.body.ordersDetails;
    req.body = postData;
    console.log(postData, '++++++++++++++++++++++++++++');

    commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/add', false, 'post', req, res, function (retData) {
        console.log(retData)
        if (retData.retCode != 200) {
            res.send(retData);
            return;
        }
        // +retData.retEntity.type === 6
        if (+retData.retEntity.type === 4) {
            console.log('-------------------------',111111111111111111111111111111111111111111111111)
            // 内屏直接调用出货
            let toData = {
                req: _.cloneDeep(req),
                res: _.cloneDeep(res),
            }

            toData.req.query.ordersNum = retData.retEntity.ordersNum
            console.log(toData.req.query)
            commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/shipment', true, 'get', toData.req, toData.res, function (newRetData) {
                console.log(newRetData, '-------------------------------------')
                res.send(newRetData)
            })
            return
        }
        var requery = "";
        //跳转收钱吧支付页面需要用到的参数
        requery = retData.retEntity.urlParams;

        //收钱吧支付页面
        var redirectUrl = "https://qr.shouqianba.com/gateway?" + requery;

        //联接rediss
        // var client = redis.createClient(contModules.redisHost);

        var redirectUrlId = UUID.v1().replace(/\-/g, '');
        // client.set(redirectUrlId, redirectUrl);
        client.set(redirectUrlId, JSON.stringify(retData.retEntity));
        client.expire(redirectUrlId, 320);

        //缓存订单状态
        var orderStatusKey = contModules.keyPrefix.orderPayStatus + retData.retEntity.ordersNum;
        //缓存收钱吧支付页面 url
        client.set(orderStatusKey, contModules.ordersPaySatus.build);
        client.expire(orderStatusKey, 320);

        let newreq = _.cloneDeep(req)
        let newres = _.cloneDeep(res)

        let cloud = {
            req: newreq,
            res: newres,
        }



        cloud.req.body.redirectUrlId = redirectUrlId
        cloud.req.body.retEntity = JSON.stringify(retData.retEntity)
        cloud.req.body.orderStatusKey = orderStatusKey
        cloud.req.body.ordersPaySatus = contModules.ordersPaySatus.build

        commonReq.singleRequest(contModules.payQrcode + '/tmi/shopPayRelay/add', false, 'post', cloud.req, cloud.res, function (data) {


            //二维码地址 (路转到我们页面)
            console.log('-----------------','二维码111111111111111111111111')
            var text = contModules.payQrcode + "/pay?redirectUrlId=" + redirectUrlId;
            retData.retEntity.url = text;
            retData.retEntity.urlParams = "";
            res.send(retData);
        })


        // try {
        //     var code = qr.image(text, { type: 'png' });
        //     res.setHeader('Content-type', 'image/png');  //sent qr image to client side
        //     res.setHeader('trade-num',  retData.retEntity.client_sn);  //sent qr image to client side

        //     code.pipe(res);
        // } catch (e) {
        //     console.log("erro："+e);
        //     res.writeHead(414, { 'Content-Type': 'text/html' });
        //     res.end('<h1>414 Request-URI Too Large</h1>');
        // }
    })
});

//虚假的下单
router.get('/add/fictitious', function (req, res, next) {
    new Promise(function (resolve, reject) {
        let array = []
        let postData = {
            ordersDetails: [],
            storeCode: req.query.storeCode
        }
        commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/testGoods', true, 'get', req, res, function (retData) {
            // var postData = {};
            // postData.storeCode = req.body.storeCode;

            // postData.ordersDetails = JSON.stringify(req.body.ordersDetails);
            // req.body = postData;
            if (retData.retCode == 200) {
                for (var i = 0; i < 2; i++) {
                    let num = Math.floor(Math.random() * retData.retEntity.goodsVOS.length)
                    if (array.indexOf(num) == -1) {
                        array.push(num)
                        let qty = Math.ceil(Math.random() * (retData.retEntity.goodsVOS[num].qty / 2))
                        postData.ordersDetails.push({
                            "barcode": retData.retEntity.goodsVOS[num].barcode,
                            "quantity": qty
                        })
                    }
                }
                postData.ordersDetails = JSON.stringify(postData.ordersDetails)
                resolve(postData)
            } else {
                reject()
            }
        })
    }).then(function (postData) {
        req.body = postData
        commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/tetsorder', false, 'post', req, res, function (retData) {
            res.send(retData)
        })
    }).catch(function () {
        res.send({
            retCode: 0,
            retMsg: '失败'
        })
    })
});

//生成体检订单
router.post('/addPhy', function (req, res, next) {

    var postData = {};
    postData.storeCode = req.body.storeCode;

    //    postData.ordersDetails =req.body.ordersDetails;
    var ordersDetails = [{ 'barcode': '10000', 'quantity': '1' }]
    postData.ordersDetails = JSON.stringify(ordersDetails);
    req.body = postData;
    commonReq.singleRequest(contModules.javaBasicUrl + '/trade/physicalAdd', false, 'post', req, res, function (retData) {
        if (retData.retCode != 200) {
            res.send(retData);
            return;
        }
        var requery = "";
        // console.log(retData);
        //跳转收钱吧支付页面需要用到的参数
        requery = retData.retEntity.url;

        //收钱吧支付页面
        // var redirectUrl = "https://qr.shouqianba.com/gateway?" + requery;

        //联接rediss
        // var client = redis.createClient(6379, '127.0.0.1');
        // var client = redis.createClient(contModules.redisHost);
        var redirectUrlId = UUID.v1().replace(/\-/g, '');
        //缓存收钱吧支付页面 url
        // client.set(redirectUrlId, redirectUrl);
        client.set(redirectUrlId, JSON.stringify(retData.retEntity));
        client.expire(redirectUrlId, 320);

        //缓存订单状态
        var orderStatusKey = contModules.keyPrefix.orderPayStatus + retData.retEntity.ordersNum;
        client.set(orderStatusKey, contModules.ordersPaySatus.build);
        client.expire(orderStatusKey, 320);
        //二维码地址 (路转到我们页面)
        var text = "http://app.jekjk.com/pay?redirectUrlId=" + redirectUrlId;
        retData.retEntity.url = text;
        retData.retEntity.urlParams = "";
        res.send(retData);
    })
});

//终端查询商品订单支付状态
router.get('/tradeStatus', function (req, res, next) {
    console.log(9999999999999999999)
    var ordersNum = req.query.ordersNum;
    // let newreq = req
    if (!ordersNum) {
        var result = {
            "retCode": 620,
            "retMsg": "订单不存在!",
            "retEntity": null
        }
        res.send(result);
        return;
    }
    //订单状态key
    var orderStatusKey = contModules.keyPrefix.orderPayStatus + ordersNum;
    //联接rediss
    // var client = redis.createClient(contModules.redisHost);
    client.get(orderStatusKey, function (err, data) {
        console.log(data, '+++++++++++++')
        // console.log(orderStatusKey+"------------")
        // console.log(data+"----------++++++--")
        // 用户进入支付页订单没完成则要进入后台查询。
        if (data == contModules.ordersPaySatus.showPay) {

            //订单状态设置为处理中使得当前只能有一个请求进入后台处理订单
            client.set(orderStatusKey, contModules.ordersPaySatus.process);
            // console.log("+++++++++++++++++++++++++22222222222222")
            //订单进入支付页面状态
            commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/payStatus', true, 'get', req, res, function (retData) {
                console.log(retData, '+++++++++++++++++++')
                if (retData.retCode == 200) {
                    client.set(orderStatusKey, contModules.ordersPaySatus.end);
                    // res.send({
                    //     "retCode": 645, // 订单支付成功
                    //     "retMsg": "订单已经支付成功，请调用出货接口!",
                    // })
                } else {
                    client.set(orderStatusKey, contModules.ordersPaySatus.showPay);
                }
                res.send(retData);
            })

        } else if (data == contModules.ordersPaySatus.process) {
            var result = {
                "retCode": 641,
                "retMsg": "接口查询中，请不要重复查询!",
            }
            // console.log(result)
            res.send(result);
        } else if (data == contModules.ordersPaySatus.build) {

            let newreq = _.cloneDeep(req)
            let newres = _.cloneDeep(res)
            let cloud = {
                req: newreq,
                res: newres,
            }
            cloud.req.query.ordersNum = ordersNum

            commonReq.singleRequest(contModules.payQrcode + '/tmi/shopPayRelay/tradeStatus', true, 'get', cloud.req, cloud.res, function (data) {

                if (data.retCode == contModules.ordersPaySatus.showPay) {
                    // 用户 已经进入支付页面
                    client.set(orderStatusKey, contModules.ordersPaySatus.showPay);
                    client.expire(orderStatusKey, 320);
                }
                var result = {
                    "retCode": 622,
                    "retMsg": "展示支付码(用户还未进入支付页)!",
                }
                // console.log(result)
                res.send(result);

            })
        } else if (data == contModules.ordersPaySatus.paySuccess) {
            console.log(22222222222222222222222222222222)
            // commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/selectOrderStatus', true, 'get', req, res, function (retData) {
            //     console.log(retData)
            //     if (retData.retCode == 200) {
            //         client.set(orderStatusKey, contModules.ordersPaySatus.end);
            //     }
            //     res.send(retData)
            // })
        } else if (data == contModules.ordersPaySatus.end) {
            res.send({ retCode: 200, retMsg: 'OK', retEntity: { status: 1 } })
        }
    })
});

router.get('/shipmentStatus', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/shipmentStatus', true, 'get', req, res, function (retData) {
        console.log(retData)
        res.send(retData)
    })
})

//终端查询体检订单支付状态
router.get('/selectPhyOrderStatus', function (req, res, next) {
    console.log("+++++++++++++!!!!!!!!!!!!!!!!!!!!")
    var ordersNum = req.query.ordersNum;
    if (!ordersNum) {
        var result = {
            "retCode": 620,
            "retMsg": "订单不存在!",
            "retEntity": null
        }
        res.send(result);
        return;
    }

    //订单状态key
    var orderStatusKey = contModules.keyPrefix.orderPayStatus + ordersNum;

    //联接rediss
    // var client = redis.createClient(contModules.redisHost);
    client.get(orderStatusKey, function (err, data) {
        if (data == contModules.ordersPaySatus.showPay) {
            //订单进入支付页面状态
            commonReq.singleRequest(contModules.javaBasicUrl + '/trade/selectPhyOrderStatus', true, 'get', req, res, function (retData) {
                console.log(retData);

                res.send(retData);
            })
        } else {
            var result = {
                "retCode": 622,
                "retMsg": "展示支付码(用户还未进入支付页)!",
            }
            console.log(result);
            res.send(result);
        }
    })

});

router.post('/finish', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/finish', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

/**
 * 体检数据添加
 */
router.post('/addPhyDate', function (req, res, next) {
    var phydata = JSON.stringify(req.body);
    req.body["phydata"] = phydata;
    commonReq.singleRequest(contModules.javaBasicUrl + '/physical/add', false, 'post', req, res, function (retData) {
        //console.log(retData);
        res.send(retData);
    })
});

/**
 * 支付用户邦定手机号码
 */
router.post('/bindPhone', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/orders/bindPhone', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

/**
 * 发送手机短信
 */
router.post('/sendNote', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/note/physical', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});



//终端查询商品出货状态(此方案一般不启用)
router.get('/selectGoodsOutStatus', function (req, res, next) {
    client.get(outOrdersDetailsKey, function (err, data) {
        if (data) {
            //订单进入支付页面状态
            res.send(result);
        } else {
            var result = {
                "retCode": 666,
                "retMsg": "不未出货完成!",
            }
            res.send(result);
        }
    })
});

// 获取安卓版本信息
router.get('/getAndroidVersion', function (req, res, next) {
    client.get('Token', function (err, data) {
        req.headers['access_token'] = JSON.parse(data)
        console.log(contModules.merchantHost + '/tmi/trade/edtion')
        commonReq.singleRequest(contModules.merchantHost + '/tmi/trade/edtion', true, 'get', req, res, function (retData) {
            console.log(retData, '++++++++++++++++++123')
            if (retData.retEntity && retData.retEntity.apk_file_url) {
                retData.retEntity.apk_file_url = contModules.merchantHost + retData.retEntity.apk_file_url
                console.log(retData)
                res.send(retData);
            } else {
                res.send({
                    retCode: -1
                })
            }
        })
    })
})