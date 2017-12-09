var api = require('../../api/api.js');
var configs = require('../configs.js');
var functions = require('../functions.js');

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    region: [],
    regionapi: true,
    regnavCus: 0,
    wHeight: 300,
    ProvinceId: 0,
    ProvinceName: '',
    citys: []
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
    });

    // 第一步 获取ApiConfig/StoreConfig信息，为后续遍历加载
    functions.getconfig(function (res) {
      that.setData({
        region: res.provinces
      })
    });
  },
  // ##:beging 事件处理 
  // 选择省
  provinceTap: function (event) {
    var that = this;
    var citys = [];
    var pid = event.target.dataset.id;
    var pname = event.target.dataset.name;
    [].forEach.call(that.data.region, function (item, i, arr) {
      if (item.id == pid) {
        citys = item.citys
      }
    });

    that.setData({
      regnavCus: pid,
      citys: citys,
      ProvinceId: pid,
      ProvinceName: pname,
    })
  },
  //选择市
  cityTap: function (event) {
    var that = this;
    var pid = that.data.ProvinceId;
    var pname = that.data.ProvinceName;
    var cid = event.target.dataset.id;
    var cname = event.target.dataset.name;
    var pnameIndex = pname.indexOf('市');
    if (pnameIndex >= 0) {
      cname = '';
    }
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.changeCity(pid, cid, pname + cname);
    }
    wx.navigateBack({
      delta: 1
    });
  },
  // ##:end 事件处理 
});
