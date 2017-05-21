var api = require('../../api/api.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    citys: [{
      "id": 1,
      "name": "广东省",
    },
    {
      "id": 2,
      "name": "广西省",
    },],//城市
    wHeight: 300,
    check:[]
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
    //获取页面栈
        var pages = getCurrentPages();
        if(pages.length > 1){
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.changeData(1,'类别')
        }
    var check = this.data.check;
    var idx = event.target.dataset.idx;
    for (var i=0;i<=idx;i++){
      console.log(check[i]);
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
  // ##:end 事件处理 
});
