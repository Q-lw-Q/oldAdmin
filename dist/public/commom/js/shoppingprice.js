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
      obj.vueThat.editShopping(item)
    },
    editMoney(item) {
      this.$prompt('请输入价格(单位元)', '修改', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        axios.post(location.pathname+'/editMoney', {
          "price": value,
          "goodsDepotId": item.goodsDepotId
        })
          .then((res) => {
            if (res.data.retCode == 200) {
              this.$message.success(res.data.retMsg)
              return
            }
            this.$message.error(res.data.retMsg)
          })
          .catch((res) => {
            this.$message.error('网络连接错误')
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });       
      });
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
    },
    formatMedicine(row, column, cellValue) {
      if (cellValue == "1") {
        return '春季';
      } else if (cellValue == "0") {
        return '无推荐';
      } else if (cellValue == "2") {
        return '夏季';
      } else if (cellValue == "3") {
        return '秋季';
      } else if (cellValue == "4") {
        return '冬季';
      }
    },
    formatPrice(row, column, cellValue) {
      return cellValue / 100 + "元";
    },
    formatlower(row, column, cellValue) {
      if (cellValue == "0") {
        return '已上架';
      } else if (cellValue == "1") {
        return '已下架';
      }
    },
    formatrecommend(row, column, cellValue) {
      if (cellValue == "1") {
        return '是';
      } else if (cellValue == "0") {
        return '否';
      }
    },
  },
  mounted: function () {

  }
})

var obj = {

  bindEvent: function () {
    let that = this
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
    })
  },

  tdList: function (objs) {
    this.vueThat.tableListdata = objs
  },

  vueThat: "",

  tableurl: location.pathname + '/getData',


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
          formLabelWidth: '100px',
          messageWidth: '80px',
          tableListdata: that.vueThat.tableListdata || [],
          restaurants: [],
          state1: '',
          isedit: false,
          checkUrl: '/newsaveShopping',
          imageUrl: '',
          form: {},
          dialogFormVisible: false,
          typeOption: [],
          addStatus: true,
          NowclassIfyArray: {
            classIfyArray: [],
            GoodsDepotId: ''
          },
          dialogTypeForm: false
        }
      },
      methods: {
        async getFormData(barcode) {
          await axios.post(location.pathname + '/getShopping/message', {
              barcode: barcode
            })
            .then((res) => {
              console.log(res)
              if (res.data.retCode == 200) {
                this.form = res.data.retEntity
                this.form.maxNumber = 4
                this.form.minNumber = 1
              }
              this.$message.error(res.data.retMsg)
              return
            })
        },
        async getType() {
          await axios.post(location.pathname + '/get/type')
            .then((res) => {
              // if (res.data.retCode == 200) {
              this.typeOption = res.data.retEntity
              // }
              // this.$message.error(res.data.retMsg)
            })
            .catch((res) => {
              this.$message.error('网络连接错误')
            })
        },
        async setShopping(formdata) {
          let url
          if (this.addStatus){
            url = '/add/shopping'
          }
          await axios.post(location.pathname + url,formdata)
          .then((res) => {
            if (res.data.retCode == 200) {
              this.dialogFormVisible = false
              this.$message.success(res.data.retMsg)
              return
            }
            this.$message.error(res.data.retMsg)
          })
          .catch((res) => {
            this.$message.error('网络连接错误')
          })
        },
        async editType(formdata) {

          await axios.post(location.pathname+'/Modifyclassification', formdata)
          .then((res) => {
            if (res.data.retCode == 200) {
              this.NowclassIfyArray.classIfyArray = []
              this.NowclassIfyArray.GoodsDepotId = ''
              this.dialogTypeForm = false
              this.$message.success(res.data.retMsg)
              return
            }
            this.$message.error(res.data.retMsg)
          })
          .catch((res) => {
            this.$message.error('网络连接错误')
          })
        },
        closedialogFrom: function () {
          this.$refs.messageform.resetFields();
          that.vueThat.dialogFormVisible = false
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
          console.log(item)
          this.imageUrl = ''
          if (item.goodsId) {
            this.messageform = item
            this.imageUrl = item.logo
            item.isOtc = JSON.stringify(item.isOtc)
            this.checkUrl = '/newsaveShopping'
          } else {
            this.checkUrl = '/addShopping'
          }
        },
        loadAll() {

          return;
        },
        handleAvatarSuccess(res, file) {
          let formFile = new FormData()
          console.log(file)
          formFile.append('file', file);
          this.imageUrl = res.url;
        },
        searchBarcode() {
          this.getFormData(this.form.barcode)
        },
        quesionForm() {
          let formData = JSON.parse(JSON.stringify(this.form))
          formData.isRecommend = +formData.isRecommend
          if (formData.classIfyArray) {
            formData.classIfyArray = formData.classIfyArray.join(',')
          }
          this.setShopping(formData)
        },
        editShopping(row){
          // this.addStatus = false
          // this.form = item
          // this.quesionForm()
          // this.dialogFormVisible = true
          let arr = []
          // 修改分类
          if (row.classIfyArray) {
            row.classIfyArray.map(item => {
              console.log(item)
              arr.push(item.categoryMerchantId)
            })
          }
          this.NowclassIfyArray.GoodsDepotId = row.goodsDepotId
          this.NowclassIfyArray.classIfyArray = arr
          this.dialogTypeForm = true
        },
        editQuesion() {
          const form = {
            classIfyArray: this.NowclassIfyArray.classIfyArray.join(','),
            GoodsDepotId: this.NowclassIfyArray.GoodsDepotId
          }
          this.editType(form)
        },
        addShopping() {
          this.addStatus = true
          this.form = {}
          this.quesionForm()
        }
      },
      mounted: function () {
        let that = this
        this.getType()
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