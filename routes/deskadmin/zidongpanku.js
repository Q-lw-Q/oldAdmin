"use strict";var express=require("express"),router=express.Router(),commonReq=require("../../common/common_request.js"),contModules=require("../../common/cont_modules.js"),moment=require("moment"),request=require("request"),redis=require("redis");(module.exports=router).get("/",function(e,r,o){r.render("deskadmin/zidongpanku")});