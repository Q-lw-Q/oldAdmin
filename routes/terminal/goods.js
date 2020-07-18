var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool', redisConfig);

module.exports = router;

router.get('/', function (req, res, next) {
    var data = {};
    res.render('terminal/goodsMain', { data: data });
});

router.get('/searchListByStore', function (req, res, next) {

    //如果没有指定分页的pageSize则使用系统的默认pageSize
    req.query.pageSize || (req.query.pageSize = contModules.defaultPageSize);
    req.query.status = 1;
    if (req.query.categoryId == 0) {
        delete req.query['categoryId'];
    }

    commonReq.singleRequest(contModules.javaBasicUrl + '/boxCell/searchListByStore', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});

/**
 * 查询库存商品类目列表
 */
router.get('/category', function (req, res, next) {
    client.get('category', function (err, data) {
        console.log(err)
        console.log(data,'+++++++++++++++++++++++++')
        if (data) {
            res.send({
                    retCode: 200,
                    retMsg: 'OK',
                    retEntity:
                    {
                        pageIndex: 1,
                        totalPage: 1,
                        totalCount: 100,
                        content: JSON.parse(data)
                    }
                })
        } else {
            // /mobile/getCategoryByStore
            commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/redisclassify', true, 'get', req, res, function (retData) {
                res.send(retData);
            })
        }
    })
});

/**
 * 商品列表
 */
router.get('/list', function (req, res, next) {
    req.query.status = 1;
    if (!req.query.keywords) {
        req.query.keywords = null
    } else {
        req.query.categoryId = 0
    }
    // if (req.query.categoryId == 0) {
    //     delete req.query['categoryId'];
    // }
    commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/searchListByStore', true, 'get', req, res, function (data) {
        // console.log(data.retEntity.content)
        res.send(data);
    })
});

/**
 * 商品详情
 */
router.get('/detail', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/goodsDetail', true, 'get', req, res, function (data) {
        res.send(data);
    })
})

//打印数据初始化
router.post('/print/details', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/orderDetails', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
})
  