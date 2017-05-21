var api = require('../../api/api.js')
var region = require('../../api/testdata/region.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    region: [],
    regionapi: true,
    wHeight: 300,
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '亲密育儿人才库'
    })
  },
  onLoad: function () {
    // 获取系统信息，提取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wHeight: res.windowHeight - 40
        })
      }
    })
  },
  // ##:beging 事件处理 
  // 选择省
  provinceTap: function (event) {
    var _this = this;
    var citys = [];
    var pid = event.target.dataset.id;
    if (pid <= 0) {
      // 请求api
      _this.setData({
        regnavCus: pid,
        citys: citys
      })
    } else {
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
  },
  ClassTap:function(event){
    console.log('事件触发');
    
    //获取页面栈
        var pages = getCurrentPages();
        console.log(pages);
        if(pages.length > 1){
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];

            console.log(pages.length);
            console.log(prePage);
            
            //关键在这里
            prePage.changeData(1,'类别')
        }
    wx.navigateBack({
      delta:1
    })
  },
  // ##:end 事件处理 
});
