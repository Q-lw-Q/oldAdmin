var express = require('express');
var router = express.Router();
var commonReq = require('../../common/common_request.js');
var contModules = require('../../common/cont_modules.js');
var request = require('request')
var redisConfig = require('../../redisConfig.json');
var client = require('redis-connection-pool')('myRedisPool',redisConfig);
module.exports = router;


//转跳主页
router.get('/', function (req, res, next) {
    res.render("android/aiInterrogation");
})

//商品详情
router.get('/get/shoppingdetail', function (req, res, next) {
    console.log(123)
    commonReq.singleRequest(contModules.javaBasicUrl + '/mobile/goodsDetail', true, 'get', req, res, function (data) {
        console.log(data)
        res.send(data);
    })
});

router.post('/Mobileseek', function (req, res, next) {
    let getdisease = JSON.parse(req.body.getdisease)
    commonReq.singleRequest(contModules.javaBasicUrl + '/shop/Mobileseek', false, 'post', req, res, function (retData) {
        let arr = []
        let newArr = []
        let easeIndex = 0
        
        retData.retEntity.some(element => {
            console.log(element)
            if (element.length != 0) {
                element.forEach(item => {
                    item['disease'] = getdisease[easeIndex]
                    arr.push(item)
                })
            }
            easeIndex++
        })

        // arr.forEach(element => {

        //     newArr.push(element.sort(indexArray('price',false)))

        //     console.log(newArr)
        // })

        client.get('GoodsSorting',function (err,data) {
            switch (+data) {
                case 1:
                newArr = arr.sort(indexArray('price',true))
                break;
                case 2:
                newArr = arr.sort(indexArray('profit',true))
                    break;
                case 3:
                newArr = arr.sort(indexArray('recommend',true))
                    break;
                default:
                newArr = arr
                    break;
            }
            res.send({
                retCode: 200,
                retMsg: "OK",
                retEntity: newArr
            });
            
        })
    })
})


function indexArray(property,desc) {
    return function (a, b) {
        var value1 = a[property];
        var value2 = b[property];
        if(desc == false){
            // 升序排列
            return value1 - value2;
        }else{
            // 降序排列
            return value2 - value1;
        }
    }
}