// 主机域名
const host = 'https://edu.yanma.com';
const iQiniuUp = 'https://up-z2.qbox.me';
// 七牛文件域名
const iQiniu = 'http://oq53vzp2j.bkt.clouddn.com'
// 图片后缀
const iImgExt ='?imageView2/1/w/160/h/160/format/jpg/q/76|imageslim';
// 微信登录
const iwxlogin = '/wxlogin';
// 上传文件
const iuploadtoken = '/uploadtoken';
// 省市
const iconfig = '/config';
// 获取加入我们
const igGetIsLecturer = '/getislecturer';
// 加入我们
const iPostLecturer ='/postlecturer';
// 讲师列表 /getlecturer?provinceid=0&cityid=0&serverid=0&page=2
const iLecturer = '/getlecturer';
// 首页推荐
const iRecommend = '/getrecommend';
// 删除图片 /deleteImg?filename=face/undefined.jpg
const iDeleteImg = '/deleteImg';

// 地图Key
const QQMapKey = 'CHMBZ-NCVWU-QQDVS-BVMRK-RYFNZ-FDFXA';

const wxRequest = (params, url) => {
  wx.request({
    url: url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      params.success && params.success(res)
    },
    fail: (res) => {
      params.fail && params.fail(res)
    },
    complete: (res) => {
      params.complete && params.complete(res)
    }
  })
}

const lgoinApi = (params) => wxRequest(params,wxlogin)

module.exports = {
  // 主机域名
  host,
  // 微信登录
  iwxlogin,
  // 上传文件
  iuploadtoken,
  // 省市
  iconfig,
  // 公共请求函数
  wxRequest,
  // 地图Key
  QQMapKey,
  // 七牛域名上传
  iQiniuUp,
  // 图片后缀
  iImgExt,
  // 七牛文件域名
  iQiniu,
  // 获取加入我们
  igGetIsLecturer,
  // 加入我们
  iPostLecturer,
  // 讲师列表
  iLecturer,
  // 首页推荐
  iRecommend,
  // 删除图片
  iDeleteImg,
}
