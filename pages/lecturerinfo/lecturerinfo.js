var api = require('../../api/api.js');
var configs = require('../configs.js');
var functions = require('../functions.js');

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // 实体对象
    Model: {},
    Notice: '',
    exp:{
      // 主机域名 - 七牛文件
      host: '',
    }
  },
  onShareAppMessage: function () {
    var that = this;
    var imodel = that.data.Model;
    return {
      title: imodel.name + ' - 亲密孕育专业人才库',
      path: '/pages/lecturerinfo/lecturerinfo?id=' + imodel.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '专家主页'
    })
  },
  onLoad: function (option) {
    var that = this;
    option = option || {};
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2500
    });

    //初始化扩展对象
    InitExp(that);

    // 第一步 获取ApiConfig/StoreConfig信息，为后续遍历加载
    functions.getconfig(function (res) {
      that.setData({
        Notice: res.Notice
      });
      // 初始化内容
      GetLecture(that, (option.id || 0));
    });
  },
  // :begin 事件处理
  // 拨打电话
  PhoneTap: function (event) {
    var phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  // 复制微信号
  WeChatTap: function (event) {
    var that = this;
    wx.setClipboardData({
      data: that.data.Model.wechat,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  }
  // :end 事件处理
})

// Begin : 扩展函数

/*
* 初始化内容
*/
function GetLecture(that, id) {
  var _Model = that.data.Model;
  api.wxRequest({
    data: {
      id: id
    },
    success: function (res) {
      _Model = res.data.data;
      // 省名
      _Model.province = '';
      // 市名
      _Model.city = '';
      // 服务须知
      _Model.notice = '';
      if (configs.store || null) {
        // 本地存储 - 城市
        var provinces = configs.store.provinces;
        [].forEach.call(provinces, function (item, i) {
          if (item.id == _Model.province_id) {
            _Model.province = item.name;
            var pIndex = item.name.indexOf('市');
            if (pIndex < 0) {
              var citys = item.citys;
              // :begin 遍历市
              [].forEach.call(citys, function (citem, ci, carr) {
                if (citem.id == _Model.city_id) {
                  // 市名
                  _Model.city = citem.name;
                }
              });
            }
          }
        });
      }
      that.setData({
        Model: _Model
      });
      wx.hideToast();
    },
    fail: function (res) {
      wx.hideToast();
    }
  }, api.host + api.iUpdatePV);
}

/*
* 初始化扩展对象
*/
function InitExp(that){
  var _exp = that.data.exp;
  _exp.host = api.iQiniu;
  that.setData({
    exp: _exp
  });
}
// End : 扩展函数