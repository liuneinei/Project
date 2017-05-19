var api = require('../../api/api.js')
var region = require('../../api/testdata/region.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    classshow:0,
    geoshow:true,
    region: [],
    regionapi: true,
    regnavCus: 0,//选中
    citys: [],//城市
    wHeight: 300,
    imageURL:'',
    imageObject: {}
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '加入我们'
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
    that.setData({
      region: region.region
    }); 
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
  },
  // ##:beging 事件处理 
  //上传头像
  uploadheadTap:function(event){
    var that = this;
    didPressChooesImage(that);
  },
  // 选择城市
  ProvinceEvent:function(event){
    var _this = this;   
    var classshow = 2;
    var geoshow=false;
    console.log(_this)
    if (_this.data.classshow == 2){
      classshow=0;
      geoshow=true;
    }
    console.log(classshow)
    _this.setData({
      geoshow: geoshow,
      classshow: classshow
    });
  },
  // 类别选择
  ClassEvent:function(event){
    let _this = this;
    var classshow = 1;
    var geoshow = false;
    if (_this.data.classshow == 1) {
      classshow = 0;
      geoshow = true;
    }
    console.log(classshow)
    _this.setData({
      geoshow: geoshow,
      classshow: classshow
    });
  }
  // ##:end 事件处理 
});

// 上传
function didPressChooesImage(that) {
  // 微信 API 选文件
  wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        //上传
        wx.uploadFile({
          url: 'https://up-z2.qbox.me',//如果是华北一请用up-z1.qbox.me
            filePath: filePath,
            name: 'file',
            formData: {
              'key': 'test.jpg',
              'token': 'QrQSGz8wX13Pe5ezSmRpZgmEMRXdkJtILiHcK4d0:ZZP86Up6Jc-lRQDAz6ZC9p8lVSM=:eyJzY29wZSI6Inlhbm1hLWVkdS13eGFwcDp0ZXN0LmpwZyIsImRlYWRsaW5lIjoxNDk1MTIyOTAyLCJ1cEhvc3RzIjpbImh0dHA6XC9cL3VwLXoyLnFpbml1LmNvbSIsImh0dHA6XC9cL3VwbG9hZC16Mi5xaW5pdS5jb20iLCItSCB1cC16Mi5xaW5pdS5jb20gaHR0cDpcL1wvMTgzLjYwLjIxNC4xOTgiXX0='
            },
            success: function(res) {
                //返回hash值、key值
                console.log(res);
            },
            fail(error) {
                console.log(error)
            },
            complete(res) {
                console.log(res)
            }
        });
      }
    })
}
