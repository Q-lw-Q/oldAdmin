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
    res.render("admin/shoppingdetails");
})

//获取商品
router.get('/getData', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/backstage/goodsAll', true, 'get', req, res, function (retData) {
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
router.get('/newdata', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goods/searchList', true, 'get', req, res, function (retData) {
    res.send(retData);
  })
})

//修改商品
router.post('/newsaveShopping', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goods/edit', false, 'post', req, res, function (retData) {
    console.log(retData)
    res.send(retData);
  })
})

router.post('/goodsDetail', function (req, res, next) {
  commonReq.singleRequest(contModules.javaBasicUrl + '/goods/viewGoods', false, 'post', req, res, function (retData) {
    console.log(retData)
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

// 图片上传
router.post('/upload', function (req, res, next) {
  console.log(123)
  var form = new multiparty.Form({ uploadDir: './public/servicepictures' });
  var date = new Date();
  var ms = Date.parse(date);
  let number = ms+String(Math.random().toString().substring(2, 5))
  form.parse(req, function(err, fields, files) {
      let xhr ={
          code: '',
          msg: ''
      }
      if (err) {
          xhr.code = -1
          xhr.msg = err
      } else {
          fs.renameSync(files.file[0].path,form.uploadDir + '/' + number+'.jpg');
          xhr.code = 200
          xhr.msg = '保存成功'
          xhr.url = '/servicepictures/' + number+'.jpg'
      }
      res.send(xhr)
  });

})
