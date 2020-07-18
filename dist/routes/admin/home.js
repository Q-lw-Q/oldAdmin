var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var request = require('request')
const fs = require('fs')
var redis = require('redis');
const https = require('https');
const http = require('http');
var uploadurl = require("url");
const fileType = require('file-type');
const readChunk = require('read-chunk');
const moment = require('moment')
const path = require('path');
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool',redisConfig);
let timersocket

module.exports = router;


//转跳主页
router.get('/', function (req, res, next) {
    res.render("admin/home");
})

// 退出登录
router.post('/loginOut', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/home/quit', false, 'post', req, res, function (retData) {
        res.clearCookie('userName');
        res.clearCookie('token');
        res.clearCookie('userType')
        res.send(retData);
    })
});

// 交接班
router.post('/loginChange', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/home/handover', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

// 交接班 详细数据
router.get('/searchpeople', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/home/handover', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

// 首页初始化数据
router.get('/data/detail', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/manage', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

// 图片上传
router.post('/upload', function (req, res, next) {
    let url = 'http://' + path.join(contModules.imageurl, req.body.image)
    let barcode = req.body.barcode
    let xhr = {}

    // let protocol = uploadurl.parse(req.body.image).protocol
    console.log(url)
    
    function successcall(uploadres) {

        const { statusCode } = uploadres;
        console.log(statusCode, '+++++++++++++++++++++++++++++++++++')

        if (statusCode !== 200) {
            xhr.code = 200
            xhr.dirname = `/static/images/uploadbg.png`
            res.send(xhr)
        }

        //用来存储图片二进制编码
        let imgData = '';

        //设置图片编码格式
        uploadres.setEncoding("binary");

        //检测请求的数据
        uploadres.on('data', (chunk) => {
            imgData += chunk;
        })

        //请求完成执行的回调
        uploadres.on('end', () => {
            // 通过文件流操作保存图片 node 目录默认为代码层最高级目录
            fs.writeFile(`./public/servicepictures/${barcode}.jpg`, imgData, 'binary', (error) => {
                if (error) {
                    xhr.code = 200
                    xhr.dirname = `/static/images/uploadbg.png`
                    res.send(xhr)
                } else {
                    let chunk = readChunk.sync(`./public/servicepictures/${barcode}.jpg`, 0, fileType.minimumBytes)
                    let filedetail = fileType(chunk)
                    if (filedetail && ((filedetail.ext == 'jpg') || (filedetail.ext == 'png') || (filedetail.ext == 'gif'))) {
                        xhr.code = 200
                        xhr.dirname = `/servicepictures/${barcode}.jpg`
                        res.send(xhr)
                    } else {
                        xhr.code = 200
                        xhr.dirname = `/static/images/uploadbg.png`
                        fs.unlink(`./public/servicepictures/${barcode}.jpg`, function () { });
                        res.send(xhr)
                    }
                    console.log(xhr)
                }
            })
        })
    }


    // if (protocol == 'http:') {

    try {
        //先访问图片    
        http.get(url, (uploadRes) => {

            const { statusCode } = uploadRes;
            const contentType = uploadRes.headers['content-type'];
            let error;
            let xhr = {}
            if (statusCode !== 200) {
                error = new Error('请求失败\n' +
                    `状态码: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                if (contentType == 'image/jpeg') {

                } else {
                    error = new Error('无效的 content-type.\n' +
                        `期望的是 application/json 但接收到的是 ${contentType}`);
                }
            }
            if (error) {
                // 消费响应数据来释放内存。
                xhr.code = 200
                xhr.dirname = `/static/images/uploadbg.png`
                res.send(xhr)
                uploadRes.resume();

                return;
            }

            successcall(uploadRes)
        })
    } catch (error) {
        let xhr = {}
        xhr.code = 200
        xhr.dirname = `/static/images/uploadbg.png`
        res.send(xhr)
    }


    // } else if (protocol == 'https:'){
    //     https.get(url, (uploadres) => {
    //         successcall(uploadres)
    //     })
    // }

})

// 总收入 图表
router.get('/data/allmoney', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/analyze', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

// 总退款 图表
router.get('/data/refund', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/refundlist', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

// 饼状图 图表
router.get('/data/payment', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/payment', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

router.get('/remove/callPoliceErrBoxIn', function (req, res, next) {
    client.del('callPolice')
    res.send({
        code: 200,
        msg: '删除成功'
    })
})


const WebSocket = require('ws');
var server = http.createServer(express);
const wss = new WebSocket.Server({server})

wss.on('connection', function connection(ws) {
    clearInterval(timersocket)
    ws.on('message', function incoming(data) {
        /**
         * 把消息发送到所有的客户端
         * wss.clients获取所有链接的客户端
         */
        // wss.clients.forEach(function each(client) {
            // client.send();
        // });
        timersocket = setInterval(searchTimer,30000)
        // 60000);
        searchTimer()
        function searchTimer() {
            client.get('callPolice',function (err, data) {
                console.log(data,'+++++++++++++++++++++++++++')
                if (data) {
                    wss.clients.forEach(function each(client) {
                        client.send(data)
                    })
                } else if (!data) {
                    wss.clients.forEach(function each(client) {
                        client.send()
                    })
                }
            })
        }
    });
});

server.listen(2999, function listening() {});