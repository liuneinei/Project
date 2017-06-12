var api = require('../api/api.js');
var configs = require('configs.js');
// 引入SDK核心类
var QQMapWX = require('../utils/qqmap-wx-jssdk.min.js');

const getlocation = (fb)=>{
  // 实例化API核心类
  var qqmapwx = new QQMapWX({
    key: api.QQMapKey // 必填
  });
  // 如果从首页导航进来############不要获取地理位置
  // 获取地理信息
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      // 调用接口
      qqmapwx.reverseGeocoder({
        location: {
          //纬度，浮点数，范围为-90~90，负数表示南纬
          latitude: res.latitude,
          //经度，浮点数，范围为-180~180，负数表示西经
          longitude: res.longitude
        },
        success: function (res) {
          typeof fb === 'function' && fb(res.result);
        },
        fail: function (res) {
          res.status = false;
          typeof fb === 'function' && fb(res.result);
        }
      });
    },
    fail:function(res){
      res.status = false;
      typeof fb === 'function' && fb(res);
    }
  });
}

// 获取配置
const getconfig = (fb) => {
  if (configs.store){
    typeof fb === 'function' && fb(configs.store);
  }else{
    var config = wx.getStorageSync('config') || null;
    if(config){
      configs.store = config;
      typeof fb === 'function' && fb(config);
    }else{
      api.wxRequest({
        success: (res) => {
          //同步存储
          wx.setStorageSync('config', res.data.data);
          configs.store = res.data.data;
          typeof fb === 'function' && fb(res.data.data);
        }
      }, api.host + api.iconfig);
    }
  }
}

const setdatas = (map_data,fb)=>{
  console.log('setdatas 处理地理信息');
  var province_name = map_data.ad_info.province;
  var city_name = map_data.ad_info.city;
  if (configs.store.provinces != undefined){
    // 遍历集
    [].forEach.call(configs.store.provinces, function (item, i) {
      if (item.name == province_name && item.nop > 0) {
        // 记录省ID
        configs.province_id = item.id;
        configs.province_name = item.name;
        if(item.citys != undefined){
          [].forEach.call(item.citys, function (itemc, ic) {
            if (itemc.name == city_name && itemc.nop > 0) {
              configs.city_id = itemc.id;
              configs.city_name = itemc.name;
            }
          });
        }
      }
    });
  }
  typeof fb === 'function' && fb();
}
module.exports = {
  // 获取config
  getconfig,
  // 获取location
  getlocation,
  // 设置data
  setdatas,
}
