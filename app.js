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

    // 地区拉取API
    GetRegion(that);

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

            // 获取定位
            GetGeo(that, that.globalData.GeoMap.Config.provinces)

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

              // 获取定位
              GetGeo(that, that.globalData.GeoMap.Config.provinces)

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
    lecturer:{
      classid:0,
      className:'',
      isShow:false
    },
    // 定位对象
    GeoMap:{
      // 集合对象
      Config:{},
      // 默认定位北京市的
      ProvinceId:20,
      // 默认定位北京市
      ProvinceName:'广东省',
      CityId:213,
      CityName:'广州市'
    }
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
      wx.setStorage({
        key: 'userInfo',
        data: res.data.data,
      })
      //typeof cb == "function" && cb(that.globalData.userInfo)
    },
    fail: function () {
      // wx.hideToast();
    },
    complete: function () {
    }
  })
}

// 地区拉取API
function GetRegion(that) {
  api.wxRequest({
    success: (res) => {  
      //同步存储
      wx.setStorageSync('config', res.data.data);
      that.globalData.GeoMap.Config = res.data.data;
    },
    fail: function (res) {
      console.log('地区失败');
      console.log(res);
    }
  }, api.host + api.iconfig)
}

// 获取定位
function GetGeo(that,region){
  // 实例化API核心类
  var qqmapwx = new QQMapWX({
    key: api.QQMapKey // 必填
  });
  // 如果从首页导航进来############不要获取地理位置
  // 获取地理信息
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      console.log('wgs 84 success');
      console.log(res);
      // 调用接口
      qqmapwx.reverseGeocoder({
        location: {
          //纬度，浮点数，范围为-90~90，负数表示南纬
          latitude: res.latitude,
          //经度，浮点数，范围为-180~180，负数表示西经
          longitude: res.longitude
        },
        success: function (res) {
          console.log('get location success');
          console.log(res);
          var region2 = region;
          var Lprovince = res.result.ad_info.province;
          var Lcity = res.result.ad_info.city;
          // 遍历,得到默认的ID
          [].forEach.call(region, function (item, i, arr) {
            if(item.name == that.globalData.GeoMap.ProvinceName) {
              that.globalData.GeoMap.ProvinceId = item.id;
            }
          });
          // 遍历集
          [].forEach.call(region2, function (item1, i1, arr1) {
            if (item1.name == Lprovince && item1.nop > 0) {
              // 记录省ID
              that.globalData.GeoMap.ProvinceId = item1.id;
              that.globalData.GeoMap.ProvinceName = item1.name;
              [].forEach.call(item1.citys, function (itemc, ic, arrc) {
                if (itemc.name == Lcity && itemc.nop > 0) {
                  that.globalData.GeoMap.CityId = itemc.id;
                  that.globalData.GeoMap.CityName = itemc.name;
                }
              })
            }
          });
        },
        fail: function (res) {
          console.log('get location fail.');
          console.log(res);
        }
      });
    },
    fail: function (res) {
      console.log('get wgs84 fail.');
      console.log(res);
    },
    complete:function(res){
      console.log('get wgs84 complete.');
      console.log(res);
    }
  });
}