$(function () {

  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage;

  //定义 美化时间的过滤器
  template.defaults.imports.dataFormat = function (data) {
    const dt = new Date(data)
    console.log(dt);
    var y = padZero(dt.getFullYear())
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }
  //定义补零函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
  //定义一个查询对象 将来请求数据的时候，

  ///需要将请求参数的对象提交到服务器
  var q = {
    pagenum: 1, //页码值，默认请求第一页的数据
    pagesize: 2,//每页显示几条数据，默认煤业显示两条
    cate_id: '',// 文章分类的id
    state: '' //文章的发布状态
  }
  initTable()
  initCate()
  //获取文章列表数据的方法
  function initTable() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: q,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类的列表失败！')
        }
        console.log(res);
        res.data = [
          { id: 1, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:9:3.817', state: '草稿' },
          { id: 2, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:8:8.817', state: '草稿' },
          { id: 3, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:4:3.817', state: '草稿' },
          { id: 4, title: 'title', cate_name: '美食', pub_date: '2021-1-16 20:8:3.817', state: '草稿' }

        ]

        //使用模板引擎渲染页面的数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        //渲染分页的方法
        renderPage(res.total)
      }
    })
  }


  // 初始化文章的分类
  function initCate() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layui.msg('获取文章分类数据失败！')
        }
        //调用模板引擎渲染分类的可选项

        var htmlStr = template('tpl-cate', res)

        $('[name=cate_id').html(htmlStr)

        form.render()
      }
    })
  }
  // 为筛选表当绑定 sunbmit 时件
  $('#form-search').on('submit', function (e) {
    e.preventDefault()
    //获取表单中选中项的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象 q 中对应的属性赋值
    q.cate_id = cate_id
    q.state = state
    //根据最新的筛选条件，重新渲染 表格中的数据
    initTable()
  })
  //定义渲染分页的方法
  function renderPage(total) {
    console.log(total);
    //调用 laypage.render()  方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', //每页显示几条数据
      count: total, // 总数据条数
      limit: q.pagesize, //每页显示的几条数据
      curr: q.pagenum,//  设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10],
      //分页发生切换的时候 触发 jump 回调
      //触发jump 回调的方式有两种
      // 1. 点击页码的时候 会触发 jump 回调
      // 2. 只要调用的 layage.render ()方法， 就会触发jump 回调
      // 第二中方法 导致死循环的问题
      jump: function (obj, first) {
        //可以通过 first 的值 ， 来判断是通过那种方式，触发的jump 回调
        //如果  first 的值为 true ，证明是方法2 触发的
        //否则就是方法1 触发的
        console.log(first);
        console.log(obj.curr);
        //把最新的页码值 赋值到q 这个查询参数对象中

        q.pagenum = obj.curr
        //把最新的条目数 赋值到q这个查询 参数对象的 pagesize 属性中
        q.pagesize = obj.limit
        //根据最新的q 获取对应的数据列表 并渲染表格


        if (!first) {
          initTable()
        }
      }
    })
  }
  //通过代理的形式，为删除按钮绑定点击事件
  $('tbody').on('click', 'btn-delete', function () {
    //获取 删除按钮的个数
    var len = $('.btn-delete').length
    console.log(len);
    //获取文章的id
    var id = $(this).attr('data-id')
    //询问客户是否需要删除数据
    layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
      //do something
      $.ajax({
        method: 'GET',
        url: '/my/article/delete' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          //当数据删除完成之后，需要判断 当前这一页中， 是否还有剩余的数据
          //如果没有剩余的 数据，则让页码值-1 之后
          //再重新调用initTable （） 方法
          if (len === 1) {
            //如果len 的值等于 1 ，证明删除完毕之后， 页面上就没有任何数据了
            //页码值最小必须是1
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          //重新渲染页面
          initTable()
        }
      })
      layer.close(index);
      //自动关闭弹框
      layer.close(index)
    });
  })
})


