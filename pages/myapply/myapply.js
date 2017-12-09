
var util = require('../../utils/util.js');
var api = require('../../api/api.js');
var configs = require('../configs.js');
var functions = require('../functions.js');
var uploadfilefill = require('../uploadfile.fill.js');

Page({
  data: {
    userdata:{
      img:'',     //头像
      name:'',    //姓名
      phone:'',   //手机号
      wechat:'',  //微信号
      referee:'', //推荐人
      idcard_up_img:'',   //身份证正面
      idcard_down_img:'', //身份证反面
      index:1,            //索引
    },
    // 扩展属性
    exp:{
      host:'',//域名
    }
  },
  onLoad: function () {
    var that = this;

    // 初始化扩展属性
    InitExp(that);
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
      var uploadtoken = res.uploadtoken;
      // 上传图片
      uploadfilefill.chooesimage(filename, uploadtoken, function(res){
        // 数据 - 资料对象
        var _userdata = that.data.userdata;

        // 删除图片
        uploadfilefill.delimage(_userdata.img);

        // 数据 - 头像
        _userdata.img = res.key;

        // 操作 - 重新赋值
        that.setData({
          userdata: _userdata
        });
      });
    });
  },

  /*
  * 身份证正面
  */
  btnidcardupimg:function(){
    var that = this;
    var openid = configs.userinfo.openId;
    var _times = Date.parse(new Date()) / 1000;
    var filename = 'id/' + openid + '/0-' + _times + '.jpg';

    // 获取上传图片Token
    uploadfilefill.getuptoken(filename, function (res) {
      var uploadtoken = res.uploadtoken;
      // 上传图片
      uploadfilefill.chooesimage(filename, uploadtoken, function (res) {
        // 数据 - 资料对象
        var _userdata = that.data.userdata;

        // 删除图片
        uploadfilefill.delimage(_userdata.idcard_up_img);

        // 数据 - 头像
        _userdata.idcard_up_img = res.key;

        // 操作 - 重新赋值
        that.setData({
          userdata: _userdata
        });
      });
    });
  },

  /*
  * 身份证反面
  */
  btnidcarddownimg:function(){
    var that = this;
    var openid = configs.userinfo.openId;
    var _times = Date.parse(new Date()) / 1000;
    var filename = 'id/' + openid + '/1-' + _times + '.jpg';
    
    // 获取上传图片Token
    uploadfilefill.getuptoken(filename, function (res) {
      var uploadtoken = res.uploadtoken;
      // 上传图片
      uploadfilefill.chooesimage(filename, uploadtoken, function (res) {
        // 数据 - 资料对象
        var _userdata = that.data.userdata;

        // 删除图片
        uploadfilefill.delimage(_userdata.idcard_down_img);

        // 数据 - 头像
        _userdata.idcard_down_img = res.key;

        // 操作 - 重新赋值
        that.setData({
          userdata: _userdata
        });
      });
    });
  },

  /*
  * 下一步操作
  */
  formSubmit: function (event) {
    var that = this;
    var fromObj = event.detail.value;
    // 数据 - 用户信息
    var _userdata = that.data.userdata;
    
    _userdata.name = fromObj.name || '';    //姓名
    _userdata.phone = fromObj.phone || '';   //手机号
    _userdata.wechat = fromObj.wechat || '';  //微信号
    _userdata.referee = fromObj.referee || ''; //推荐人

    // 操作 - 重新赋值
    that.setData({
      userdata: _userdata
    });

    // 操作 - 同步缓存
    wx.setStorageSync('$userdata', _userdata);

    // 跳转入库页面
    wx.navigateTo({
      url: '/pages/myservice/myservice'
    })
  },
  // End: 事件处理
})

// Begin : 扩展方法
function InitExp(that){
  var _exp = that.data.exp;

  // 域名赋值
  if (_exp.host.indexOf('http://') < 0){
    _exp.host = api.iQiniu;
  }

  // 重新赋值
  that.setData({
    exp: _exp
  });
}
// End : 扩展方法