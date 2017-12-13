
var util = require('../../utils/util.js');
var api = require('../../api/api.js');
var configs = require('../configs.js');
var functions = require('../functions.js');

Page({
  data: {
    userdata:{
      intro: '',  //简介
      about: '',  //介绍
    }
  },
  onLoad: function () {
    var that = this;
    if (!configs.userinfo) {
      // 第一步，获取用户信息
      functions.getuser(function (res) { });
    }
  },

  // Begin: 事件处理

  /*
  * 下一步操作
  */
  formSubmit: function (event) {
    var that = this;
    var _userdata = that.data.userdata;

    // 简介
    var $intro = event.detail.value.intro;
    // 介绍
    var $about = event.detail.value.about;

    _userdata.intro = $intro;
    _userdata.$about = $about;

    that.setData({
      userdata: _userdata,
    });

    // 操作 - 同步缓存
    wx.setStorageSync('$mydescuserdata', _userdata);
  },
  // End: 事件处理
})

// Begin : 扩展方法
function MergeUserData(that){
  // 缓存 - myapply
  var _myapplyuserdata = wx.getStorageSync('$myapplyuserdata') || null;
  // 缓存 - myservice
  var _myserviceuserdata = wx.getStorageSync('$myserviceuserdata') || null;
  // 缓存 - mydesc
  var _mydescuserdata = wx.getStorageSync('$mydescuserdata') || null;

  if (_myapplyuserdata == null || _myserviceuserdata == null || _mydescuserdata == null){
    wx.showModal({
      title: '提示',
      content: '资料未填写完整',
      showCancel: false
    });
    return;
  }

  var $postData = {
    openid: configs.userinfo.openId,
    img: _myapplyuserdata.img,
    name: _myapplyuserdata.name,
    phone: _myapplyuserdata.phone,
    wechat: _myapplyuserdata.wechat,
    referee: _myapplyuserdata.referee,
    idcard_up_img: _myapplyuserdata.idcard_up_img,
    idcard_down_img: _myapplyuserdata.idcard_down_img,

    area: _myserviceuserdata.area,
    service: _myserviceuserdata.service,
    train: _myserviceuserdata.train,
    cert_imgs: _myserviceuserdata.cert_imgs,

    intro: _mydescuserdata.ModelModel,
    about: _mydescuserdata.about,
  }
}
// End : 扩展方法
