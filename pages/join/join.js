var api = require('../../api/api.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    imageURL:'',
    imageObject: {}
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
  // ##:beging 事件处理 
  //上传头像
  uploadheadTap:function(event){
    var that = this;
    didPressChooesImage(that);
  }
  // ##:end 事件处理 
});

// 上传
function didPressChooesImage(that) {
  // 微信 API 选文件
  wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        //上传
        wx.uploadFile({
          url: 'https://up-z2.qbox.me',//如果是华北一请用up-z1.qbox.me
            filePath: filePath,
            name: 'file',
            formData: {
                'key': 'test.jpg',
                'token': uptoken
            },
            success: function(res) {
                console.log(res);
            },
            fail(error) {
                console.log(error)
            },
            complete(res) {
                console.log(res)
            }
        });
      }
    })
}
