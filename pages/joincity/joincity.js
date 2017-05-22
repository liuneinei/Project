var api = require('../../api/api.js')
var region = require('../../api/testdata/region.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    region: [],
    regionapi: true,
    regnavCus:0,
    wHeight: 300,
    citys:[]
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '亲密育儿人才库'
    })
  },
  onLoad: function () {
    var that = this;
    // 获取系统信息，提取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wHeight: res.windowHeight - 40
        })
      }
    })
    that.setData({
      region: region.region
    })
  },
  // ##:beging 事件处理 
  // 选择省
  provinceTap: function (event) {
    var that = this;
    var citys = [];
    var pid = event.target.dataset.id;
    if (pid <= 0) {
      // 请求api
      that.setData({
        regnavCus: pid,
        citys: citys
      })
    } else {
      [].forEach.call(that.data.region, function (item, i, arr) {
        if (item.id == pid) {
          citys = item.city;
          // console.log(item.city)
        }
      });
      that.setData({
        regnavCus: pid,
        citys: citys
      })
    }
  },
  //选择市
  cityTap:function(event){
    var that = this;
    var cid = event.target.dataset.id;
    
  },
  // ##:end 事件处理 
});
