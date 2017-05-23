// 主机域名
const host = 'https://edu.yanma.com'
// 微信登录
const wxlogin = '/wxlogin'
// 上传文件
const uploadtoken = '/uploadtoken'
// 省市
const getRegion = '/getRegion'

const geourl = 'https://apis.map.qq.com/ws/geocoder/v1/';
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
// map
const getmap = (params) => wxRequest(params, geourl)

const lgoinApi = (params) => wxRequest(params,wxlogin)

module.exports = {
  host,
  wxRequest,
  getmap,
  QQMapKey,
}
