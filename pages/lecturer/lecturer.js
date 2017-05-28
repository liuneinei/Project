var api = require('../../api/api.js')
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // 主机域名 - 七牛文件
    host: '',
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
    // 分页指数
    requests:{
      page:0,
      total:1,
      isfail:false
    },
    // 讲师列表
    lecturers: []
  },
  onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      // console.log('onPullDownRefresh', new Date());
  },
  scroll: function (e) {
    // console.log('scroll'+e)
  },
  scrolltolower: function () {
    // console.log('scrolltolower')
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    // 讲师列表
    GetLecturer(that)
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
                wHeight:res.windowHeight-35
            })
        }
    })
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu
    })
    // 本地存储 - 城市
    wx.getStorage({
      key: 'config',
      success: function (res) {
        that.setData({
          region: res.data.provinces,
          classl:res.data.services
        })
      },
    })
    // 实例化API核心类
    var qqmapwx = new QQMapWX({
      key: api.QQMapKey // 必填
    });
    // 获取地理信息
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
            var Lprovince = res.result.ad_info.province;
            var Lcity = res.result.ad_info.city;
            // 选中的省
            var provinceid = that.data.provinceid;
            // 选中的市
            var cityid = that.data.provinceid;
            // 遍历集
            [].forEach.call(that.data.region, function (item, i, arr) {
              if (item.name == Lprovince) {
                // 记录省ID
                provinceid = item.id;
                [].forEach.call(item.citys,function(itemc,ic,arrc){
                  if (itemc.name == Lcity){
                    cityid = itemc.id
                  }
                })
              }
            })
            that.setData({
              provinceid: provinceid,
              cityid: cityid
            })
          }
        });
      }
    });

    // 讲师列表
    GetLecturer(that)

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
          if(citys[0].id != 0){
            citys.splice(0, 0, {
              "id": 0,
              "name": "全省"
            });
          }
        }
      });
      
      _this.setData({
        provinceid: pid,
        citys: citys
      })
  },
  // 选择类别
  ClassTap:function(event){
    var that = this;
    var cid = event.target.dataset.id;
    that.setData({
      classid: cid
    });
  },
  // :end 事件处理
})

// 讲师列表
function GetLecturer(that){
  var requests = that.data.requests;
  var page = (requests.page + 1)
  // 获取讲师列表
  api.wxRequest({
    data: {
      provinceid: that.data.provinceid,
      cityid: that.data.cityid,
      serverid: that.data.classid,
      page: page,
    },
    success: function (res) {
      console.log('lecturer success');
      console.log(res);
      var dataObj = res.data;
      if (dataObj.status == 0) {
        // 分页信息
        var pageObj = dataObj.data;
        // 结果信息
        var result = pageObj.data;
        // 没有出错
        requests.isfail = false;
        requests.page = page;
        // 总页数
        requests.total = pageObj.pageObj;
        // 
        var lecturers = that.data.lecturers.concat(result);
        that.setData({
          lecturers: lecturers,
          requests: requests
        })
      }else{
        requests.page = 0;
        requests.total = 1;
        that.setData({
          lecturers: [],
          requests: requests
        })
      }
    },
    fail: function (res) {
      console.log('lecturer fail');
      requests.isfail = true
      that.setData({
        requests: requests
      })
    }
  }, api.host + api.iLecturer)
}