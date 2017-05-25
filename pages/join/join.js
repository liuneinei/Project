var api = require('../../api/api.js')
var region = require('../../api/testdata/region.js')
var util = require('../../utils/util.js')
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    // 用户信息
    userInfo: {},
    // 屏幕高度
    wHeight: 300,
    // 主机域名
    host:'',
    // 选中的城市
    checkProvince: '点击选择',
    // 选中的分类集
    checkClassName:'点击选择',
    // 上传key
    filetoken:{
      uptoken:'',
      uptime:new Date()
    },
    // 证书上传URL
    CertUrls:[],
    // 提交的对象
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
      wHeight: wHeight,
      host: api.host
    }); 
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      console.log(userInfo);
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    // 定时保存
    timesave(that);
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
    var openid = that.data.userInfo.data.openId;
    var url='face/'+openid+'.jpg'
    // 获取Key
    GetUpToken(that, url,'headimg')
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
  // 上传身份证正面
  IdCardZTap:function(event){
    var that = this;
    // 获取Key
    GetUpToken(that, 'id/[openid]/0.jpg')
  },
  // 上传身份证反面
  IdCardFTap:function(event){
    var that = this;
    // 获取Key
    GetUpToken(that, 'id/[openid]/1.jpg')
  },
  // 证书URL
  CertTap:function(event){
    var that = this;

  }
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

// 获取uptoken
function GetUpToken(that,filename,types){
  var NowTime = new Date();
    api.wxRequest({
      data:{
       filename: filename
      },
      success:function(res){
        var data = res.data;
        if (data.status == 0){
          console.log('上传图片');
          console.log(res);
          // 获取到Key后，执行选择上传文件
          ChooesImage(that, filename,data.uploadtoken, types);
        }
      }
    }, api.host + api.iuploadtoken)
}

// 上传
// 身份证命名规则 ：  id/[openid]/0.jpg  id/[openid]/1.jpg  
// 头像 ：  face/[openid].jpg
// 证照 ：  cert/[openid]/[unixtime].jpg
function ChooesImage(that, key,uptoken, types) {
  console.log(key);
  console.log(uptoken);
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
              'key': key,
              'token': uptoken
              //that.data.filetoken.uptoken,
            },
            success: function(res) {
              var objoin = that.data.objoin;
              var dataObject = JSON.parse(res.data);
                //返回hash值、key值
                console.log(res.data);
                if (types == 'headimg'){
                   objoin.img = dataObject.key
                }else if(types == 'idcardz'){
                   objoin.idcard_z = dataObject.key
                }else if(types == 'idcardf'){
                   objoin.idcard_f = dataObject.key
                }
                that.setData({
                  objoin:objoin
                })
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


// 上传
// 身份证命名规则 ：  id/[openid]/0.jpg  id/[openid]/1.jpg  
// 头像 ：  face/[openid].jpg
// 证照 ：  cert/[openid]/[unixtime].jpg
function CertChooesImage(that, key, types) {
  console.log(key);
  console.log(that.data.filetoken.uptoken);
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
          'key': key,
          'token': that.data.filetoken.uptoken
        },
        success: function (res) {
          var objoin = that.data.objoin;
          //返回hash值、key值
          console.log(res);
          if (types == 'headimg') {
            // objoin.img = 
          } else if (types == 'idcardz') {
            // objoin.idcard_z =
          } else if (types == 'idcardf') {
            // objoin.idcard_f
          }
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