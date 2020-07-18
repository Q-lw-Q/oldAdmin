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
      userType: vueObj.getCookie('userType') || ''
    }
  },
  methods: {
    editPassword: function (id, type) {
      let _that = this
      if (+type < +obj.userType) {
        this.$message({
          type: 'info',
          message: '权限不足'
        });
      } else {
        this.$prompt('请输入新密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[A-Za-z0-9]+$/,
          inputErrorMessage: '密码必须为数字或字母'
        }).then(({ value }) => {
          $.ajax({
            type: 'POST',
            dataType: 'json',
            url: location.pathname + '/edit',
            data: {
              password: value,
              memberId: id
            },
            success: function (res) {
              if (res.retCode == 200) {
                _that.$message({
                  type: 'success',
                  message: '账号修改成功'
                });
              } else {
                _that.$message({
                  type: 'info',
                  message: res.retMsg
                });
              }
            },
            error: function (res) {
              _that.$message({
                type: 'info',
                message: '请检查网络'
              });
            }
          })
        }).catch(() => {
          _that.$message({
            type: 'info',
            message: '取消修改'
          });
        });
      }
    },
    deleteUser: function (id) {
      let _that = this
      this.$confirm('此操作将永久删除该账号, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'POST',
          dataType: 'json',
          url: location.pathname + '/delete',
          data: {
            memberId: id
          },
          success: function (res) {
            if (res.retCode == 200) {
              _that.$message({
                type: 'success',
                message: '账号删除成功'
              });
            } else {
              _that.$message({
                type: 'info',
                message: res.retMsg
              });
            }
          },
          error: function (res) {
            _that.$message({
              type: 'info',
              message: '请检查网络'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    editEmail: function (id, emailStatus) {
      let _that  = this
      let str
      let userEmailStatus
      if (emailStatus == 1) {
        // 取消
        userEmailStatus = 0
        str = '此操作将导致（有异常问题）不会推送至该账号邮箱, 是否继续?'
      } else {
        userEmailStatus = 1
        str = '此操作将导致（有异常问题）推送至该账号邮箱, 是否继续?'
      }
      this.$confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $.ajax({
          type: 'get',
          dataType: 'json',
          url: location.pathname + '/receiveremail',
          data: {
            memberId: id,
            emailStatus: userEmailStatus
          },
          success: function (res) {
            console.log(res)
            if (res.retCode == 200) {
              _that.$message({
                type: 'success',
                message: '修改成功'
              });
              vueObj.initPage()

              // window.location.reload()
            } else {
              _that.$message({
                type: 'info',
                message: res.retMsg
              });
            }
          },
          error: function (res) {
            _that.$message({
              type: 'info',
              message: '请检查网络'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消修改'
        });
      });
    }

  },
  mounted: function () {

  }
})


var obj = {

  bindEvent: function () {
    let that = this
    $('#addNewProduct').on('click', function () {
      that.vueThat.dialogFormVisible = !that.vueThat.dialogFormVisible
    })
  },

  tdList: function (objs) {
    $.each(objs, function (i, item) {
      // 性别
      if (+item.sex === 1) {
        item.sexString = "男"
      } else if (+item.sex === 2) {
        item.sexString = "女"
      }
      // 账号状态
      switch (+item.status) {
        case 0:
          item.statusString = '准备状态'
          break;
        case 1:
          item.statusString = '正常状态'
          break;
        case 2:
          item.statusString = '冻结状态'
          break;
        case 3:
          item.statusString = '已删除'
          break;
        default:
          item.statusString = '???'
          break;
      }
      switch (+item.type) {
        case 2:
          item.typeString = '管理员'
          break;
        case 3:
          item.typeString = '子账户'
          break;
        case 4:
          item.typeString = '自助收银机(商户内终端)'
          break;
        case 5:
          item.typeString = '自助收银机(商户外终端)'
          break;
        default:
          item.typeString = '???'
          break;
      }
    })
    this.vueThat.tableListdata = objs
    return false
  },

  vueThat: "",

  tableurl: location.pathname + '/data',

  userType: "",

  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        var checkPhone = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('手机号不能为空'));
          } else {
            const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('请输入正确的手机号'));
            }
          }
        };
        var checkAccount = (rule, value, callback) => {
          if (!value) {
            return callback(new Error('账号不能为空'));
          } else {
            const reg = /^[0-9a-zA-Z]*$/g
            if ((value.length > 10) || (value.length < 4)) {
              return callback(new Error('账号长度小于4位或大于10位'));
            }
            if (reg.test(value)) {
              callback();
            } else {
              return callback(new Error('账号只能由字母或数字组成'));
            }
          }
        };
        return {
          dialogFormVisible: that.vueThat.dialogFormVisible || false,
          messageform: {
            account: '',
            sex: '',
            fullName: '',
            password: '',
            cellphone: '',
            email: '',
            type: '',
          },
          formrules: {
            account: [
              { required: true, message: '账号不能为空', trigger: 'blur' },
              { validator: checkAccount, trigger: 'blur' }
            ],
            fullName: [
              { required: true, message: '请输入昵称', trigger: 'blur' },
            ],
            password: [
              { required: true, message: '请输入密码', trigger: 'blur' },
            ],
            cellphone: [
              { required: true, message: '手机号不能为空', trigger: 'blur' },
              { validator: checkPhone, trigger: 'blur' }
            ],
            sex: [
              { required: true, message: '请选择性别', trigger: 'change' },
            ],
            type: [
              { required: true, message: '请选择类型', trigger: 'change' },
            ],
            email: [
              { required: true, type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
          },
          formLabelWidth: '120px',
          tableListdata: that.vueThat.tableListdata || []
        }
      },
      methods: {
        closedialogFrom: function () {
          this.$refs.messageform.resetFields();
          that.vueThat.dialogFormVisible = false
        },
        checkFrom: function () {
          let _that = this
          this.$refs.messageform.validate(function (result, object) {
            if (result && object) {
              _that.openFullScreen()
              $.ajax({
                type: 'POST',
                dataType: 'json',
                url: location.pathname + '/addManagement',
                data: that.vueThat.messageform,
                success: function (res) {
                  if (res.retCode == 200) {
                    that.vueThat.dialogFormVisible = false
                    _that.$message({
                      type: 'success',
                      message: '添加成功!'
                    });
                    setTimeout(() => {
                      window.location.reload()
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

            }
          })
        }
      },
      mounted: function () {

      },
      watch: {

      }
    });
  },

  // 元素节点变换
  initPage: function () {
    if (vueObj.getCookie('userType') != 2) {
      $('#addNewProduct').remove()
    }
  },

  init: function () {
    this.initPage()
    vueObj.initPage()
    this.userType = vueObj.getCookie('userType')
    this.initVue()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})