var api = require('../../api/api.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // 主机域名 - 七牛文件
    host: '',
    iImgExt: '',
    // 实体对象
    Model:{},
    Notice:'',
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '专家主页'
    })
  },
  onLoad: function (option) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })
    var that = this;
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu,
      iImgExt: api.iImgExt
    })
    var Notice = app.globalData.GeoMap.Config.Notice;
    if(Notice == 'undefined' || Notice == null){
      Notice ='';
      wx.getStorage({
        key: 'config',
        success: function(res) {
          Notice = res.data.Notice;
          that.setData({
            Notice: Notice
          });
        },
      })
    }else{
      that.setData({
        Notice: Notice
      });
    }

    //获取页面栈
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      var Model = prePage.data.requests.Model;
      // 省名
      Model.province = '';
      // 市名
      Model.city='';
      // 服务须知
      Model.notice='';
      // 本地存储 - 城市
      var provinces = app.globalData.GeoMap.Config.provinces;
      if(typeof provinces != 'undefined'){
        [].forEach.call(provinces,function(item,i){
          if (item.id == Model.province_id) {
            Model.province = item.name;
            var pIndex = item.name.indexOf('市');
            if (pIndex < 0) {
              var citys = item.citys;
              // :begin 遍历市
              [].forEach.call(citys, function (citem, ci, carr) {
                if (citem.id == Model.city_id) {
                  // 市名
                  Model.city = citem.name;
                }
              });
            }
          }
        });
      }
      // if (Model.id == option.id){
        that.setData({
          Model: Model
        })
      // }
      wx.hideToast();
    }
  },
  // :begin 事件处理
  // 拨打电话
  PhoneTap:function(event){
    var phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  }
  // :end 事件处理
})
