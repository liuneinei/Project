
var util = require('../../utils/util.js');
var api = require('../../api/api.js');
var util = require('../../utils/util.js');
var configs = require('../configs.js');
var functions = require('../functions.js');

Page({
  data: {
    // 用户信息
    userInfo: {},
  },
  onLoad: function () {
    var that = this;

    if (!configs.userinfo){
      // 第一步，获取用户信息
      functions.getuser(function (res) {
console.log(res);

        that.setData({
          userInfo: res
        });
      });
    }
  },

  // Begin: 事件处理
  /*
  * 我要入库
  */
  btnmyapply:function(){
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.navigateTo({
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
    wx.navigateTo({
      url: '/pages/busapply/busapply'
    })
  },
  /*
  * 内容修改
  */
  btnbusdesc:function(){
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.navigateTo({
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
    wx.navigateTo({
      url: '/pages/busservice/busservice'
    })
  },
  // End: 事件处理
})
