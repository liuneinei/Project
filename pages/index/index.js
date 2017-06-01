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
    },
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '预约服务'
    })
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
    var goblaLec = app.globalData.lecturer
    goblaLec.classid = id
    goblaLec.isShow = true;
    goblaLec.className = title;
    app.globalData.lecturer = goblaLec
    wx.switchTab({
      url: '../lecturers/lecturers' ,
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
    var that = this;
    var id = event.target.dataset.id;
    var obj = event.currentTarget.dataset.obj;
    var requests = that.data.requests;
    requests.Model = obj;
    that.setData({
      requests: requests
    })
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
      wx.setStorage({
        key: 'recommend',
        data: result,
      })
    },
    fail:function(res){
      console.log('index lecturere fail');
      console.log(res);
      wx.getStorage({
        key: 'recommend',
        success: function(res) {
          that.setData({
            lecturers: res.data
          })
        },
      })
    }
  }, api.host + api.iRecommend)
}
