var api = require('../../api/api.js')
var arrs = [1, 2, 3];
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    items:arrs,
    province:'所在',
    city:'城市',
    latitude:0,
    longitude:0,
    speed:'',
    accuracy:'',
    geoshow:true,
    classshow:0,
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '预约服务'
    })
  },
  onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
    console.log('onPullDownRefresh', new Date());
  },
  scroll: function (e) {
    //console.log('scroll'+e)
  },
  scrolltolower: function () {
    console.log('scrolltolower')
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  arrs[3]=4;
  arrs[4]=5;
    that.setData({
            items:arrs
          })
  },
  // 详情
  bingInfo:function(event){
    console.log(event);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id
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
  },
  //服务选项
  servertag:function(e){
    let _this = this;
    var classshow = 1;
     var geoshow=false;
    if (_this.data.classshow == 1){
      classshow=0;
       geoshow=true;
    }
    console.log(classshow)
    _this.setData({
      geoshow: geoshow,
      classshow: classshow
    });
    
  },
  //citytap 城市选择
  citytap:function(e){
    var _this = this;   
    var classshow = 2;
    var geoshow=false;
    if (_this.data.classshow == 2){
      classshow=0;
      geoshow=true;
    }
    console.log(classshow)
    _this.setData({
      geoshow: geoshow,
      classshow:classshow
    }); 
  },
})
