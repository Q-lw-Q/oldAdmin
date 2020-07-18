var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var UUID = require('uuid');
var redis = require('redis');
const http = require('http')
var ws = require("nodejs-websocket");
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool', redisConfig);
var _ = require('lodash')

module.exports = router;

//转跳主页
router.get('/', function (req, res, next) {
    res.render("checkstand");
})

//主页数据获取
router.get('/data', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/index', true, 'get', req, res, function (retData) {
        console.log("!@421421412421142")
        // client.get('stockIsNull',function (err, data) {
        //     console.log(data,'++++++++++++++++++++++++++++++++++')
        //     if (data) {
        //         retData.retEntity.showZeor = 1
        //     } else {
                
        //     }
            res.send(retData);
        // })
    })
});

router.get('/editZero', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/index', true, 'get', req, res, function (retData) {
        console.log(retData, "asoidfasiofhisoahfasiohsaoihfasoi")
        client.get('stockIsNull',function (err, data) {
            if (data) {
                client.del('stockIsNull', function (err, reply) {

                });
            } else {
                client.set('stockIsNull','1')                
            }
            res.send({
                retCode: 200
            });
        })
    })
});

//主页分类数据获取
router.post('/classify', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/classify', false, 'post', req, res, function (data) {
        res.send(data);
    })
});

//主页搜索数据获取
router.post('/seek', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/seek', false, 'post', req, res, function (data) {
        res.send(data);
    })
});

//生成订单
router.post('/buygoods', function (req, res, next) {
    console.log(req.body);
    req.body.ordersDetails = req.body.product;

    var type = req.body.type
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/buygoods', false, 'post', req, res, function (retData) {
        if (type == 1 || retData.retCode != 200) {
            res.send(retData)
            return
        }

        var requery = "";
        // console.log(retData);
        //跳转收钱吧支付页面需要用到的参数
        requery = retData.urlParams;
        //redis连接
        // var client = redis.createClient(contModules.redisHost);
        var redirectUrlId = UUID.v1().replace(/\-/g, '');
        //缓存收钱吧支付页面 url

        client.set(redirectUrlId, JSON.stringify(retData.retEntity));
        client.expire(redirectUrlId, 320);
        //缓存订单状态

        var orderStatusKey = contModules.keyPrefix.orderPayStatus + retData.retEntity.ordersNum;
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
            console.log(data)
            //二维码地址 (路转到我们页面)
            var text = contModules.payQrcode + "/pay?redirectUrlId=" + redirectUrlId;
            retData.url = text;
            retData.urlParams = "";
            retData.orderStatusKey = orderStatusKey;
            res.send(retData);
        })
    })
});

//查询支付状态
router.post('/ispay', function (req, res, next) {
    // console.log(req.body)
    // var ordersNum = req.body.ordersNum;
    // var orderStatusKey = contModules.keyPrefix.orderPayStatus + ordersNum;
    // console.log(orderStatusKey)
    //  var client = redis.createClient(contModules.redisHost);
    // client.get(orderStatusKey, function (err, data) {
    //     // if (data) {
    //     if (data == contModules.ordersPaySatus.showPay) {
    //         console.log("进来了")
    //         // data为 2 进入支付页面
    //     } else if (data == contModules.ordersPaySatus.process) {
    //         // 订单出货处理中
    //         let objdata = {
    //             'retData': -1,
    //             "retMsg": "订单出货处理中!",
    //         }
    //         res.send(objdata);
    //     } else if (data == contModules.ordersPaySatus.build) {
    //         let newreq = _.cloneDeep(req)
    //         let newres = _.cloneDeep(res)
    //         let cloud = {
    //             req: newreq,
    //             res: newres,
    //         }

    //         cloud.req.query.ordersNum = ordersNum

    //         commonReq.singleRequest(contModules.payQrcode + '/tmi/shopPayRelay/tradeStatus', true, 'get', cloud.req, cloud.res, function (data) {
    //             console.log(data)
    //             if (data.retCode == contModules.ordersPaySatus.showPay) {
    //                 // 用户 已经进入支付页面
    //                 client.set(orderStatusKey, contModules.ordersPaySatus.showPay);
    //                 client.expire(orderStatusKey, 320);
    //             } else {
    //                 let objdata = {
    //                     "retCode": 622,
    //                     "retMsg": "展示支付码(用户还未进入支付页)!",
    //                 }
    //                 // console.log(result)
    //                 res.send(objdata);
    //             }
    //         })
    //     }
    //     // } else {
    //     //     let objdata = {
    //     //         'retData': -1,
    //     //     }
    //     //     res.send(objdata);
    //     //     console.log(objdata)
    //     // }
    // });
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/selectOrderStatus', false, 'post', req, res, function (data) {
        res.send(data);
    })
});

