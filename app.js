var api = require('api/api.js')
var aldstat = require('utils/ald-stat.js');
var configs = require('pages/configs.js');
// 引入SDK核心类
var QQMapWX = require('utils/qqmap-wx-jssdk.min.js');

//app.js
App({
  onLaunch: function () {
    var that = this;
  },
  getUserInfo: function (cb) {
    var that = this
    if (configs.userinfo){
      typeof cb == "function" && cb(configs.userinfo)
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
              configs.userinfo = uinfo
              
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
      configs.userinfo = res.data.data;
    },
    fail: function () {
      // wx.hideToast();
    },
    complete: function () {
    }
  })
}