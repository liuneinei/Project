var api = require('../../api/api.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // 讲师列表
    lecturers: []
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '预约服务'
    })
  },
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });

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
    var id = event.target.dataset.id;
    wx.redirectTo({
      url: '../lecturer/lecturer?id=' + id,
    })
  },
  // 讲师详情
  LecturerInfoTap:function(event){
    var id = event.target.dataset.id;
    wx.redirectTo({
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
      console.log(dataObj);
      that.setData(function(){
        lecturers: result
      })
    },
    fail:function(res){}
  }, api.host + api.iRecommend)
}
