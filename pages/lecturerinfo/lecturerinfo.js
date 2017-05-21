var api = require('../../api/api.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '加入我们'
    })
  },
  onLoad: function () {
    var that = this;

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
  },
  // :begin 事件处理
  imgTap:function(event){
    console.log('处理');
    var objoin = app.globalData.objoin;
    objoin.referee = '我是推荐人';
    app.globalData.objoin = objoin;

    wx.navigateBack({
      delta:1
    })
  }
  // :end 事件处理
})
