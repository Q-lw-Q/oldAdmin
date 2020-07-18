// 列表模板
Vue.component('tablelisttemplate', {
  template: '#listtemplate',
  props: {
    arraydata: {
      type: Array,
    }
  },
  data() {
    return {

    }
  },
  methods: {
    editShoppint(item) {
      obj.vueThat.isedit = true
      obj.vueThat.handleSelect(item)
      obj.vueThat.dialogFormVisible = true
    },
    formatOtc(row, column, cellValue) {
      if (cellValue == "1") {
        return 'OTC';
      } else if (cellValue == "0") {
        return '处方药';
      } else if (cellValue == "2") {
        return '保健食品';
      } else if (cellValue == "3") {
        return '成人用品';
      } else if (cellValue == "4") {
        return '医疗器械';
      } else if (cellValue == "5") {
        return '其他';
      }
    }
  },
  mounted: function () {

  }
})


var obj = {

  bindEvent: function () {
    let that = this
    let timer = true
    $('#addNewProduct').on('click', function () {
      that.vueThat.isedit = false
      that.vueThat.handleSelect({})
      that.vueThat.messageform = {}
      that.vueThat.dialogFormVisible = !that.vueThat.dialogFormVisible
    })
    // search 查询
    $('#query_filter_btn2').on('click', function () {
      vueObj.vueObjGetdata.barcode = $('#contextval').val()
      vueObj.initPage()
      timer = true
    })
    $('#contextval').bind('input propertychange', function(){
      if (timer) {
        timer = false
        $('#query_filter_btn2').click()
      }
      return
    })
  },

  tdList: function (objs) {
    this.vueThat.tableListdata = objs.map(item => {
      return {
        goodsId: item.goodsId,  // id
        goodsName: item.goodsName, // 名称
        spec: item.spec, // 规格
        unit: item.unit, // 单位
        barcode: item.barcode, // 条形码
        isOtc: item.isOtc, // 药品类型
        effect: item.effect, // 功效
        taboo: item.taboo, // 禁忌
        attention: item.attention, // 注意事项
        dosage: item.dosage, // 用法用量
      }
    })
  },

  vueThat: "",

  tableurl: location.pathname + '/newdata',


  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        var checkNumber = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('不能为空'));
          } else {
            const reg = /^[1-9]\d*$/g
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('只能输入数字'));
            }
          }
        };
        return {
          dialogFormVisible: that.vueThat.dialogFormVisible || false,
          messageform: {
            barcode: '',
            name: '',
            length: '',
            width: '',
            height: '',
            goodsPackSizeId: '',
          },
          formrules: {
            barcode: [
              { required: true, message: '商品编码不能为空', trigger: 'blur' },
            ],
            name: [
              { required: true, message: '商品长度不能为空', trigger: 'blur' },
            ],
            length: [
              { required: true, message: '长度不能为空', trigger: 'blur' },
              { validator: checkNumber, trigger: 'blur' }
            ],
            width: [
              { required: true, message: '宽度不能为空', trigger: 'blur' },
              { validator: checkNumber, trigger: 'blur' }
            ],
            height: [
              { required: true, message: '高度不能为空', trigger: 'blur' },
              { validator: checkNumber, trigger: 'blur' }
            ],

          },
          formLabelWidth: '120px',
          tableListdata: that.vueThat.tableListdata || [],
          restaurants: [],
          state1: '',
          isedit: false,
          checkUrl: '/newsaveShopping',
          imageUrl: ''
        }
      },
      methods: {
        closedialogFrom: function () {
          this.$refs.messageform.resetFields();
          that.vueThat.dialogFormVisible = false
        },
        checkFrom: function () {
          let _that = this
          _that.messageform.logo = _that.imageUrl
          _that.openFullScreen()
          $.ajax({
            type: 'POST',
            dataType: 'json',
            url: location.pathname + _that.checkUrl,
            data: _that.messageform,
            success: function (res) {
              if (res.retCode == 200) {
                that.vueThat.dialogFormVisible = false
                _that.$message({
                  type: 'success',
                  message: res.retMsg
                });
                setTimeout(() => {
                  if ($('#page .xl-active')) {
                    $('#page .xl-active').click()
                  } else {
                    window.location.reload()
                  }
                }, 2000);
              } else {
                _that.$message({
                  type: 'info',
                  message: res.retMsg
                });
              }
              _that.closeloading()
            },
            error: function (res) {
              _that.closeloading()
              _that.$message({
                type: 'info',
                message: '请检查网络'
              });
            }
          })
        },
        querySearch(queryString, cb) {
          var restaurants = this.restaurants;
          var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
          // 调用 callback 返回建议列表的数据
          cb(results);
        },
        createFilter(queryString) {
          return (restaurant) => {
            return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0 || restaurant.barcode.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
          };
        },
        handleSelect(item) {
          const _that = this
          this.imageUrl = ''
          if (item.goodsId) {
            $.ajax({
              type: 'POST',
              dataType: 'json',
              url: location.pathname + '/goodsDetail',
              data: {
                "goodsId": item.goodsId
              },
              success: function (res) {
                _that.messageform = res.retEntity
                delete _that.messageform.createdTime
                _that.imageUrl = res.retEntity.logo
                _that.messageform.isOtc = JSON.stringify(res.retEntity.isOtc)
                _that.messageform.height = _that.messageform.height / 10
                _that.messageform.width = _that.messageform.width / 10
                _that.messageform.length = _that.messageform.length / 10
                _that.checkUrl = '/newsaveShopping'
              },
              error: function (res) {
                _that.closeloading()
                _that.$message({
                  type: 'info',
                  message: '请检查网络'
                });
              }
            })

          } else {
            this.checkUrl = '/addShopping'
          }
        },
        blurTest() {
          const _that = this
          if (this.checkUrl === '/addShopping'){
            // 添加状态
            let barcode = this.messageform.barcode
            if (barcode) {
              $.ajax({
                type: 'GET',
                dataType: 'json',
                url: location.pathname + '/newdata',
                data: {
                  "barcode": barcode
                },
                success: function (res) {
                  if (res.retEntity.content.length > 0) {
                    _that.$refs['messageform'].fields[0].validateMessage = "该商品已经入库"
                    _that.$refs['messageform'].fields[0].validateState = "error"
                  }
                },
                error: function (res) {
                  
                }
              })
            }
          }
        },
        loadAll() {

          return;
        },
        // getAllData(barcode) {
        //   let that = this
        //   $.ajax({
        //     type: 'get',
        //     dataType: 'json',
        //     url: location.pathname + '/getData',
        //     data: {
        //       barcode: barcode,
        //     },
        //     success: function (res) {
        //       if (res.retEntity) {
        //         let data = res.retEntity.map(item => {
        //           return {
        //             value: item.goodsName,
        //             name: item.goodsName,
        //             barcode: item.barcode,
        //             length: item.length,
        //             width: item.width,
        //             height: item.height,
        //           }
        //         })
        //         that.restaurants = data
        //       }
        //     },
        //     error: function (res) {
        //       console.log(res)
        //     }
        //   })
        // }
        handleAvatarSuccess(res, file) {
          let formFile = new FormData()
          console.log(file)
          formFile.append('file', file);
          this.imageUrl = res.url;
        },
        beforeAvatarUpload(file) {
          // const isJPG = file.type === 'image/jpeg';
          // const isLt2M = file.size / 1024 / 1024 < 2;

          // if (!isJPG) {
          //   this.$message.error('上传头像图片只能是 JPG 格式!');
          // }
          // if (!isLt2M) {
          //   this.$message.error('上传头像图片大小不能超过 2MB!');
          // }
          // return isJPG && isLt2M;
        }
      },
      mounted: function () {
        let that = this
        // this.getAllData()
      },
      watch: {

      }
    });
  },


  init: function () {
    let data = {
      barcode: ""
    }
    vueObj.initPage(data)
    this.initVue()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})