var login = {

  checkLogin: function () {
    var data = {
      account: $('#loginName').val(),
      password: $('#loginPassword').val()
    }
    $('.loadgin_mask').show()
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: '/adminLogin/login',
      data: data,
      success: function (res) {
        // localStorage.user = {
        //   accessToken: res.retEntity.accessToken,
        //   fullName: res.
        // }
        if (res.retCode == 200) {
          window.location.href = index
        } else {
          $('.loadgin_mask').hide()
          $('.ison_item .left').html(res.retMsg).show()
          console.log(res.retMsg)
        }
      },
      error: function (res) {
        console.log(res.retMsg)
        $('.loadgin_mask').hide()
      }
    })
  },

  init: function () {
    let that = this
    $("#loginPassword,#loginName").on('click', function () {
      $('.ison_item .left').hide()
    })
    $("#login_item").on('click', function () {
      that.checkLogin()
    })

    $("body").bind("keypress", function (e) {
      // 兼容FF和IE和Opera    
      var theEvent = e || window.event;
      var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
      if (code == 13) {
        e.preventDefault();
        //回车执行查询
        that.checkLogin()
      }
    });
  }
}

$(function () {
  login.init()
})