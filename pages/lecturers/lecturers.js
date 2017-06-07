var api = require('../../api/api.js')
var url = api.host + api.iLecturer
var pageSize = 10
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // 主机域名 - 七牛文件
    host: '',
    iImgExt: '',
    // 屏幕高度
    wHeight: 300,
    // 是否隐藏
    geoshow: true,
    // 显示的操作 1分类 2城市
    classshow: 0,
    // 分类集(json)
    classl: [],
    // 省集(json)
    region: [],
    // 市集(json)
    citys: [],
    // 选中的分类
    classid: 0,
    // 选中的省
    provinceid: 0,
    // 选中的市
    cityid: 0,
    // 分页指数
    requests: {
      // 是否正在加载中
      isLoad:false,
      // 顶部距离
      scrollTop:0,
      // 当前页码
      page: 0,
      // 总记录数
      total: 1,
      // 是否请求失败
      isfail: false,
      // 是否下拉
      isscrolltolower: true,
      // 查看的详情实体
      Model: {},
    },
    // 分类标题
    ClassName: '全部',
    // 地区标题
    RegionName: '选择地区',
    ProvinceName: '',
    // 讲师列表
    lecturers: [],

    films: [],
    hasMore: true,
    showLoading: true,
    start: 0,
  },
  onShareAppMessage: function () {
      return {
        title: '专家名 - 亲密育儿人才库',
        path: '/pages/lecturers/lecturers',
        success: function(res) {
          // 转发成功
        },
        fail: function(res) {
          // 转发失败
        }
      }
    },
  onPullDownRefresh: function () {
    console.log('onPullDownRefresh', new Date())
  },
  scroll: function (event) {
    // console.log('scroll请求')
    // console.log(event)
  },
  // 显示页
  onShow: function (options) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    })
    // 首页传过来的处理
    IndexSwitch(that);
  },
  onLoad: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    })
    var that = this
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu,
      iImgExt: api.iImgExt
    })
    // :begin 处理默认值
    var GeoMap = app.globalData.GeoMap;
    if (GeoMap.CityId > 0) {
      that.setData({
        // 选中的省
        provinceid: GeoMap.ProvinceId,
        // 选中的市
        cityid: GeoMap.CityId,
        // 地区标题
        RegionName: GeoMap.CityName,
      })
    } else {
      that.setData({
        // 选中的省
        provinceid: GeoMap.ProvinceId,
        // 地区标题
        RegionName: GeoMap.ProvinceName,
      })
    }
    console.log('奇怪了')
    console.log(GeoMap)
    // :end 处理默认值

    // 获取选项信息
    GetConfig(app, that);

    // 首页传过来的处理
    IndexSwitch(that);

    var requests = that.data.requests;
    if (!requests.isLoad){
      // 讲师列表
      GetLecturer(that)
    }
  },
  scrolltolower: function () {
    var that = this
    console.log('scrolltolower => 刷新1');
    console.log('scrolltolower => 刷新2');
    var requests = that.data.requests;
    if (!requests.isLoad){
      // 处理是否为下拉刷新
      requests.isscrolltolower = true;
      that.setData({
        requests: requests
      })
      // 讲师列表
      GetLecturer(that)
    }else{
      console.log('scrolltolower => 刷新 => 驳回');
    }
  },
  viewDetail: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var obj = event.currentTarget.dataset.obj;
    var requests = that.data.requests;
    requests.Model = obj;
    that.setData({
      requests: requests
    })
    wx.navigateTo({
      url: '../lecturerinfo/lecturerinfo?id=' + id
    })
  },
  // 详情
  bingInfo: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    var obj = event.currentTarget.dataset.obj;
    var requests = that.data.requests;
    requests.Model = obj;
    that.setData({
      requests: requests
    })
    wx.navigateTo({
      url: '../lecturerinfo/lecturerinfo?id=' + id
    })
  },
  // :beging 事件处理
  //服务选项
  ClassdTap: function (e) {
    var that = this;
    var classl = that.data.classl;
    if (classl.length === 0) {
      var Config = app.globalData.GeoMap.Config;
      that.setData({
        region: Config.provinces,
        classl: Config.services
      })
    }

    var classshow = 1;
    var geoshow = false;
    if (that.data.classshow == 1) {
      classshow = 0;
      geoshow = true;
    }
    that.setData({
      geoshow: geoshow,
      classshow: classshow
    });
  },
  // 地区选择
  RegionTap: function (e) {
    var that = this;
    var region = that.data.region;
    console.log('城市数据加载');
    console.log(that);
    console.log(app);
    console.log('城市项数据加载，count=>' + region.length);
    if (region.length > 0) {
      // 本地存储 - 城市
      wx.getStorage({
        key: 'config',
        success: function (res) {
          that.setData({
            region: res.data.provinces,
            classl: res.data.services
          })
        },
      })
    }
    var classshow = 2;
    var geoshow = false;
    if (that.data.classshow == 2) {
      classshow = 0;
      geoshow = true;
    }
    that.setData({
      geoshow: geoshow,
      classshow: classshow
    });
  },
  // 选择省
  ProvinceTap: function (event) {
    var that = this;
    var citys = [];
    var pid = event.currentTarget.dataset.id;
    var pName = event.currentTarget.dataset.name;
    [].forEach.call(that.data.region, function (item, i, arr) {
      if (item.id == pid) {
        citys = item.citys;
        if (citys[0].id != 0 && item.name.indexOf('市') < 0) {
          citys.splice(0, 0, {
            "id": 0,
            "nop":1,
            "name": "全省"
          });
        }
      }
    });
    that.setData({
      provinceid: pid,
      citys: citys,
      ProvinceName: pName
    })
  },
  CityTap: function (event) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    })
    var that = this;
    var cid = event.currentTarget.dataset.id;
    var cName = event.currentTarget.dataset.name;
    var ProvinceName = that.data.ProvinceName;
    if (cid > 0) {
      ProvinceName = cName;
    }
    if (ProvinceName.length > 6) {
      ProvinceName = ProvinceName.substr(0, 6);
    }
    var requests = that.data.requests;
    // 处理是否为下拉刷新
    requests.isscrolltolower = false;
    requests.page = 0;
    that.setData({
      cityid: cid,
      geoshow: true,
      // 显示的操作 1分类 2城市
      classshow: 0,
      requests: requests,
      RegionName: ProvinceName
    });
    // 讲师列表
    GetLecturer(that);
  },
  // 选择类别
  ClassTap: function (event) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    })
    console.log('分类事件');
    console.log(event);
    var that = this;
    var cid = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.title;
    if (cid <= 0) {
      title = '全部';
    } else {
      if (title.length > 6) {
        title = title.substr(0, 6);
      }
    }
    var requests = that.data.requests;
    // 处理是否为下拉刷新
    requests.isscrolltolower = false;
    requests.page = 0;
    requests.scrollTop = 0;
    that.setData({
      classid: cid,
      geoshow: true,
      // 显示的操作 1分类 2城市
      classshow: 0,
      requests: requests,
      ClassName: title
    });
    // 讲师列表
    GetLecturer(that);
  },
  HideGeoTap: function (event) {
    var that = this;
    that.setData({
      // 是否隐藏
      geoshow: true,
      // 显示的操作 1分类 2城市
      classshow: 0,
    })
  }
  // :end 事件处理
})





