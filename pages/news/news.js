
var api = require('../../api/api.js');
var configs = require('../configs.js');
var functions = require('../functions.js');

Page({
  data: {
    // 课程
    coursesdata:{
      list: [],
    },
    // 请求参数
    req: {
      // 当前页码
      page: 1,
      // 显示的总行数，该值由接口返回，默认值为：10，
      maxlen: 10,
      // 是否正在加载，解决多次向上拉加载请求
      loading: false,
      // 是否已加载完
      over: false
    },
    scroll:{
      height:300,
    },
    // 扩展属性
    exp: {
      host: '',//域名
    }
  },
  onLoad: function () {
    var that = this;
    
    // 初始化扩展属性
    InitExp(that);

    // 课程列表
    getcourse(that, function (res) {
      //回调函数
    });
  },

  // Begin: 事件处理
  /*
  * 滑动底部事件
  */
  scrolltolower: function (event) {
    var that = this;
    var _req = that.data.req;
    if (!_req.loading) {
      // 处理是否为下拉刷新
      _req.loading = true;
      _req.index += 1;  
      that.setData({
        req: _req
      })
      // 课程列表
      getcourse(that, function(res){
        //回调函数
      });
    }
  },

  scroll:function(e){
    console.log('sssssssssss');
  },

  /*
  * 查看详情
  */
  btnCoursesInfo:function(event){
    var that = this;
    var $target = event.currentTarget;
    var $id = $target.dataset.id;

    // 跳转入库页面
    wx.navigateTo({
      url: '/pages/newsinfo/newsinfo?id=' + $id
    });
  },
  // End: 事件处理
})

// Begin : 扩展方法

function InitExp(that) {
  var _exp = that.data.exp;

  // 域名赋值
  if (_exp.host.indexOf('http://') < 0) {
    _exp.host = api.iQiniu;
  }

  // 获取屏幕高度
  var _sysinfo = wx.getSystemInfoSync();
  var _scroll = that.data.scroll;
  _scroll.height = _sysinfo.windowHeight;

  // 重新赋值
  that.setData({
    exp: _exp,
    scroll: _scroll
  });
}

/*
* 加载列表
*/
function getcourse(that, fb){
  // data - 列表
  var _coursesdata = that.data.coursesdata;
  // data - 参数
  var _req = that.data.req;
  // 获取讲师列表
  api.wxRequest({
    data:{
      provinceid: 0,
      cityid: 0,
      serverid: 0,
      page: _req.page,
    },
    success:function(res){
      // api - 接口返回状态
      if (res.statusCode == 200){
        var _data = res.data;
        // api - 接口返回数据状态
        if (_data.status == 0 && _data.errorcode ==0){
          // api - 接口返回数据
          _data = _data.data;
          // data - 显示的记录数
          _req.maxlen = _data.per_page;
          // data - 是否已经加载完
          _req.over = functions.pageover(_data.current_page, _data.per_page, _data.total);

          var $arr = [];
          [].forEach.call(_data.data,function(item,index){
            var $_arr ={
              id: item.id,
              title: item.name,
              img: item.face_img,
              tags: item.service
            };
            $arr.push($_arr);
          });

          if (_req.page <= 1){
            _coursesdata.list = $arr;
          }else{
            _coursesdata.list = _coursesdata.list.concat($arr);
          }

          that.setData({
            coursesdata: _coursesdata,
            req: _req,
          })
        }
      }
    },
    fail:function(res){
      console.log(res);
    }
  }, api.host + api.iLecturer);
}
// End : 扩展方法
