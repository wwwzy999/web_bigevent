$(function () {
  var layer = layui.layer
  var form = layui.form
  initCate()
  // 初始化富文本编辑器
  initEditor()
  //定义加载 文章分类 
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layui.msg('初始化文章分类失败！')
        }
        //  调用模板引擎 ，渲染下拉菜单
        var htmlStr = template('tpl_cate', res)
        $('[name =cate_id]').html(htmlStr)
        form.render()
      }
    })
  }


  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)



  //
  $('#btnCooseImage').on('click', function () {
    $('#coverFlie').click()

  })
  //监听 coverFlie 的
  $('#coverFlie').on('change', function (e) {
    //获取到文件的列表数组
    var file = target.files
    //判断用户是否选择了文件
    if (files.length === 0) {
      return
    }
    //根据文件，创建对应的 url 地址
    var newImgURL = URL.createObjectURL(file)
    //为 裁剪区域重新设置图片
    $image
      .cropper('destroy')      // 销毁旧的裁剪区域
      .attr('src', newImgURL)  // 重新设置图片路径
      .cropper(options)        // 重新初始化裁剪区域
  })

  //定义文章发布的状态
  var art_state = '已发布'
  //为存为 草稿按钮 ，绑定点击事件 处理函数
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })
  ///为表单绑定 submit 提交时键
  $('#form-pub').on('submit', function (e) {
    //1.阻止表单的默认行为
    e.preventDefault()
    //2 基于form表单 快速创建一个 FormDat 的对象
    var fd = new FormData($(this)[0])
    //3. 将文章的发布状态  存到fd 中
    fd.append('state', art_state)
    //4.将封面裁剪过后的图片,输出为一个文件对象
    $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //5. 将文件对象， 存储到fd 中
        fd.append('cover_img', blob)
        //6. 发起ajax 请求
        publishArticle(fd)


      })

  })
  function publishArticle(fd) {
    $.ajax({
      method: 'POST',
      url: '/my/article/add',
      data: fd,
      //注意： 如果向服务器 提交的是 FormData 格式的数据，
      //必须添加以下两个配置
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        //发布文章成功后，跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
})