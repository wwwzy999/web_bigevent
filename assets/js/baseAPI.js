// //注意：每次调用 $.gt() 或$.post() 或$.ajax()的时候
// //会调用aiaxPrefilter 这个函数
// //在这个函数中 可以拿到我们Ajax 提供的配置对象
// $.ajaxPrefilter(function (options) {
//   // //在发起真正的Ajax 请求之前 统一拼接请求的根路径
//   options.url = 'http://www.liulongbin.top:3007' + options.url
//   // options.url = options.url
//   console.log(options.url);
// })
//注意：每次调用$.get()或$.post()或$.ajax()的时候
//会先调用ajaxPrefilter这个函数
//在这个函数中，可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {
  //再发起真正的ajax请求之前,同i拼搏请求的根路径ajax.frontend.itheima.net
  options.url = 'http://www.liulongbin.top:3007' + options.url
  // 统一为有权限的接口  设置headers 请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }
  //全局统一挂载 complete 回调函数
  options.complete = function (res) {
    //不论成功失败 最终会调用 complete 回调函数

    //在complete 回调函数中 可以使用res.respondeJSON 拿到服务器响应回来的数据
    if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
      //1. 清空本地存储的 token
      localStorage.removeItem('token')
      //2. 重新跳转到登录页面
      location.href = '/login.html'
    }
  }
})
