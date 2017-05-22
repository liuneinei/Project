var api = require('../../api/api.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    citys: [{
      "id": 1,
      "name": "分类1",
    },
    {
      "id": 2,
      "name": "分类2",
    },],//城市
    wHeight: 300,
    check:[],
    // 选中的id集
    checkids: [],
    // 选中的Name集
    checknames:[],
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
  },
  // ##:beging 事件处理 
  ClassTap:function(event){
    // id集
    var check = this.data.check;
    // 索引值
    var idx = event.target.dataset.idx;
    var id = event.target.dataset.id;
    var name = event.target.dataset.name;
    for (var i=0;i<=idx;i++){
      if(i==idx){
        check[i] = idx;
      }else{
        if(check[i] == null){
          check[i]=-1;
        }
      }
    }
    this.setData({
      check: check
    })
  },
  // 确认
  confirmTap:function(event){
    //获取页面栈
    var pages = getCurrentPages();
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.changeData(1, this.data.check.join(' '))
    }
  }
  // ##:end 事件处理 
});
