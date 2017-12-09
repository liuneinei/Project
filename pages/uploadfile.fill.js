var api = require('../api/api.js');
var configs = require('configs.js');

/*
* 获取uptoken
*/
const getuptoken = (filename,fb) =>  {
  // 获取七牛相对应文件 upToken
  api.wxRequest({
    data: {
      filename: filename
    },
    success: function (res) {
      var data = res.data;
      typeof fb === 'function' && fb(data);
    }
  }, api.host + api.iuploadtoken)
}

// 单图上传
// 身份证命名规则 ：  id/[openid]/0.jpg  id/[openid]/1.jpg  
// 头像 ：  face/[openid].jpg
// 证照 ：  cert/[openid]/[unixtime].jpg
const chooesimage = (key, uptoken, fb) => {
  // 微信 API 选文件
  wx.chooseImage({
    count: 1,
    success: function (res) {
      var filePath = res.tempFilePaths[0];
      wx.showToast({
        title: '上传中',
        icon: 'loading',
        duration: 5000
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
        success: function (res) {
          var dataObject = JSON.parse(res.data);
          typeof fb === 'function' && fb(dataObject);
        },
        fail(error) {
          typeof fb === 'function' && fb({ error: error});
        },
        complete(res) {
          // 隐藏弹窗
          wx.hideLoading();
        }
      });
    }
  })
}

/*
* 删除图片文件
*/
const delimage = (filename) => {
  if(filename == '' || filename.indexOf('http://') < 0){
    return;
  }
  // :begin 执行删除文件Api,不知道删除成功与；都是再次上传
  api.wxRequest({
    data: {
      filename: filename
    },
    success: function (res) {
      // 获取到Key后，执行选择上传文件
    }
  }, api.host + api.iDeleteImg)
  // :end 执行删除文件Api,不知道删除成功与；都是再次上传
}

/*
* 图片选择
*/
const chooseFile = (count, fb) => {
  // 微信 API 选文件
  wx.chooseImage({
    count: count,
    success: function (res) {
      var filePath = res.tempFilePaths;
      typeof fb === 'function' && fb(filePath);
    },
    fail:function(res){
      typeof fb === 'function' && fb({error:'error'});
    }
  })
}

/*
* 图片上传
* @param filePath上传路径 | key图片Key | uptoken图片token
*/
const uploadFile = (filePath, key, uptoken, fb) =>{
  //上传
  wx.uploadFile({
    url: api.iQiniuUp,
    filePath: filePath,
    name: 'file',
    formData: {
      'key': key,
      'token': uptoken
    },
    success: function (res) {
      var dataObject = JSON.parse(res.data);
      typeof fb === 'function' && fb(dataObject);
    },
    fail(error) {
      typeof fb === 'function' && fb({ error: error });
    }
  });
}

module.exports = {
  // 获取uptoken
  getuptoken,
  // 上传头像
  chooesimage,
  // 删除图片文件
  delimage,

  // 图片选择
  chooseFile,
  // 图片上传
  uploadFile,
}