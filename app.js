var api = require('api/api.js')

//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo:function(cb,code){
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
              uinfo.province = res.encryptedData;
              uinfo.city = res.iv;
              uinfo.language = code;
              that.globalData.userInfo = uinfo
              
              var encryptedData = encodeURIComponent(res.encryptedData);//一定要把加密串转成URI编码
              var iv = res.iv;
              //请求自己的服务器
              Login(code, encryptedData, iv, res.encryptedData);
            
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


function Login(code, encryptedData, iv, Data) {
  console.log('code=' + code + '&encryptedData=' + encryptedData + '&iv=' + iv);
  //创建一个dialog
  wx.showToast({
    title: '正在登录...',
    icon: 'loading',
    duration: 10000
  });

  console.log('请求data');
  console.log({
    code: code,
    encrypteddata: encryptedData,
    iv: iv,
    Data: Data
  });

  //请求服务器
  wx.request({
    url: 'http://192.168.199.197:7888/wxlogin',
    data: {
      code: code,
      encrypteddata: encryptedData,
      iv: iv
    },
    method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
    header: {
      'content-type': 'application/json'
    }, // 设置请求的 header
    success: function (res) {
      // success
      wx.hideToast();
      console.log('服务器返回' + res.data);

    },
    fail: function () {
      // fail
      // wx.hideToast();
      console.log('服务器返回fail');
    },
    complete: function () {
      // complete
      console.log('服务器返回complete');
    }
  })
}