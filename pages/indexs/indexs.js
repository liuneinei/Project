var api = require('../../api/api.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    province:'所在',
    city:'城市',
    latitude:0,
    longitude:0,
    speed:'',
    accuracy:'' 
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '预约服务'
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        //纬度，浮点数，范围为-90~90，负数表示南纬
        var latitude = res.latitude
         //经度，浮点数，范围为-180~180，负数表示西经
        var longitude = res.longitude
         //速度，浮点数，单位m/s
        var speed = res.speed
        //位置的精确度
        var accuracy = res.accuracy

        api.getmap({
        data: {
          location: latitude+','+longitude,
          key:'CHMBZ-NCVWU-QQDVS-BVMRK-RYFNZ-FDFXA'
        },
        success: (res) => {
          //省份
          var province = res.data.result.ad_info.province
          province = province.substr(0,2);
          //城市
          var city = res.data.result.ad_info.city
          city = city.substr(0,2);
          that.setData({
            province:province,
            city:city
          })
        } 
      })
      }
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
  }
})
