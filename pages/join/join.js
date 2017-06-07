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
      status: 99,//0未填写 1已提交审核中 2提交审核失败 3已提交审核成功,
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
      msg:'正在加载中'
    },//保存填写信息
    // 时间戳
    utctime: (new Date()).getTime(),
    // 按钮颜色
    BtnColor: 'background-color:#714e9e;color: #ffffff;',   
    tost:{
      ishide:true,
      tip:'',
      time:1,
      js:0
    }
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '加入我们'
    })
  },
  onLoad: function () {
    wx.showToast({
      title: '加载中',
      icon:'loading',
      duration:1500
    })
    var that = this;
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu,
      iImgExt: api.iImgExt
    })

    var userInfo = app.globalData.userInfo;
    that.setData({
      userInfo: userInfo
    })
    // OpenId
    var openid = userInfo.openId;
    // 获取加入我们
    Getislecturer(that, openid)

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
    var url = 'id/' + openid + '/0.jpg'
    // 获取Key
    GetUpToken(that, url,'idcardz')
  },
  // 上传身份证反面
  IdCardFTap:function(event){
    var that = this;
    var openid = that.data.userInfo.openId;
    var url = 'id/' + openid + '/1.jpg'
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
                        var utctime = (new Date()).getTime();
                        dataKey = dataKey + '?wxcert' + utctime;
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
  },
  // 修改信息
  btnUpdateTap:function(event){
    var that = this;
    BtnSave(that, false);
  }
  // ##:end from表单处理
});

// 获取加入我们
function Getislecturer(that, openid){
  api.wxRequest({
    data:{
      openid: openid
    },
    success:function(res){
      // 本地保存对象
      var objoin = that.data.objoin;
      var checkProvince = '点击选择';
      var checkClassName = '点击选择';
      var CertUrls = [];
      // --返回结果集
      var resObj = res.data.data;
      var dataObj = res.data;
      if (dataObj.status != 0 || resObj.length <= 0){
        objoin.status = 0
      }else{
        // 提交的对象
        objoin.openid = resObj.wx_openid;
        objoin.province = resObj.province_id;
        objoin.city = resObj.city_id;
        var provinces = app.globalData.GeoMap.Config.provinces
        if(provinces != 'undefined' && provinces.length >0){
          checkProvince='';
          [].forEach.call(provinces,function(item,i){
            if (item.id == resObj.province_id){
              checkProvince+=item.name;
              var checkProIndex = checkProvince.indexOf('市');
              var citys = item.citys;
              if (citys.length > 0 && checkProIndex<0){
                [].forEach.call(citys,function(itemc,ic){
                  if (itemc.id == resObj.city_id){
                    checkProvince += itemc.name;
                  }
                })
              }
            }
          })
        }
        var service = resObj.service;
        objoin.classid = '';
        if (service.length > 0){
          checkClassName = '';
          [].forEach.call(service,function(item,i){
            objoin.classid += item.id+',';
            checkClassName += item.title+',';
          })
          objoin.classid = objoin.classid.substr(0, objoin.classid.length - 1);
          checkClassName = checkClassName.substr(0, checkClassName.length-1);
        
          var utctime = (new Date()).getTime();

          objoin.img = resObj.face_img + '?wximg' + utctime;
          objoin.name = resObj.name;
          objoin.phone = resObj.phone;
          objoin.wxname = resObj.wechat;
          objoin.desc = resObj.intro;
          objoin.notice = resObj.about;
          objoin.institutions = resObj.train;
          objoin.referee = resObj.referees;
          objoin.idcard_z = resObj.idcard_up_img + '?wximg' + utctime;;
          objoin.idcard_f = resObj.idcard_down_img + '?wximg' + utctime;;
          objoin.certificate = resObj.cert_imgs+',';
          var CertUrlses = resObj.cert_imgs.split(',');
          if(CertUrlses.length > 0){
            [].forEach.call(CertUrlses,function(item,i){
              CertUrls.push(item + '?wxcert' + utctime);
            });
          }
          objoin.status = resObj.status;
          if (objoin.status==1){
            objoin.msg='已提交，请等待审核';
          }else if(objoin.status ==3){
            objoin.msg = '您的信息审核已通过';
          }else if(objoin.status == 2){
            objoin.msg = '您的信息审核失败，请检查信息的正确性及相片的清晰度';
          }
        }else{
          objoin.status = 0;
        }
      }
      that.setData({
        objoin: objoin,
        checkProvince: checkProvince,
        checkClassName: checkClassName,
        CertUrls: CertUrls
      })
    },
    complete:function(res){
      wx.hideToast();
    }
  }, api.host + api.igGetIsLecturer);
}

