var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');

module.exports = router;

//补货单生成
router.post('/buildReple', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/reple/add', false, 'post', req, res, function (retData) {
        res.send(retData);
    })

});

/**
 * 补货单查询
 */
router.get('/selectReple', function (req, res, next) {

    commonReq.singleRequest(contModules.javaBasicUrl + '/reple/searchList', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});

/**
 * 补货单明细生成
 */
router.post('/buildRepleTier', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/repleTier/add', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

/**
 * 补货单明细更新
 */
router.post('/editRepleTier', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/repleTier/edit', false, 'post', req, res, function (retData) {
        res.send(retData);
    })
});

//补货单明细查询
router.get('/selectRepleTier', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/repleTier/searchList', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});


/**
 * 添加库存
 */
router.post('/addGoods', function (req, res, next) {
    var axis = req.body.position
    req.body['zAxis'] = axis.substr(0, 2) * 1;
    req.body['xAxis'] = axis.substr(2, 2) * 100;
    req.body['yAxis'] = axis.substr(4, 2) * 100;

    commonReq.singleRequest(contModules.javaBasicUrl + '/repleTier/addGoods', false, 'post', req, res, function (data) {
        res.send(data);
    })
});