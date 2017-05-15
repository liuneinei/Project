var api = require('../../api/api.js')
var arrs = [1, 2, 3];
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    items:arrs,
    province:'所在',
    city:'城市',
    latitude:0,
    longitude:0,
    speed:'',
    accuracy:'' 
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '预约服务'
    })
  },
  //拔打电话
  bindCallPhone:function(e){
      var phone ;
  },
  // 服务项目
  bindProject:function(e){
    wx.showActionSheet({
            itemList: ['分娩导乐', '生育教育讲师', '母乳指导'],
            success: function(res) {
                if (!res.cancel) {
                    console.log(res.tapIndex)
                }
            }
        });
  },
  // 拥有资质
  bindQualification:function(e){
    wx.showActionSheet({
            itemList: ['芭芭拉温柔分娩导乐', 'ICEA分娩导乐认证候选人', 'ICEA认证分娩导乐','ICEA生育教育讲师认证候选人','ICEA认证生育教育讲师','盐妈母乳指导学员'],
            success: function(res) {
                if (!res.cancel) {
                    console.log(res.tapIndex)
                }
            }
        });
  },
  // 所在城市
  bindCity:function(e){
    wx.showActionSheet({
      itemList: ['广东广州', '广东深圳', '广东清远', '广东云浮', '广东揭阳', '广东中山', '深圳'],
            success: function(res) {
                if (!res.cancel) {
                    console.log(res.tapIndex)
                }
            }
        });
  },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh', new Date())
  },
  scroll: function (e) {
    //console.log('scroll'+e)
  },
  scrolltolower: function () {
    console.log('scrolltolower')
    var that = this
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
  arrs[3]=4;
  arrs[4]=5;
    that.setData({
            items:arrs
          })
  },
  // 详情
  bingInfo:function(event){
    console.log(event);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?id='+id
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        //纬度，浮点数，范围为-90~90，负数表示南纬
        var latitude = res.latitude
         //经度，浮点数，范围为-180~180，负数表示西经
        var longitude = res.longitude
         //速度，浮点数，单位m/s
        var speed = res.speed
        //位置的精确度
        var accuracy = res.accuracy

        api.getmap({
        data: {
          location: latitude+','+longitude,
          key:'CHMBZ-NCVWU-QQDVS-BVMRK-RYFNZ-FDFXA'
        },
        success: (res) => {
          //省份
          var province = res.data.result.ad_info.province
          province = province.substr(0,2);
          //城市
          var city = res.data.result.ad_info.city
          city = city.substr(0,2);
          that.setData({
            province:province,
            city:city
          })
        } 
      })
      }
    });
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    });
  }
})
