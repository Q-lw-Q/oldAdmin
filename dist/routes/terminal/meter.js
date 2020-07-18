var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var qr = require('qr-image')
var UUID = require('uuid');
var redis = require('redis');
module.exports = router;


/**
 * 接收体检测量数据
 */
router.post('/measure', function (req, res, next) {
    //示例数据 000501╗@067516850000000000000000000002390000C╚
    console.log();
    // parseInt(req.body,16)
    console.log(body);
    console.log(req.body.data);

    if (req.body.data) {
        var data = req.body.data;
        var postData = {};
        postData.storeCode = data.substr(0, 4); //店铺编码
        postData.mc = data.substr(4, 2); //没量设备类型
        postData.weight = data.substr(8, 4); //体重
        postData.height = data.substr(12, 4); //身高
        postData.axunge = data.substr(16, 4); //身高
        console.log(postData);
    }
    res.send('ok');
});

// function hexCharCodeToStr(hexCharCodeStr) {
//     var trimedStr = hexCharCodeStr.trim();
//     var rawStr =
//         trimedStr.substr(0, 2).toLowerCase() === "0x" ?
//         trimedStr.substr(2) :
//         trimedStr;
//     var len = rawStr.length;
//     if (len % 2 !== 0) {
//         alert("Illegal Format ASCII Code!");
//         return "";
//     }
//     var curCharCode;
//     var resultStr = [];
//     for (var i = 0; i < len; i = i + 2) {
//         curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
//         resultStr.push(String.fromCharCode(curCharCode));
//     }
//     return resultStr.join("");
// }