// 讲师列表
function GetLecturer(that) {
  var requests = that.data.requests;
  requests.isLoad = true;
  that.setData({
    requests: requests
  })
  var requests = that.data.requests;
  var page = (requests.page + 1)
  // 获取讲师列表
  api.wxRequest({
    data: {
      provinceid: that.data.provinceid,
      cityid: that.data.cityid,
      serverid: that.data.classid,
      page: page,
    },
    success: function (res) {
      console.log('lecturer success');
      console.log(res);
      var dataObj = res.data;
      if (dataObj.status == 0) {
        // 分页信息
        var pageObj = dataObj.data;
        // 结果信息
        var result = pageObj.data;
        // 没有出错
        requests.isfail = false;
        requests.page = page;
        requests.isLoad = false;
        // 总页数
        requests.total = pageObj.total;
        // 是否加载
        var hasMore =true;
        if (result.length===0){
          hasMore=false;
        }
        that.setData({
          hasMore: hasMore,
        })
        // 
        var lecturers = []
        // 是否为下拉显示，下拉为追元素
        if (requests.isscrolltolower) {
          console.log('请求结果');
          console.log(lecturers);
          console.log(result);
          lecturers = that.data.lecturers.concat(result);
        } else {
          lecturers = result;
        }
        that.setData({
          lecturers: lecturers,
          requests: requests
        })
      } else {
        requests.page = 0;
        requests.total = 1;
        that.setData({
          lecturers: [],
          requests: requests
        })
      }

      wx.hideToast();
    },
    fail: function (res) {
      console.log('lecturer fail');
      console.log(res);
      requests.isfail = true
      that.setData({
        requests: requests
      })

      wx.hideToast();
    }
  }, api.host + api.iLecturer)
}
// 首页导航连接
function IndexSwitch(that) {
  var options = {};
  var GeoMap = app.globalData.GeoMap;
  options.provinceid = GeoMap.ProvinceId;
  options.province = GeoMap.ProvinceName;
  options.CityId = 0;
  var goblaLec = app.globalData.lecturer;
  if (goblaLec.isShow) {
    if (GeoMap.CityId > 0) {
      options.CityId = GeoMap.CityId;
      options.province = GeoMap.CityName;
    }

    options.classid = goblaLec.classid;
    options.isShow = goblaLec.isShow;
    options.className = goblaLec.className;

    var requests = that.data.requests;
    requests.isscrolltolower = false;
    requests.page = 0;
    // 从首页传过来的ClassId
    that.setData({
      // 选中的分类
      classid: options.classid,
      // 选中的分类标题
      ClassName: options.className,
      // 选中的省
      provinceid: options.provinceid,
      // 省的标题
      RegionName: options.province,
      ProvinceName: '',
      // 选中的市
      cityid: options.CityId,
      requests: requests,
      // 是否隐藏
      geoshow: true,
      // 显示的操作 1分类 2城市
      classshow: 0,
    })

    goblaLec.classid = 0;
    goblaLec.isShow = false;
    options.className = '';
    app.globalData.lecturer = goblaLec
    // 讲师列表
    GetLecturer(that)
  }else{
    wx.hideToast();
  }

  // 如果省ID 大于0 ，则初始化默认加载市
  GetCitys(that, that.data.provinceid)
}

