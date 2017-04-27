const host = 'https://wxnnn.wang'

const geourl = 'https://apis.map.qq.com/ws/geocoder/v1/';

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

module.exports = {
  wxRequest,
  getmap,
}