//广告页 and 收费页
router.post('/shop/advertising', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/advertising', false, 'post', req, res, function (data) {
        let newData = {}
        newData.img = data.img
        // newData.ip = "http://" + data.ip + ":8082"
        // console.error(newData)
        res.send(newData);
    })
});

//麦克风录取
router.post('/shop/mp3', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/mp3', false, 'post', req, res, function (data) {
        res.send(data);
    })
});

//商品详情
router.get('/get/shoppingdetail', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/goodsDetail', true, 'get', req, res, function (data) {
        res.send(data);
    })
});

router.get('/get/shopping/address', function (req, res, next) {
    commonReq.singleRequest(contModules.shoppingHost + '/boxcell/cellLocation', true, 'get', req, res, function (data) {
        res.send(data);
    })
});

//二维码
// router.get('/shop/qrcode', function (req, res, next) {
//     console.error('++++++++++++++++++++++++++')
//     console.error(req)
//     console.error(res)
//     commonReq.singleRequest(contModules.javaBasicUrl + '/shop/qrcode', true, 'GET', req, res, function (data) {
//         // console.error(data)
//         res.send(data);
//     })
// });


const server = http.createServer((req, res) => {
    res.end('hello world');
}).listen(3016)

server.on('upgrade', (req, client, head) => {
    const headers = _getProxyHeader(req.headers) //将客户端的websocket头和一些信息转发到真正的处理服务器上
    headers.hostname = 'iat-api.xfyun.cn' //目标服务器
    headers.path = 'wss://iat-api.xfyun.cn/v2/iat' //目标路径 
    headers.port = 3017
    const proxy = http.request(headers) //https可用https，headers中加入rejectUnauthorized=false忽略证书验证
    proxy.on('upgrade', (res, socket, head) => {
        client.write(_formatProxyResponse(res))//使用目标服务器头信息响应客户端
        client.pipe(socket)
        socket.pipe(client)
    })
    proxy.on('error', (error) => {
        client.write("Sorry, cant't connect to this container ")
        return
    })
    proxy.end()
    function _getProxyHeader(headers) {
        const keys = Object.getOwnPropertyNames(headers)
        const proxyHeader = { headers: {} }
        keys.forEach(key => {
            if (key.indexOf('sec') >= 0 || key === 'upgrade' || key === 'connection') {
                proxyHeader.headers[key] = headers[key]
                return
            }
            proxyHeader[key] = headers[key]
        })
        return proxyHeader
    }
    function _formatProxyResponse(res) {
        const headers = res.headers
        const keys = Object.getOwnPropertyNames(headers)
        let switchLine = '\r\n';
        let response = [`HTTP/${res.httpVersion} ${res.statusCode} ${res.statusMessage}${switchLine}`]
        keys.forEach(key => {
            response.push(`${key}: ${headers[key]}${switchLine}`)
        })
        response.push(switchLine)
        return response.join('')
    }
})

//取消订单
router.post('/cancelorder', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/cancelorder', false, 'post', req, res, function (data) {
        res.send(data);
    })
});



// var server = ws.createServer(function(conn){
//     conn.on("text", function (str) {
//         conn.sendText(str)
//     })
//     conn.on("close", function (code, reason) {
//         console.log("关闭连接")
//     });
//     conn.on("error", function (code, reason) {
//         console.log("异常关闭")
//     });
// }).listen(8001)
