var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var multiparty = require('multiparty');

module.exports = router;

/**
 * 图片上传
 */
router.post('/uploadFace', function (req, res) {
  var imgData = req.body.imgData;

  let dataBuffer = Buffer.from(req.body.imgData, 'base64'); //解码图片

  var date = new Date();
  var ms = Date.parse(date); //计算当前时间与1970年1月1日午夜相差的毫秒数 赋值给ms以确保文件名无重复。

  var fileName = ms + "." + String(Math.random().toString().substring(2, 5) + '.jpg');

  var uploadPath = contModules.uploadDir + "upLoadRec/"
  forntPath = uploadPath + fileName;

  fs.writeFileSync(forntPath, dataBuffer);

  req.body = {
    "storeCode":req.body.storeCode,
    "base64Img":imgData,
    "imgPath": forntPath,
    "fileName": fileName,
  };

  var postUrl = '/faceRec/add';

  commonReq.singleRequest(contModules.javaBasicUrl + postUrl, false, 'POST', req, res, function (data) {
    console.log(data);
    if (data.retCode = 200) {
      //   data["paht"]=forntPath.replace('public','');
    
      res.send(data);
    } else {
      res.send("上传失败");
    }
  })

});

/**
 * 图片上传
 */
router.post('/uploadFaceOld', function (req, res) {
  console.log('uploadFace');
  //保存目录
  var uploadPath = contModules.uploadDir + "upLoadRec/"
  var form = new multiparty.Form();
  form.uploadDir = uploadPath;
  form.encoding = 'utf-8';
  form.maxFilesSize = 5 * 1024 * 1024;
  form.parse(req, function (err, fields, files) {
    if (!files) {
      res.send("文件不存在！");
      return false;
    }


    console.log(files);
    var extname = path.extname(files.files[0].originalFilename);

    var contentType = files.files[0].headers["content-type"]; //extname; 
    var fileType = ["image/jpeg", "image/png"];
    if (fileType.indexOf(contentType) > -1) {
      if (files.files[0].size >= form.maxFilesSize) {
        res.send('您这个"' + file[0].name + '"文件大小过大');
        return false;
      }
      var date = new Date();
      var ms = Date.parse(date); //计算当前时间与1970年1月1日午夜相差的毫秒数 赋值给ms以确保文件名无重复。
      var fileName = ms + "." + String(Math.random().toString().substring(2, 5) + extname);
      forntPath = uploadPath + fileName;

      //test
      let bitmap = fs.readFileSync(files.files[0].path);

      let base64str = Buffer.from(bitmap, 'binary').toString('base64'); //base64编码
      // let base64str =""; 
      console.log("base64str");
      console.log(base64str);

      // let bitmap1 = Buffer.from(base64str, 'base64'); //解码图片
      // fs.writeFileSync('end.jpg', bitmap1);

      //endTest

      fs.renameSync(files.files[0].path, forntPath);
      req.body = {
        base64Img:base64str,
        "imgPath": forntPath,
        "fileName": files.files[0].originalFilename,
      };
      //前端传入的参数
      for (var key in fields) {
        req.body[key] = fields[key][0];
      };
      var postUrl = '/faceRec/add';

      commonReq.singleRequest(contModules.javaBasicUrl + postUrl, false, 'POST', req, res, function (data) {
        if (data.retCode = 200) {
          //   data["paht"]=forntPath.replace('public','');
          res.send(data);
        } else {
          res.send("上传失败");
        }
      })
    } else {
      res.send("只支持png和jpg格式图片");
    }

  })
});