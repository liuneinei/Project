var api = require('../../api/api.js')
const qiniuUploader = require("../../utils/qiniuUploader");
// 初始化七牛相关参数
function initQiniu() {
  var options = {
    uploadURL:'https://up-z2.qbox.me',
    domain: 'http://oq53vzp2j.bkt.clouddn.com',
    key: 'test.jpg', // 自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
    region: 'SCN', // 区域代码 华东ECN 华北NCN 华南SCN 北美NA
          uptoken:'QrQSGz8wX13Pe5ezSmRpZgmEMRXdkJtILiHcK4d0:uIxPWp8rPhf-vCOFA8B6eT9Yg4c=:eyJzY29wZSI6Inlhbm1hLWVkdS13eGFwcDp0ZXN0LmpwZyIsImRlYWRsaW5lIjoxNDk1MTAzMTk0LCJ1cEhvc3RzIjpbImh0dHA6XC9cL3VwLXoyLnFpbml1LmNvbSIsImh0dHA6XC9cL3VwbG9hZC16Mi5xaW5pdS5jb20iLCItSCB1cC16Mi5xaW5pdS5jb20gaHR0cDpcL1wvMTgzLjYwLjIxNC4xOTgiXX0=',
    //uptokenURL: 'https://[yourserver.com]/api/uptoken'
  };
  qiniuUploader.init(options);
}
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

// 七牛上传
function didPressChooesImage(that) {
  initQiniu();
  // 微信 API 选文件
  wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          console.log(res);
          that.setData({
            'imageObject': res
          });
        }, (error) => {
          console.error('error: ' + JSON.stringify(error));
        });
      }
    }
    // , {
    //   region: 'ECN',
    //   domain: 'balxqjka.btk.clouddn.com',
    //   uptokenURL: 'myServer.cpm/api/uptoken'
    // }
    )
}
