var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var request = require('request')
var redis = require('redis');
const multiparty = require("multiparty");
const fs = require("fs");
module.exports = router;


//转跳主页
router.get('/', function (req, res, next) {
    res.render("admin/shoppingprice");
})

//获取商品
router.get('/getData', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goodsDepot/searchList', true, 'get', req, res, function (retData) {
    res.send(retData);
  })
})

//保存商品
router.post('/saveShopping', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/collection', false, 'post', req, res, function (retData) {
    res.send(retData);
  })
})

//获取商品列表
router.get('/data', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/collectionlist', true, 'get', req, res, function (retData) {
    res.send(retData);
  })
})

//获取商品列表
// router.get('/newdata', function (req, res, next) {
//   commonReq.singleRequest(contModules.javaBasicUrl + '/goods/searchList', true, 'get', req, res, function (retData) {
//     res.send(retData);
//   })
// })

//保存商品
router.post('/newsaveShopping', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goods/viewGoods', false, 'post', req, res, function (retData) {
    res.send(retData);
  })
})

// //保存商品
router.post('/addShopping', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goods/add', false, 'post', req, res, function (retData) {
    console.log(req.body)
    res.send(retData);
  })
})

// //获取商品基本信息
router.post('/getShopping/message', function (req, res, next) {
  console.log(req.body)
  commonReq.singleRequest(contModules.javaBasicUrl + '/goodsDepot/inquireGoods', false, 'post', req, res, function (retData) {
    res.send(retData);
  })
})

// //获取商品基本信息
router.post('/get/type', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/categoryMerchant/searchList', false, 'post', req, res, function (retData) {
    res.send(retData);
  })
})

// //获取商品基本信息
router.post('/add/shopping', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goodsDepot/add', false, 'post', req, res, function (retData) {
    res.send(retData);
  })
})
// //获取商品基本信息
router.post('/Modifyclassification', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goodsDepot/Modifyclassification', false, 'post', req, res, function (retData) {
    res.send(retData);
  })
})

// //获取商品基本信息
router.post('/editMoney', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goodsDepot/updatePrice', false, 'post', req, res, function (retData) {
    res.send(retData);
  })
})

