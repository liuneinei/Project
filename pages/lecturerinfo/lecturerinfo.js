var api = require('../../api/api.js');
var configs = require('../configs.js');
var functions = require('../functions.js');

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
  onShareAppMessage: function () {
    var that = this;
    var imodel = that.data.Model;
    return {
      title: imodel.name + ' - 亲密孕育专业人才库',
      path: '/pages/lecturerinfo/lecturerinfo?id='+imodel.id,
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
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2500
    });
    // functions.getconfig(function(res){
    //   functions.setdatas()
    //   console.log('config - res');
    //   console.log(res);
    // })
    var that = this;
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu,
      iImgExt: api.iImgExt
    });

    //获取页面栈
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      var Model = prePage.data.requests.Model;
        that.setData({
          Model: Model
        });
    }else{
      var id= option.id;
      if(id!=undefined && id!='undefined' && id>0){
        var Model = that.data.Model;
        Model.id = id;
        that.setData({
          Model:Model
        });
      }
    }
   var config = wx.getStorageSync('config')||null;
   if(!config){
    // 地区拉取API
    api.wxRequest({
      success: (res) => { 
        //同步存储
        wx.setStorageSync('config', res.data.data);
        that.setData({
          Notice: res.data.data.Notice
        });
         GetAPi(that);
      }
    }, api.host + api.iconfig);
   }else{
     that.setData({
        Notice: config.Notice
      });
      GetAPi(that);
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

function GetAPi(that){
  var Model = that.data.Model;
  api.wxRequest({
      data:{
          id:Model.id
        },
        success:function(res){
            Model = res.data.data;
            // 省名
            Model.province = '';
            // 市名
            Model.city='';
            // 服务须知
            Model.notice='';
            var config = wx.getStorageSync('config')||null;
            if (config){
              // 本地存储 - 城市
              var provinces = config.provinces;// app.globalData.GeoMap.Config.provinces;
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
            that.setData({
              Model: Model
            });
            wx.hideToast();
        },
        fail:function(res){
          wx.hideToast();
        }
      },api.host+api.iUpdatePV);
}