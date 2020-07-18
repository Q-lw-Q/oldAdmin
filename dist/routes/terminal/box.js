var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');

module.exports = router;

//查询设备的药箱
router.get('/selectBox', function (req, res, next) {
  
    commonReq.singleRequest(contModules.javaBasicUrl + '/boxCell/selectBox', true, 'get', req, res, function (retData) {
        res.send(retData);
    })

});

/**
 * 查询药箱中的层
 */
router.get('/selectBoxTiers', function (req, res, next) {
    
    commonReq.singleRequest(contModules.javaBasicUrl + '/box/selectBoxTiers', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});

/**
 * 查询药箱层详情
 */
router.get('/selectBoxCellDetail', function (req, res, next) {
    
    commonReq.singleRequest(contModules.javaBasicUrl + '/boxCell/selectBoxCellDetail', true, 'get', req, res, function (retData) {
        res.send(retData);
    })
});
