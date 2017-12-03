
var util = require('../../utils/util.js')
Page({
  data: {

  },
  onLoad: function () {

  },
  
  // Begin: 事件处理
  /*
  * 下一步操作
  */
  formSubmit: function () {
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.redirectTo({
      url: '/pages/myexp/myexp'
    })
  },
  // End: 事件处理
})