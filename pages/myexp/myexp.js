
var util = require('../../utils/util.js')
var functions = require('../functions.js');

Page({
  data: {
    showdata:{
      services:[]
    }
  },
  onLoad: function () {
    var that = this;

    var _showdata = that.data.showdata;

    // 第一步 获取ApiConfig/StoreConfig信息，为后续遍历加载
    functions.getconfig(function (res) {
      _showdata.services = res.services;
      that.setData({
        showdata: _showdata
      })
    });
  },

  // Begin: 事件处理
  /*
  * 下一步操作
  */
  formSubmit: function () {
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.navigateTo({
      url: '/pages/mydesc/mydesc'
    })
  },
  // End: 事件处理
})