// 定时保存
function timesave(that){
  var _objoin = that.data.objoin;
  if (_objoin.status == 0){
    //BtnSave(that, false);
  }
  setTimeout(function () { timesave(that)},30000); 
}
// 保存信息提交
function BtnSave(that,tp){
  // 用户OpenId
  var openid = that.data.userInfo.openId;
  // 数据对象
  var objoin = that.data.objoin;

  var tost = that.data.tost;

  if ((openid == 'undefined' || openid == '') && tp){
    tost.ishide = false;
    tost.tip ='未授权登录';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.img == '' && tp) {
    tost.ishide = false;
    tost.tip ='请上传头像';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if ((objoin.province == '' || objoin.city == '') && tp) {
    tost.ishide = false;
    tost.tip ='请选择城市';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.classid == '' && tp) {
    tost.ishide = false;
    tost.tip ='请选择认证行业';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.name == '' && tp) {
    tost.ishide = false;
    tost.tip ='请填写姓名';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.phone == '' && tp) {
    tost.ishide = false;
    tost.tip ='请填写手机';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.wxname == '' && tp) {
    tost.ishide = false;
    tost.tip ='请填写微信号';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.desc == '' && tp) {
    tost.ishide = false;
    tost.tip ='请填写简介';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.notice == '' && tp) {
    tost.ishide = false;
    tost.tip ='请填写介绍';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.institutions == '' && tp) {
    tost.ishide = false;
    tost.tip ='请填写培训机构';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.idcard_z == '' && tp) {
    tost.ishide = false;
    tost.tip ='请上传身份正面';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.idcard_f == '' && tp) {
    tost.ishide = false;
    tost.tip ='请上传身份反面';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  if (objoin.certificate == '' && tp) {
    tost.ishide = false;
    tost.tip ='请上传专业证书';
    that.setData({
      tost:tost
    })
    // 隐藏
    hideToasts(that);
    return;
  }
  var certificate_str = objoin.certificate;
  var cert_lastindex = certificate_str.lastIndexOf(',');
  if (cert_lastindex == (certificate_str.length -1)){
    certificate_str = certificate_str.substr(0, certificate_str.length - 1);
  }
  var status=1;
  if(!tp){
    status=0
  }
  var face_img = objoin.img;
  var face_index = objoin.img.indexOf('?wximg');
  if(face_index > 0){
    face_img = face_img.substr(0, face_index);
  }
  
  var idcard_up_img = objoin.idcard_z;
  var idcard_up_index = idcard_up_img.indexOf('?wximg') 
  if (idcard_up_index > 0) {
    idcard_up_img = idcard_up_img.substr(0, idcard_up_index);
  }

  var idcard_down_img = objoin.idcard_f;
  var idcard_down_index = idcard_down_img.indexOf('?wximg')
  if (idcard_down_index > 0) {
    idcard_down_img = idcard_down_img.substr(0, idcard_down_index);
  }
  
  console.log(face_img);
  console.log(idcard_up_img);
  console.log(idcard_down_img);
  console.log(certificate_str);
  
  api.wxRequest({
    method: 'POST',
    data: {
      openid: openid,
      provinceid: objoin.province,
      cityid: objoin.city,
      face_img: face_img,
      name: objoin.name,
      phone: objoin.phone,
      wechat: objoin.wxname,
      intro: objoin.desc,
      about: objoin.notice,
      train: objoin.institutions,
      referees: objoin.referee,
      idcard_up_img: idcard_up_img,
      idcard_down_img: idcard_down_img,
      cert_imgs: certificate_str,
      serverids: objoin.classid,
      // 提交审核
      status: status
    },
    success: function (res) {
      console.log('申请加入成功');
      console.log(res);
      var data = res.data;
      if (data.status == 0) {
        // 提交成功，想想接下来要怎么处理
        objoin.status = status;
        objoin.msg = '已提交，请等待审核';
          that.setData({
            objoin: objoin
          })
      } else {
        // 提交失败，
        wx.showToast({
          title: '处理失败',
          duration:1000
        })
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
                var utctime = (new Date()).getTime();
                if (types == 'headimg'){
                  objoin.img = dataObject.key + '?wximg' + utctime;
                }else if(types == 'idcardz'){
                  objoin.idcard_z = dataObject.key + '?wximg' + utctime;
                }else if(types == 'idcardf'){
                  objoin.idcard_f = dataObject.key + '?wximg' + utctime;
                }
                objoin.isedit=true
                that.setData({
                  objoin:objoin,
                  //utctime: (new Date()).getTime(),
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
// 隐藏
function hideToasts(that){
  var tost = that.data.tost;
  if(tost.js <= 0){
    tost.js = tost.time;
  }else{
    tost.js = tost.js - 1;
  }
  if(tost.js<=0){
    tost.ishide = true;
    tost.tip = '';
    tost.js = 0;
    that.setData({
      tost:tost
    })
  }else{
    setTimeout(function(){
      hideToasts(that);
    },1200);
  }
}