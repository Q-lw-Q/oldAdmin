var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var request = require('request')
var redis = require('redis');
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool',redisConfig);
module.exports = router;


//转跳主页
router.get('/', function (req, res, next) {
    res.render("deskadmin/adminLogin");
})

//登录接口
router.post('/login', function (req, res, next) {
    commonReq.singleRequest(contModules.javaBasicUrl + '/home/login', false, 'post', req, res, function (data) {
        if (data.retCode == 200) {
            res.cookie('userName', data.retEntity.name)
            res.cookie('token', data.retEntity.accessToken, {httpOnly: true });
            res.cookie('userType', data.retEntity.type)
            // res.cookie('branchName', data.retEntity.branch,{ expires: new Date(Date.now() + (24000 * 60 * 60 * 2))})
            client.get('userType',function (err, olddata) {
                client.set('userType',data.retEntity.type)
            })
        }
        res.send(data);
    })
});