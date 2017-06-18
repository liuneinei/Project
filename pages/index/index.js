var api = require('../../api/api.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // 主机域名 - 七牛文件
    host: '',
    iImgExt: '',
    // 讲师列表
    lecturers: [],
    // 分页指数
    requests: {
      // 查看的详情实体
      Model: {},
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
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu,
      iImgExt: api.iImgExt
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
    console.log('app.js');
    console.log(app.globalData);
    // 讲师推荐
    GetRecommend(that)
  },
  // :begin 事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 导航栏
  LecturerTap: function (event) {
    var id = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.title;
    wx.setStorageSync('ilclass', { classid: id, className: title, isShow:true});
    wx.switchTab({
      url: '../lecturer/lecturer' ,
      success:function(res){
        console.log('index success')
        console.log(res)
      },
      fail:function(res){
        console.log('index fail')
        console.log(res)
      }
    })
  },
  // 讲师详情
  LecturerInfoTap:function(event){
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lecturerinfo/lecturerinfo?id='+id,
    })
  }
  // :end 事件
})

// 讲师推荐
function GetRecommend(that){
  api.wxRequest({
    success:function(res){
      var dataObj = res.data
      var result = dataObj.data;
      that.setData({
        lecturers: result
      })
      wx.setStorageSync('recommend', result);
    },
    fail:function(res){
      var recommend = wx.getStorageSync('recommend');
      that.setData({
        lecturers: recommend
      })
    }
  }, api.host + api.iRecommend)
}
