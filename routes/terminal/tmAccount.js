var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool',redisConfig);

module.exports = router;

//登录页
router.get('/', function (req, res, next) {
  var data = {};
  res.render('terminal/tmlogin', { data: data });
});

/**
 * 登录
 */
router.post('/login', function (req, res, next) {
  if (!req.body.tac || !req.body.pwd) {
    return
  }
  req.body.account = req.body.tac;
  req.body.password = req.body.pwd;
  console.log(req.body)
  commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/login', false, 'post', req, res, function (data) {
    if (data.retCode == 200) {
      res.setHeader('access_token', data.retEntity.accessToken);
      res.setHeader('type', data.retEntity.type);
      res.send(data);
    } else {
      res.send(data);
    }
  })
});

/**
 * 取 im 账号
 */
router.get('/ima', function (req, res, next) {
  client.get('Token',function (err,data) {
    req.headers['access_token'] = JSON.parse(data)
    // req.body.
    commonReq.singleRequest(contModules.immerchant + '/tmi/tac/ima', true, 'get', req, res, function (data) {
      console.log(data,'12123321213213')
      res.send(data);
    })
  })
});

/**
 * 释放缓存中的imInfo
 */
router.post('/freeImBind', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/iminfo/freeImBind', false, 'post', req, res, function (retData) {
      res.send(retData);
  });
});