// 获取选项信息
function GetConfig(_app, _that) {
  var config = _app.globalData.GeoMap.Config;
  if (typeof config.length == 'undefined') {
    // 本地存储 - 城市
    wx.getStorage({
      key: 'config',
      success: function (res) {
        if (res.data) {
          _that.setData({
            region: res.data.provinces,
            classl: res.data.services
          })
          app.globalData.GeoMap.Config = res.data;
        } else {
          GetConfigHttp(_app, _that);
        }
      },
      fail: function (res) {
        GetConfigHttp(_app, _that);
      }
    })
  } else {
    _that.setData({
      region: config.provinces,
      classl: config.services
    })
  }
}
function GetConfigHttp(_app, _that) {
  api.wxRequest({
    success: (res) => {
      wx.setStorage({
        key: 'config',
        data: res.data.data,
      })
      _app.globalData.GeoMap.Config = res.data.data;
      _that.setData({
        region: res.data.provinces,
        classl: res.data.services
      })
    },
    fail: function (res) {
    }
  }, api.host + api.iconfig)
}
// 如果省ID 大于0 ，则初始化默认加载市
function GetCitys(that, ProvinceId) {
  if (ProvinceId > 0) {
    [].forEach.call(app.globalData.GeoMap.Config.provinces, function (item, i) {
      if (item.id == ProvinceId) {
        var citys = item.citys;
        if (citys[0].id != 0 && item.name.indexOf('市') < 0) {
          citys.splice(0, 0, {
            "id": 0,
            "nop":1,
            "name": "全省"
          });
        }
        that.setData({
          citys: citys
        })
      }
    })
  }
}