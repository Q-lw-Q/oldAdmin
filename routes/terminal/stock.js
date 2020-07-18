var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');

module.exports = router;

//添加barcode库存
router.post('/add', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/stock/add', false, 'post', req, res, function (retData) {
        res.send(retData);
    });

});