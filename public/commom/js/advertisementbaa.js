let video = '<video src="/advertisement/video.mp4" controls="controls"></video>'
var obj = {

  vueThat: "",

  bindEvent: function () {
    let that = this
    let imgArray = []
    $('.upliad_img').on('change', function () {
      let num = $(this).attr('name')
      let img = $('#img' + num)

      if (this.files[0].type != 'image/png' && this.files[0].type != 'image/jpeg' && this.files[0].type != 'image/gif') {
        return alert("图片上传格式不正确");
      }

      var imgfile = this.files[0]

      //创建用来读取此文件的对象
      var reader = new FileReader()
      //读取文件成功后执行的方法函数
      reader.readAsDataURL(imgfile);

      //读取文件成功后执行的方法函数
      reader.onload = function (e) {
        imgArray.push({
          num: num,
          img: imgfile
        })
        img.attr('src', e.target.result)
      }

    })

    $('#addNewImg').on('click', function () {
      if (+imgArray.length > 0) {
        obj.vueThat.openFullScreen()
        imgArray.forEach((element, index) => {
          let formFile = new FormData()
          formFile.append('file', element.img, 'banner_' + element.num + '.jpg');
          $.ajax({
            type: 'POST',
            url: location.pathname + '/upload',
            processData: false, // processData和contentType需设置为false
            contentType: false,
            data: formFile,
            success: function (res) {
              if (res.code == 200) {
                obj.vueThat.$message({
                  type: 'success',
                  duration: '2000',
                  message: res.msg
                })
              } else {
                obj.vueThat.$message({
                  type: 'info',
                  duration: '2000',
                  message: res.msg
                })
                that.initPage(element.num)
              }
            },
            error: function (res) {
              obj.vueThat.$message({
                type: 'info',
                duration: '2000',
                message: '请检查网络连接'
              })
              that.initPage(element.num)
            }
          })
        })
        imgArray = []
        obj.vueThat.closeloading()
      }
    })

    $('#videoInput').on('change', function () {
      if (this.files[0].type != 'video/mp4') {
        return alert("图片上传格式不正确");
      }
      console.log(123)
      var file = this.files[0]

      //创建用来读取此文件的对象
      var reader = new FileReader()
      //读取文件成功后执行的方法函数
      reader.readAsDataURL(file);

      //读取文件成功后执行的方法函数
      reader.onload = function (e) {
        let formFile = new FormData()
        formFile.append('file', file);
        $.ajax({
          type: 'POST',
          url: location.pathname + '/video/upload',
          processData: false, // processData和contentType需设置为false
          contentType: false,
          data: formFile,
          success: function (res) {
            if (res.code == 200) {
              obj.vueThat.$message({
                type: 'success',
                duration: '2000',
                message: res.msg
              })
              $('video').remove()
              $('#video').append(video)
            } else {
              obj.vueThat.$message({
                type: 'info',
                duration: '2000',
                message: res.msg
              })
              that.initPage(element.num)
            }
          },
          error: function (res) {
            obj.vueThat.$message({
              type: 'info',
              duration: '2000',
              message: '请检查网络连接'
            })
            that.initPage(element.num)
          }
        })
      }

    })
  },

  initPage: function (index) {
    // $('.bannerImg').each((index,element) =>{
    $(element).attr('src', '../advertisement/banner_' + index + '.jpg?timer=' + Date.parse(new Date()))
    // })
  },

  initVue: function () {
    let that = this
    that.vueThat = new Vue({
      el: '#vueTemplate',
      data() {
        return {

        }
      },
      methods: {

      },
      mounted: function () {

      },
      watch: {

      }
    });
  },

  init: function () {
    this.initVue()
    this.bindEvent()
  }
}

$(function () {
  obj.init()
})