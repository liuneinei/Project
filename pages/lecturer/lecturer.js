var api = require('../../api/api.js')
// 引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    // 主机域名 - 七牛文件
    host: '',
    iImgExt:'',
    // 屏幕高度
    wHeight: 300,
    // 是否隐藏
    geoshow:true,
    // 显示的操作 1分类 2城市
    classshow:0,
    // 分类集(json)
    classl: [],
    // 省集(json)
    region: [],
    // 市集(json)
    citys:[],
    // 选中的分类
    classid: 0,
    // 选中的省
    provinceid: 0,
    // 选中的市
    cityid: 0,
    // 分页指数
    requests:{
      // 当前页码
      page:0,
      // 总页数
      total:1,
      // 是否请求失败
      isfail:false,
      // 是否下拉
      isscrolltolower:true,
      // 查看的详情实体
      Model:{},
    },
    // 分类标题
    ClassName: '全部',
    // 地区标题
    RegionName: '选择地区',
    ProvinceName:'',
    // 讲师列表
    lecturers: [],
  },
  onPullDownRefresh: function () {
      wx.stopPullDownRefresh();
      // console.log('onPullDownRefresh', new Date());
  },
  scroll: function (e) {
    // console.log('scroll'+e)
  },
  scrolltolower: function () {
    // console.log('scrolltolower')
    var that = this
    var requests = that.data.requests;
    if (requests.page < requests.total){
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
      // 处理是否为下拉刷新
      requests.isscrolltolower=true;
      that.setData({
        requests: requests
      })
      // 讲师列表
      GetLecturer(that)
    }
  },
  // 详情
  bingInfo:function(event){
    var that = this;
    var id = event.currentTarget.dataset.id;
    var obj = event.currentTarget.dataset.obj;
    var requests = that.data.requests;
    requests.Model = obj;
    that.setData({
      requests: requests
    })
    wx.navigateTo({
      url: '../lecturerinfo/lecturerinfo?id='+id
    })
  },
  // 显示页
  onShow: function (options){
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    })
    // 首页传过来的处理
    IndexSwitch(that);
  },
  onLoad: function (options) {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration:1500
    })
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    });
    // 获取系统信息，提取屏幕高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wHeight: res.windowHeight - 90
        })
      }
    })
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu,
      iImgExt: api.iImgExt
    })

    // :begin 处理默认值
    var GeoMap = app.globalData.GeoMap;
    if (GeoMap.CityId > 0){
      that.setData({
        // 选中的省
        provinceid: GeoMap.ProvinceId,
        // 选中的市
        cityid: GeoMap.CityId,
        // 地区标题
        RegionName: GeoMap.CityName,
      })
    }else{
      that.setData({
        // 选中的省
        provinceid: GeoMap.ProvinceId,
        // 地区标题
        RegionName: GeoMap.ProvinceName,
      })
    }
    // :end 处理默认值

    // 获取选项信息
    GetConfig(app,that);

    // 首页传过来的处理
    IndexSwitch(that);
    
    // 讲师列表
    GetLecturer(that)
  },
  // :beging 事件处理
  //服务选项
  ClassdTap:function(e){
    var that = this;
    var classl = that.data.classl;
    console.log('服务数据加载');   
    console.log(that);     
    console.log('服务项数据加载，count=>' + classl.length);
    if (classl.length>0){
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
    
    var classshow = 1;
     var geoshow=false;
     if (that.data.classshow == 1){
      classshow=0;
       geoshow=true;
    }
     that.setData({
      geoshow: geoshow,
      classshow: classshow,
    });
  },
  // 地区选择
  RegionTap:function(e){
    var that = this; 
    var region = that.data.region;
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
    var geoshow=false;
    if (that.data.classshow == 2){
      classshow=0;
      geoshow=true;
    }
    that.setData({
      geoshow: geoshow,
      classshow: classshow
    });
  },
  // 选择省
  ProvinceTap: function (event){
    var that = this;  
    var citys=[];
    var pid = event.currentTarget.dataset.id;
    var pName = event.currentTarget.dataset.name;
    [].forEach.call(that.data.region, function (item, i, arr) {
        if (item.id == pid) {
          citys = item.citys;
          if(citys[0].id != 0 && item.name.indexOf('市')<0){
            citys.splice(0, 0, {
              "id": 0,
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
  CityTap:function(event){
    var that = this;
    var cid = event.currentTarget.dataset.id;
    var cName = event.currentTarget.dataset.name;
    var ProvinceName = that.data.ProvinceName;
    if(cid > 0){
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
  ClassTap:function(event){
    console.log('分类事件');
    console.log(event);
    var that = this;
    var cid = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.title;
    if (cid <= 0){
      title ='全部';
    }else{
      if(title.length>6){
        title = title.substr(0,6);
      }
    }
    var requests = that.data.requests;
    // 处理是否为下拉刷新
    requests.isscrolltolower = false;
    requests.page = 0;
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
  HideGeoTap:function(event){
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
function GetLecturer(that){
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
        // 总页数
        requests.total = pageObj.total;
        // 
        var lecturers = []
        // 是否为下拉显示，下拉为追元素
        if (requests.isscrolltolower){
          lecturers = that.data.lecturers.concat(result);
        }else{
          lecturers = result;
        }
        that.setData({
          lecturers: lecturers,
          requests: requests
        })
      }else{
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
    }
  }, api.host + api.iLecturer)
}
// 首页导航连接
function IndexSwitch(that){
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
      ProvinceName:'',
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
  }

  // 如果省ID 大于0 ，则初始化默认加载市
  GetCitys(that, that.data.provinceid)
}

// 获取选项信息
function GetConfig(_app,_that){
  var config = _app.globalData.GeoMap.Config;
  if(config.length<=0){
    // 本地存储 - 城市
    wx.getStorage({
      key: 'config',
      success: function (res) {
        if(res.data.length>0){
          _that.setData({
            region: res.data.provinces,
            classl: res.data.services
          })
        }else{
          GetConfigHttp(_app, _that);
        }
      },
      fail:function(res){
        GetConfigHttp(_app, _that);
      }
    })
  }else{
    _that.setData({
      region: config.provinces,
      classl: config.services
    })
  }
}
function GetConfigHttp(_app, _that){
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
function GetCitys(that,ProvinceId){
  if (ProvinceId > 0){
    [].forEach.call(app.globalData.GeoMap.Config.provinces,function(item,i){
      if(item.id == ProvinceId){
        that.setData({
          citys: item.citys
        })
      }
    })
  }
}