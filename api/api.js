// 主机域名
const host = 'https://edu.yanma.com';
// 微信登录
const iwxlogin = '/wxlogin';
// 上传文件
const iuploadtoken = '/uploadtoken';
// 省市
const iconfig = '/config';

// 地图Key
const QQMapKey = 'CHMBZ-NCVWU-QQDVS-BVMRK-RYFNZ-FDFXA';

const wxRequest = (params, url) => {
  wx.showToast({
    title: '加载中',
    icon: 'loading'
  })
  wx.request({
    url: url,
    method: params.method || 'GET',
    data: params.data || {},
    header: {
      'Content-Type': 'application/json'
    },
    success: (res) => {
      params.success && params.success(res)
      wx.hideToast()
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
}
