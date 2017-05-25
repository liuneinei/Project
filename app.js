var api = require('api/api.js')
var json2 = require('utils/json2.js')

//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb){
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
              // 地区拉取API
              GetRegion();
              
            }
          })
        }
      })
    }
  },
  globalData:{
    userInfo:null
  }
})
// 小程序登录
function Login(that, code, encryptedData, iv, cb) {
  //创建一个dialog
  // wx.showToast({
  //   title: '正在登录...',
  //   icon: 'loading',
  //   duration: 10000
  // });
 
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
      wx.setStorage({
        key: 'userInfo',
        data: res.data.data,
      })

      typeof cb == "function" && cb(that.globalData.userInfo)
    },
    fail: function () {
      // wx.hideToast();
    },
    complete: function () {
    }
  })
}

// 地区拉取API
function GetRegion() {
  api.wxRequest({
    success: (res) => {
      wx.setStorage({
        key: 'config',
        data: res.data.data,
      })
    },
    fail: function (res) {
    }
  }, api.host + api.iconfig)
}

function STrim(str){
  return str.replace(/(^\s*)|(\s*$)/g, "");
}