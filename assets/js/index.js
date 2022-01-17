$(function () {
  getUserInfo()
  var layer = layui.layer

  $('#btnLogout').on('click', function () {
    //提示用户是否确认退出
    layer.confirm('确认退出登录?', { icon: 3, title: '提示' }, function (index) {
      //do something
      //1. 清空本地存储的 token
      localStorage.removeItem('token')
      //2. 重新跳转到登录页面
      location.href = '/login.html'
      layer.close(index);
    });


  })
})
//获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: 'GET',
    url: '/my/userinfo',
    //headers 就是 请求头配置对象
    // headers: {
    //   Authorization: localStorage.getItem('token') ||
    //     ''
    // },
    success: function (res) {
      if (res.status !== 0) {
        return layui.layer.msg('获取用户信息失败')
      }
      renderAvatar(res.data)

    },
    // //不论成功失败 最终会调用 complete 回调函数
    // complete: function (res) {
    //   console.log(res);
    //   //在complete 回调函数中 可以使用res.respondeJSON 拿到服务器响应回来的数据
    //   if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
    //     //1. 清空本地存储的 token
    //     localStorage.removeItem('token')
    //     //2. 重新跳转到登录页面
    //     location.href = '/login.html'
    //   }

    // }
  })

}


//渲染用户头像
function renderAvatar(user) {
  var name = user.nickname || user.username
  //设置欢迎文本
  $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
  //3. 按需渲染用户头像
  if (user.user_pic !== null) {
    //渲染图片头像
    $('.layui-nav-img').attr('src', user.user_pic).show()
    $('.text-avatar').hide()
  } else {
    // 渲染文本头像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
  }
}

