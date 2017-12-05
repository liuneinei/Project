var api = require('../api/api.js');
var configs = require('configs.js');

// 获取uptoken
const getuptoken = (filename,fb) =>  {
  // 获取七牛相对应文件 upToken
  api.wxRequest({
    data: {
      filename: filename
    },
    success: function (res) {
      var data = res.data;
      if (data.status == 0) {
        // :begin 执行删除文件Api,不知道删除成功与；都是再次上传
        api.wxRequest({
          data: {
            filename: filename
          },
          success: function (res) {
            // 获取到Key后，执行选择上传文件
            //ChooesImage(filename, data.uploadtoken, types);
            typeof fb === 'function' && fb(data);
          }
        }, api.host + api.iDeleteImg)
        // :end 执行删除文件Api,不知道删除成功与；都是再次上传
      }else{
        typeof fb === 'function' && fb(data);
      }
    }
  }, api.host + api.iuploadtoken)
}

// 上传
// 身份证命名规则 ：  id/[openid]/0.jpg  id/[openid]/1.jpg  
// 头像 ：  face/[openid].jpg
// 证照 ：  cert/[openid]/[unixtime].jpg
function chooesimage(key, uptoken, types, fb) {
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

module.exports = {
  // 获取uptoken
  getuptoken,
  // 上传头像
  chooesimage,
}