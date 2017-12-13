var api = require('../../api/api.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // Banner集
    bannerdata:{
      List: [
        {
          img: 'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
          url:''
        },
        {
          img: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          url: ''
        },
        {
          img: 'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
          url: ''
        }
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 1000
    },
    // 讲师列表
    lecturers: [],
    // 扩展属性
    exp:{
      // 主机域名 - 七牛文件
      host: '',
    }
  },
  onShareAppMessage: function () {
      return {
        title: '亲密孕育专业人才库',
        path: '/pages/index/index',
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
    },
  onLoad: function () {
    var that = this;
    // 初始化扩展属性
    InitExp(that);

    // 讲师推荐
    InitLecturers (that)
  },
  // 讲师详情
  LecturerInfoTap:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/lecturerinfo/lecturerinfo?id='+id,
    })
  }
  // :end 事件
})


// Begin : 扩展方法
/*
* 初始化扩展属性
*/
function InitExp(that){
  var _exp = that.data.exp;
  _exp.host = api.iQiniu;
  that.setData({
    exp: _exp,
  })
}

/*
* 讲师推荐
*/
function InitLecturers(that) {
  api.wxRequest({
    success: function (res) {
      var result = res.data.data;
      that.setData({
        lecturers: result
      })
      wx.setStorageSync('$recommend', result);
    },
    fail: function (res) {
      var $recommend = wx.getStorageSync('$recommend');
      that.setData({
        lecturers: $recommend
      })
    }
  }, api.host + api.iRecommend)
}
// End : 扩展方法