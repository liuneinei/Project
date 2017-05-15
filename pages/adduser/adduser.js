var api = require('../../api/api.js')

//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    logo: null,
    logo2:null,
    imglist:[],
    geoshow:true,
    classshow:0,
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '预约服务'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log(userInfo)
      //更新数据
      that.setData({
        userInfo: userInfo,
        logo: userInfo.avatarUrl,
        logo2: userInfo.avatarUrl,
      })
    });
  },
  //身份证正面
  chooseImageTap: function(){
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          var sourceType = '';
          if (res.tapIndex == 0) {
            sourceType = 'album';
          } else if (res.tapIndex == 1) {
            sourceType = 'camera';
          }

          console.log(sourceType);
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: [sourceType],
            success: function (res) {
              console.log(res);
              _this.setData({
                logo: res.tempFilePaths[0],
              });
            }
          });
        }
      }
    });
  },
  //身份证反面
  fchooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          var sourceType = '';
          if (res.tapIndex == 0) {
            sourceType = 'album';
          } else if (res.tapIndex == 1) {
            sourceType = 'camera';
          }

          console.log(sourceType);
          wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: [sourceType],
            success: function (res) {
              console.log(res);
              _this.setData({
                logo2: res.tempFilePaths[0],
              });
            }
          });
        }
      }
    });
  },
  bindUps:function(e){
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          var sourceType = '';
          if (res.tapIndex == 0) {
            sourceType = 'album';
          } else if (res.tapIndex == 1) {
            sourceType = 'camera';
          }

          console.log(sourceType);
          wx.chooseImage({
            sizeType: ['original', 'compressed'],
            sourceType: [sourceType],
            success: function (res) {
              console.log(res.tempFilePaths);
              console.log(_this.data.imglist);
              res.tempFilePaths = _this.data.imglist.concat(res.tempFilePaths);
              _this.setData({
                imglist: res.tempFilePaths,
              });
            }
          });
        }
      }
    });
  },
  //服务选项
  servertag:function(e){
    let _this = this;
    console.log(_this);

    var classshow = 1;
    if (_this.data.classshow == 1){
      classshow=0;
    }
    _this.setData({
      geoshow: false,
      classshow: classshow
    });
  },
  //citytap 城市选择
  citytap:function(e){
    var _this = this;   
    _this.setData({
      geoshow: false,
      classshow:2
    }); 
  },
})
