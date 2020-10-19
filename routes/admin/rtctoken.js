var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var request = require('request')
// var redis = require('redis');
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool',redisConfig);

module.exports = router;


//转跳主页
router.get('/', function (req, res, next) {
    client.get('userType',function(err, data) {
        let typeData = req.cookies.userType
        if (typeData > 2 ){
            res.render("erro", {
                msg: '权限不足',
                type: '2',
                pageName: "首页"
            })
        } else {
            res.render("admin/rtctoken");
        }
    })
})

//咨询认证
router.get('/setData', function (req, res, next) {
    let firstFlag = (JSON.stringify(req.query) === '{}')
    client.get('Token',function (err,data) {
        switch (firstFlag) {
            case true:
                res.send({
                    code: 0,
                    msg: JSON.parse(data)
                })
                break;
            case false:
                client.set('Token',JSON.stringify(req.query.data))
                res.send({
                    code: 0,
                    msg: req.query.data,
                    alert: '修改成功'
                })
                break;
            default:
                break;
        }
    })
})

//收钱吧认证
router.get('/setDatasqb', function (req, res, next) {
    if(!req.query.sn && !req.query.key) {
        res.send({
            code: -1,
            retMsg: '请填写正确key 和 sn'
        })
    } else {
        commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/sqnsn', true, 'get', req, res, function (retData) {
            res.send(retData);
        })
    }
})

router.get('/getDatasqb', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/getsqb', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
})

//获取ai排序顺序
router.get('/sorting', function (req, res, next) {
    client.get('GoodsSorting',function (err,data) {
        res.send({
            code: 200,
            data: data
        })
    })
})

//设置ai排序顺序
router.get('/setSorting', function (req, res, next) {
    client.get('GoodsSorting',function (err,data) {
        if (!req.query.id) {
            res.send({
                code: -1,
                alert: '请选择排序顺序'
            })
        } else {
            client.set('GoodsSorting',req.query.id)
            res.send({
                code: 200,
                alert: '设置成功'
            })
        }
        
    })
})

router.post('/removal', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shangmi/removal', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})

router.post('/setval', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shangmi/binding', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})

router.post('/getCom', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shangmi/display', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})


