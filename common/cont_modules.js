module.exports = {

  javaBasicUrl: 'http://192.168.3.11:8082',
  nodeBasicUrl: 'http://192.168.3.11:9008', // 手动补货 请求
  orderBasicUrl: 'http://192.168.3.11:3015', // 支付页面 生成订单请求 url
  imbaseurl: 'http://192.168.3.11:3015', 
  imageurl: 'tmerchant.jekjk.com', 
  // immerchant: 'tmerchant.jekjk.com',
  immerchant:"http://app.jekjk.com",
  payQrcode: 'http://tmerchant.jekjk.com', //支付二维码 地址
  // payQrcode: 'http://192.168.0.116:3015', //支付二维码 地址
  // nodeBasicUrl: 'http://localhost:3006',
  // nodeBasicUrl:'39.96.77.244:8080',
  //文件上傳目錄
  //uploadDir:'/home/sysop/', //服務器
  uploadPri: 'private',//非公开文件
  uploadDir: '', //本地
  defaultPageSize: 20,
  redisHost: 'http://192.168.3.11:6379',            
  keyPrefix:
  {
    orderPayStatus:'payStatus'  //redis内保存订单支付状态 key的前缀
  },
  ordersPaySatus:{
    build:1,  //创建订单状态
    showPay:2, //进入支付页面支付进行中
    process:3,  //订单出货处理在 （只能一个订单进入）
    end:4,       //库存已扣减
    paySuccess: 5, //订单支付成功 调用出货
  },
  // qrcodeHost:"http://app.jekjk.com"
  qrcodeHost:"http://192.168.3.11:3015",
  shoppingHost: "http://192.168.3.11:9008", //商品库存 host
  merchantHost: "http://tmerchant.jekjk.com", // 商户后台链接
}