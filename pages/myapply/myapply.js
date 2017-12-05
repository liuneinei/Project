
var util = require('../../utils/util.js')
Page({
  data: {

  },
  onLoad: function () {

  },

  // Begin: 事件处理
  /*
  * 上传图片
  */
  btnupimg:function(){
    var that = this;
  },

  /*
  * 下一步操作
  */
  formSubmit: function () {
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.navigateTo({
      url: '/pages/myservice/myservice'
    })
  },
  // End: 事件处理
})
