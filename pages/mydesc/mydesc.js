
var util = require('../../utils/util.js')
Page({
  data: {
    userdata:{
      intro: '',  //简介
      about: '',  //介绍
    }
  },
  onLoad: function () {

  },

  // Begin: 事件处理

  /*
  * 下一步操作
  */
  formSubmit: function (event) {
    var that = this;
    // 简介
    var $intro = event.detail.value.intro;
    // 介绍
    var $about = event.detail.value.about;
  },
  // End: 事件处理
})
