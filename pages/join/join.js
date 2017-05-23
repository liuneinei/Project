var api = require('../../api/api.js')
var region = require('../../api/testdata/region.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    wHeight: 300,
    // 选中的城市
    checkProvince: '点击选择',
    // 选中的分类集
    checkClassName:'点击选择',
    objoin:{
      isedit:false,
      province: 0,
      city: 0,
      classid: '',
      img: '',
      name: '',
      phone: '',
      wxname: '',
      qrcode: '',
      desc: '',
      notice: '',
      institutions: '',
      referee: '',
      idcard_z: '',
      idcard_f: '',
      certificate: ''
    },//保存填写信息
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '加入我们'
    })
  },
  onLoad: function () {
    var that = this;
    let wHeight = that.data.wHeight;
    // 获取系统信息，提取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        wHeight = res.windowHeight - 40
      }
    })
    that.setData({
      region: region.region,
      wHeight: wHeight
    }); 
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    // 定时保存
    timesave(that);

    // 地区拉取API
    GetRegion();
  },
  // ##:beging 事件处理 
  // 选择城市
  ProvinceEvent:function(event){
    wx.navigateTo({
      url: '../joincity/joincity',
    })
  },
  // 选择类别
  ClassEvent:function(event){
    wx.navigateTo({
      url: '../joinclass/joinclass',
    })
  },
  // 更新城市
  changeProvince: function (pid, cid, checkProvince) {
    var that = this;
    var objoin = that.data.objoin;
    objoin.province = pid;
    objoin.city = cid;
    that.setData({
      objoin: objoin,
      checkProvince: checkProvince
    });
  },
  // 更新类别
  changeClass: function (classid, checkClassName) {
    var that = this;
    var objoin = that.data.objoin;
    objoin.classid = classid
    that.setData({
      objoin: objoin,
      checkClassName: checkClassName
    });
  },
  // ##:end 事件处理 
  // ##:begin from表单处理
  // 上传头像
  uploadheadTap: function (event) {
    var that = this;
    didPressChooesImage(that);
  },
  // 名字
  HandleName:function(event){
    var that = this;
    var name = event.detail.value
    var objoin = that.data.objoin;
    objoin.name = name;
    objoin.isedit = true; 
    that.setData({
      objoin: objoin
    })
  },
  // 手机
  HandlePhone: function (event) {
    var that = this;
    var phone = event.detail.value
    var objoin = that.data.objoin;
    objoin.phone = phone;
    objoin.isedit = true; 
    that.setData({
      objoin: objoin
    })
  },
  // 微信号
  HandleWxName: function (event) {
    var that = this;
    var wxname = event.detail.value
    var objoin = that.data.objoin;
    objoin.wxname = wxname;
    objoin.isedit = true; 
    that.setData({
      objoin: objoin
    })
  },
  // 简介
  HandleDesc: function (event) {
    var that = this;
    var desc = event.detail.value
    var objoin = that.data.objoin;
    objoin.desc = desc;
    objoin.isedit = true; 
    that.setData({
      objoin: objoin
    })
  },
  // 介绍
  HandleNotice: function (event) {
    var that = this;
    var notice = event.detail.value
    var objoin = that.data.objoin;
    objoin.notice = notice;
    objoin.isedit = true; 
    that.setData({
      objoin: objoin
    })
  },
  // 培训机构
  HandleInstitutions: function (event) {
    var that = this;
    var institutions = event.detail.value
    var objoin = that.data.objoin;
    objoin.institutions = institutions;
    objoin.isedit = true; 
    that.setData({
      objoin: objoin
    })
  },
  // 推荐人
  HandleReferee: function (event) {
    var that = this;
    var referee = event.detail.value
    var objoin = that.data.objoin;
    objoin.referee = referee;
    objoin.isedit = true; 
    that.setData({
      objoin: objoin
    })
  },
  // ##:end from表单处理
});

// 定时保存
function timesave(that){
  var _objoin = that.data.objoin;
  if (_objoin.isedit){
    wx.setStorage({
      key: 'objoin',
      data: _objoin,
    })
  }
  setTimeout(function () { timesave(that)},30000); 
}

// 上传
function didPressChooesImage(that) {
  // 微信 API 选文件
  wx.chooseImage({
      count: 1,
      success: function (res) {
        var filePath = res.tempFilePaths[0];
        //上传
        wx.uploadFile({
          url: 'https://up-z2.qbox.me',
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
