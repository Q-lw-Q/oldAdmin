var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
const fileType = require('file-type');
const readChunk = require('read-chunk');
const path = require('path');
const multiparty = require("multiparty");
const fs = require("fs");

module.exports = router;

//转跳主页
router.get('/', function (req, res, next) {
    res.render("admin/advertisementbaa");
})

// 图片上传
router.post('/upload', function (req, res, next) {

    var form = new multiparty.Form({ uploadDir: './public/advertisementManage' });
    form.parse(req, function(err, fields, files) {
        let xhr ={
            code: '',
            msg: ''
        }
        if (err) {
            xhr.code = -1
            xhr.msg = err
        } else {
            fs.renameSync(files.file[0].path,form.uploadDir + '/'+files.file[0].originalFilename);
            xhr.code = 200
            xhr.msg = '保存成功'
        }
        res.send(xhr)
    });
})

// 视频
router.post('/video/upload', function (req, res, next) {

    var form = new multiparty.Form({ uploadDir: './public/advertisementManage' });
    form.parse(req, function(err, fields, files) {
        let xhr ={
            code: '',
            msg: ''
        }
        if (err) {
            xhr.code = -1
            xhr.msg = err
        } else {
            fs.renameSync(files.file[0].path,form.uploadDir + '/video.mp4');
            xhr.code = 200
            xhr.msg = '保存成功'
        }
        res.send(xhr)
    });
})
