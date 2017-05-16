var api = require('../../api/api.js')
var region = require('../../api/testdata/region.js')
// 引入SDK核心类
var QQMapWX = require('../../api/qqmap-wx-jssdk.min.js');

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    province:0,
    city:0,
    geoshow:true,
    classshow:0,
    wHeight:300,
    region: [],
    regionapi:true,
    regnavCus:0,//选中
    citys:[],//城市
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
    var that = this;
    console.log(that);
    // 获取系统信息，提取屏幕高度
    wx.getSystemInfo({
        success: function(res) {
            that.setData({
                wHeight:res.windowHeight-53
            })
        }
    })
    // 实例化API核心类
    // var qqmapwx = new QQMapWX({
    //   key: api.QQMapKey // 必填
    // });
    
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // 调用接口
        // qqmapwx.reverseGeocoder({
        //   location: {
        //     //纬度，浮点数，范围为-90~90，负数表示南纬
        //     latitude: res.latitude,
        //     //经度，浮点数，范围为-180~180，负数表示西经
        //     longitude: res.longitude
        //   },
        //   success: function (res) {
        //     console.log(res);
        //   },
        //   fail: function (res) {
        //     console.log(res);
        //   },
        //   complete: function (res) {
        //     console.log(res);
        //   }
        // });
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
      classshow:classshow,
      region: region.region
    }); 
  },
  // 选择省
  provinceTap: function (event){
    var _this = this;  
    var citys=[];
    var pid = event.target.dataset.id;
    if (pid<=0){
      // 请求api
      _this.setData({
        regnavCus: pid,
        citys: citys
      })
    }else{
      [].forEach.call(_this.data.region, function (item, i, arr) {
        if (item.id == pid) {
          citys = item.city;
          // console.log(item.city)
        }
      });
      _this.setData({
        regnavCus: pid,
        citys: citys
      })
    }
  }
})
