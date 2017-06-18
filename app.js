var api = require('api/api.js')
var aldstat = require('utils/ald-stat.js');
// 引入SDK核心类
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');

//app.js
App({
  onLaunch: function () {
    var that = this;
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //调用登录接口
    wx.login({
      success: function (rel) {
        var code = rel.code;
        wx.getUserInfo({
          success: function (res) {
            var uinfo = res.userInfo;
            uinfo.encryptedData = encodeURIComponent(res.encryptedData);
            uinfo.iv = res.iv;
            uinfo.code = code;
            that.globalData.userInfo = uinfo

            //一定要把加密串转成URI编码
            var encryptedData = encodeURIComponent(res.encryptedData);
            var iv = res.iv;

            //请求自己的服务器
            Login(that, code, encryptedData, iv);
          }
        })
      }
    })
  },
  getUserInfo: function (cb) {
    typeof cb == "function" && cb(this.globalData.userInfo)
    return;
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
        success: function (rel) {
          var code = rel.code;
          wx.getUserInfo({
            success: function (res) {
              var uinfo = res.userInfo;
              uinfo.encryptedData = encodeURIComponent(res.encryptedData);
              uinfo.iv = res.iv;
              uinfo.code = code;
              that.globalData.userInfo = uinfo
              
              //一定要把加密串转成URI编码
              var encryptedData = encodeURIComponent(res.encryptedData);
              var iv = res.iv;

              //请求自己的服务器
              Login(that,code, encryptedData, iv,cb);
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null,
  }
})
// 小程序登录
function Login(that, code, encryptedData, iv) {
  // 请求服务器
  wx.request({
    url: api.host + api.iwxlogin,
    data: {
      code: code,
      encrypteddata: encryptedData,
      iv: iv
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'Content-Type': 'json'
    }, // 设置请求的 header
    success: function (res) {
      //wx.hideToast();
      that.globalData.userInfo = res.data.data;
      // 保存本地缓存
      wx.setStorageSync('userInfo', res.data.data);
      //typeof cb == "function" && cb(that.globalData.userInfo)
    },
    fail: function () {
      // wx.hideToast();
    },
    complete: function () {
    }
  })
}