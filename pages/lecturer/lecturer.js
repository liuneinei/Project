var api = require('../../api/api.js')
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

//测试数据
var lecturer = require('../../api/testdata/lecturer.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // 屏幕高度
    wHeight: 300,
    // 是否显示
    geoshow:true,
    // 显示的操作 1分类 2城市
    classshow:0,
    // 分类集(json)
    classl: [],
    // 省集(json)
    region: [],
    // 市集(json)
    citys:[],
    // 选中的分类
    classid: 0,
    // 选中的省
    provinceid: 0,
    // 选中的市
    cityid: 0,
    // 讲师列表
    lecturers: []
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
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../lecturerinfo/lecturerinfo?id='+id
    })
  },
  onLoad: function (options) {
    var that = this;
    // 获取系统信息，提取屏幕高度
    wx.getSystemInfo({
        success: function(res) {
            that.setData({
                wHeight:res.windowHeight-53
            })
        }
    })
    // 本地存储 - 城市
    wx.getStorage({
      key: 'region',
      success: function (res) {
        that.setData({
          region: res.data
        })
      },
    })
    that.setData({
      lecturers: lecturer.lecturer
    })
    // 实例化API核心类
    var qqmapwx = new QQMapWX({
      key: api.QQMapKey // 必填
    });
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // 调用接口
        qqmapwx.reverseGeocoder({
          location: {
            //纬度，浮点数，范围为-90~90，负数表示南纬
            latitude: res.latitude,
            //经度，浮点数，范围为-180~180，负数表示西经
            longitude: res.longitude
          },
          success: function (res) {
            console.log(res);
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          }
        });
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
  // :beging 事件处理
  //服务选项
  ClassdTap:function(e){
    let that = this;
    var classshow = 1;
     var geoshow=false;
     if (that.data.classshow == 1){
      classshow=0;
       geoshow=true;
    }
     that.setData({
      geoshow: geoshow,
      classshow: classshow
    });
  },
  // 地区选择
  RegionTap:function(e){
    var that = this;   
    var classshow = 2;
    var geoshow=false;
    if (that.data.classshow == 2){
      classshow=0;
      geoshow=true;
    }
    that.setData({
      geoshow: geoshow,
      classshow: classshow
    });
  },
  // 选择省
  ProvinceTap: function (event){
    var _this = this;  
    var citys=[];
    var pid = event.target.dataset.id;
      [].forEach.call(_this.data.region, function (item, i, arr) {
        if (item.id == pid) {
          citys = item.citys;
        }
      });
      citys.splice(0, 0, {
        "id": 0,
        "name": "全省"
      });
      _this.setData({
        provinceid: pid,
        citys: citys
      })
  },
  // 选择类别
  ClassTap:function(event){
    var cid = event.target.dataset.id;
  },
  // :end 事件处理
})
