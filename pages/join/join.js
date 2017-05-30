var api = require('../../api/api.js')
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
    // 主机域名 - 七牛文件
    host:'',
    // 选中的城市
    checkProvince: '点击选择',
    // 选中的分类集
    checkClassName:'点击选择',
    // 证书上传URL
    CertUrls:[],
    // 提交的对象
    objoin:{
      types: 0,//0未填写 1填写未提交 2已提交审核中 3已提交审核成功 4提交审核失败,
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
      certificate: '',
    },//保存填写信息
    // 时间戳
    utctime: (new Date()).getTime(),
    // 按钮颜色
    BtnColor: 'background-color:#714e9e;color: #ffffff;'
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
      wHeight: wHeight,
      host: api.iQiniu
    }); 

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      wx.getStorage({
        key: 'userInfo',
        success: function (res) {
          //更新数据
          that.setData({
            userInfo: res.data
          })
        },
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
    var openid = that.data.userInfo.openId;
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
    var openid = that.data.userInfo.openId;
    var url = 'id/' + openid + '0.jpg'
    // 获取Key
    GetUpToken(that, url,'idcardz')
  },
  // 上传身份证反面
  IdCardFTap:function(event){
    var that = this;
    var openid = that.data.userInfo.openId;
    var url = 'id/' + openid + '1.jpg'
    // 获取Key
    GetUpToken(that, url, 'idcardf')
  },
  // 证书URL
  CertTap:function(event){
    var that = this;
    // 用户OpenId
    var openid = that.data.userInfo.openId;
    // 微信 API 选文件
    wx.chooseImage({
      count: 9,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        // 递归函数
        function UpFile(i){
          if (i < tempFilePaths.length){
          // 微信选择文件的名称
          var filePath = res.tempFilePaths[i];
          // 自定义名称
          var filename = 'cert/' + openid + '/' + i+'.jpg';

          // :begin 执行删除文件Api,不知道删除成功与；都是再次上传
          api.wxRequest({
            data: {
              filename: filename
            },
            success: function (res) {
              
              // :begin 获取七牛 uptoken
              api.wxRequest({
                data: {
                  filename: filename
                },
                success: function (res) {
                  var data = res.data;
                  if (data.status == 0) {
                    // 七牛上传必须的 uptoken
                    var uploadtoken = data.uploadtoken;
                    // 七牛上传文件
                    wx.uploadFile({
                      url: api.iQiniuUp,
                      filePath: filePath,
                      name: 'file',
                      formData: {
                        'key': filename,
                        'token': uploadtoken
                      },
                      success: function (res) {
                        // Page data对象
                        var tdata = that.data;
                        // data - objoin对象
                        var objoin = tdata.objoin;
                        // 证书URL集
                        var CertUrls = tdata.CertUrls
                        // 证书URL
                        var dataKey = JSON.parse(res.data).key;

                        objoin.certificate += dataKey+',';
                        // 编辑状态
                        objoin.isedit = true
                        CertUrls.push(dataKey)
                      
                        that.setData({
                          objoin: objoin,
                          CertUrls: CertUrls
                        })
                        i=i+1;
                        UpFile(i);
                      }
                    });
                  }
                }
              }, api.host + api.iuploadtoken)
              // :end 获取七牛 uptoken
            }
          }, api.host + api.iDeleteImg)
          // :end 执行删除文件Api,不知道删除成功与；都是再次上传
        }
        }
        UpFile(0);
      }
    })
  },
  // 删除图片
  CloseXTap:function(event){
    var that = this;
    var filename = event.currentTarget.dataset.certImg;
    // :begin 执行删除文件Api,不知道删除成功与；都是再次上传
    api.wxRequest({
      data: {
        filename: filename
      },
      success: function (res) {
        var CertUrls = that.data.CertUrls;
        var index = CertUrls.indexOf(filename);
        CertUrls.splice(index,1);
        that.setData({
          CertUrls: CertUrls
        })
      }
    }, api.host + api.iDeleteImg)
          // :end 执行删除文件Api,不知道删除成功与；都是再次上传
  },
  // 提交申请
  btnSubmit:function(event){
    var that = this;
    BtnSave(that,true);
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
// 保存信息提交
function BtnSave(that,tp){
  // 用户OpenId
  var openid = that.data.userInfo.openId;
  // 数据对象
  var objoin = that.data.objoin;
  api.wxRequest({
    method: 'POST',
    data: {
      openid: openid,
      provinceid: objoin.province,
      cityid: objoin.city,
      face_img: objoin.img,
      name: objoin.name,
      phone: objoin.phone,
      wechat: objoin.wxname,
      intro: objoin.desc,
      about: objoin.notice,
      train: objoin.institutions,
      referees: objoin.referee,
      idcard_up_img: objoin.idcard_z,
      idcard_down_img: objoin.idcard_f,
      cert_imgs: objoin.certificate,
      serverids: objoin.classid,
    },
    success: function (res) {
      console.log('申请加入成功');
      console.log(res);
      var data = res.data;
      if (data.status == 0) {
        // 提交成功，想想接下来要怎么处理
        if (tp){

        }
      } else {
        // 提交失败，
      }
    },
    fail: function (res) {
      console.log('申请加入失败');
      console.log(res);
    }
  }, api.host + api.iPostLecturer);
}

// 获取uptoken
function GetUpToken(that,filename,types){
  var NowTime = new Date();
  // 获取七牛相对应文件 upToken
    api.wxRequest({
      data:{
       filename: filename
      },
      success:function(res){
        var data = res.data;
        if (data.status == 0){
          // :begin 执行删除文件Api,不知道删除成功与；都是再次上传
          api.wxRequest({
            data:{
              filename: filename
            },
            success:function(res){
              // 获取到Key后，执行选择上传文件
              ChooesImage(that, filename, data.uploadtoken, types);
            }
          }, api.host + api.iDeleteImg)
          // :end 执行删除文件Api,不知道删除成功与；都是再次上传
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
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 2000
        })
        //上传
        wx.uploadFile({
          url: api.iQiniuUp,
            filePath: filePath,
            name: 'file',
            formData: {
              'key': key,
              'token': uptoken
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
                objoin.isedit=true
                that.setData({
                  objoin:objoin,
                  utctime: (new Date()).getTime(),
                })
            },
            fail(error) {
                console.log(error)
            },
            complete(res) {
              // 隐藏弹窗
              wx.hideLoading();
            }
       });
     }
  })
}

// 按钮颜色改变
function UpdateBtnColor(that,objoinid){

}