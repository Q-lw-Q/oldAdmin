/**
 * 通用Request
 */
var express = require('express');
var request = require('request');
var async = require('async');

/**
 * 单个request请求Java后台
 * @url :后台url
 * @isGet :'true'/'false' 页面是否为get请求进node  
 * @reqType :'GET'/'POST'表示请求JAVA时是GET/POST请求
 * @req : req
 * @res : res
 * @fn : 回调方法
 */
var singleRequest = function (url, isGet, reqType, req, res, fn) {
  var headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  };

  var token = req.headers.access_token ? req.headers.access_token : req.cookies.token ? req.cookies.token : req.query.accessToken ? req.query.accessToken : req.body.accessToken ? req.body.accessToken : '';

  headers.equipCode = req.headers.equipCode;
  headers.appid = req.headers.appid
  if (token) {
    headers.access_token = token;
    headers["access-token"] = token;
  }

  var params = req.body;
  if (isGet) {
    if (req.query) {
      var requery = "?";
      for (var key in req.query) {
        requery += ('&' + key + '=' + encodeURIComponent(req.query[key]));
      }
      url = url + requery;
    }
    params = req.query;
  }
  async.parallel({
    data: function (done) {
      var options = {
        method: reqType,
        url: url,
        headers: headers,
        form: params
      };
      request(options, function (err, response, body) {
        if (!err) {
          done(null, body);
        }
      });
    }
  }, function (error, result) {
    if (!error) {
      var data = JSON.parse(result.data);
      fn(data);
    } else {
      res.send(error.message);
    }
  });
};

/*文件上传*/

var fileRequest = function (url, req, res, fn) {
  async.parallel({
    fn1: function (done) {
      var fileName = req.file.originalname;
      var headers = {
        suffix: fileName.substr(fileName.lastIndexOf('.') + 1)
      };
      var token = req.headers.access_token;
      if (token) {
        headers.access_token = token;
      }
      var options = {
        url: url,
        method: 'POST',
        headers: headers,
        body: req.file.buffer
      }
      request.post(options, function (err, response, body) {
        if (!err) {
          done(null, body);
        } else {
          done(error, null)
        }
      });
    }
  }, function (error, result) {
    if (!error) {
      var data = JSON.parse(result.fn1);
      fn(data);
    } else {
      res.send(error.message);
    }
  });
}
exports.singleRequest = singleRequest;
exports.fileRequest = fileRequest;
