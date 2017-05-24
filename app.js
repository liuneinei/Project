var api = require('api/api.js')

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
              console.log(uinfo);
              
              //一定要把加密串转成URI编码
              var encryptedData = encodeURIComponent(res.encryptedData);
              var iv = res.iv;
              //请求自己的服务器
              Login(that,code, encryptedData, iv);
              // 地区拉取API
              GetRegion();
              typeof cb == "function" && cb(that.globalData.userInfo)
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
function Login(that,code, encryptedData, iv) {
  //创建一个dialog
  // wx.showToast({
  //   title: '正在登录...',
  //   icon: 'loading',
  //   duration: 10000
  // });
 
  // //请求服务器
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
      // success
      wx.hideToast();
      that.globalData.userInfo = res.data.data;
      console.log('5-24获取222222');
      console.log(res);
      var ii='';
      ii='\'[]';
      for(var i=0;i=res.data.length;i++){
        ii[i]=res.data[i];
      }
      ii += ']\'';
      console.log(ii);
      console.log(JSON.parse(ii));
      console.log(res.header);
      
      // console.log(that.globalData.userInfo);
      console.log('5-24获取结束2');
      
      // 保存本地缓存
      wx.setStorage({
        key: 'userInfo',
        data: res.data.data,
      })
    },
    fail: function () {
      // fail
      // wx.hideToast();
    },
    complete: function () {
      // complete
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