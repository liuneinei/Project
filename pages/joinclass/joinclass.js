var api = require('../../api/api.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    services: [],//城市
    wHeight: 300,
    check:[],
    // 选中的id集
    checkids: '',
    // 选中的Name集
    checknames:'',
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '亲密育儿人才库'
    })
  },
  onLoad: function () {
    var that = this;
    // 获取系统信息，提取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wHeight: res.windowHeight - 40
        })
      }
    })

    // 本地存储 - 城市
    wx.getStorage({
      key: 'config',
      success: function (res) {
        console.log('服务项')
        console.log(res)
        that.setData({
          services: res.data.services
        })
      },
    })
  },
  // ##:beging 事件处理 
  ClassTap:function(event){
    var that = this;
    // id集
    var check = that.data.check;
    // 选中的id集
    var checkids = that.data.checkids;
    // 选中的Name集
    var checknames = that.data.checknames;

    // 索引值
    var idx = event.target.dataset.idx;
    var id = event.target.dataset.id;
    var name = event.target.dataset.name;
    for (var i=0;i<=idx;i++){
        if(i==idx){
          if (check[i] == null || check[i]<=-1){
            check[i] = idx;
            checkids += id+',';
            checknames += name+',';
          }else{
            check[i] = -1;
            checkids = checkids.replace(id + ',',''); 
            checknames = checknames.replace(name + ',','');
          }
        }else{
          if(check[i] == null){
            check[i]=-1;
          }
        }
    }
    that.setData({
      check: check,
      checkids: checkids,
      checknames: checknames
    })
  },
  // 确认
  confirmTap:function(event){
    var that = this;
    //获取页面栈
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      var checkids = that.data.checkids;
      checkids = checkids.substr(0, checkids.length - 1);
      var checknames = that.data.checknames;
      checknames = checknames.substr(0, checknames.length-1);
      //关键在这里
      prePage.changeClass(checkids, checknames)
    }
    wx.navigateBack({
      delta:1
    });
  }
  // ##:end 事件处理 
});
