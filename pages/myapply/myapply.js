
var util = require('../../utils/util.js');
var api = require('../../api/api.js');
var util = require('../../utils/util.js');
var configs = require('../configs.js');
var functions = require('../functions.js');
var uploadfilefill = require('../uploadfile.fill.js');

Page({
  data: {

  },
  onLoad: function () {

  },

  // Begin: 事件处理
  /*
  * 上传头像
  */
  btnheadimg:function(){
    var that = this;
    var openid = configs.userinfo.openId;
    var _times = Date.parse(new Date()) / 1000;
    var filename = 'head/' + openid + '/' + _times + '.jpg';
    // 获取上传图片Token
    uploadfilefill.getuptoken(filename, function(res){
      console.log(res);
      var uploadtoken = res.uploadtoken;
      // 上传图片
      uploadfilefill.chooesimage(filename, uploadtoken,'headimg',function(res){
        console.log(res);
      });
    });
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
