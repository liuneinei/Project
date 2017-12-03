
var util = require('../../utils/util.js')
Page({
  data: {

  },
  onLoad: function () {

  },

  // Begin: 事件处理
  /*
  * 我要入库
  */
  btnmyapply:function(){
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.redirectTo({
      url: '/pages/myapply/myapply'
    })
  },

  /*
  * 专家资料修改
  */
  btnbusapply:function(){
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.redirectTo({
      url: '/pages/busapply/busapply'
    })
  },
  btnbusdesc:function(){
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.redirectTo({
      url: '/pages/busdesc/busdesc'
    })
  },
  /*
  * 修改服务项
  */
  btnbusservice:function(){
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.redirectTo({
      url: '/pages/busservice/busservice'
    })
  },
  // End: 事件处理
})
