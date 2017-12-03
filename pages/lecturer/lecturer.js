var api = require('../../api/api.js')
var aldstat = require('../../utils/ald-stat.js');
var configs = require('../configs.js');
var functions = require('../functions.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    str: '',
    // 配置信息
    Config: {
      // 主机域名 - 七牛文件
      host: '',
      // 七牛的追加后缀名
      iImgExt: '',
      // 屏幕高度，默认值
      wHeight: 300,
    },
    // 分类
    Class: {
      // 分类id
      id: 0,
      // 分类导航名称
      name: '全部'
    },
    // 城市
    Region: {
      // 是否为参数进入
      arg: false,
      // 省id
      pid: 0,
      // 市id
      cid: 0,
      // 省名称
      pname: '',
      // 城市导航名
      showname: '选择城市'
    },
    // 集合
    Lists: {
      // 分类集合
      classList: [],
      // 省集合
      regionList: [],
      // 市集合
      cityList: [],
      // 讲师集合
      lecturerList: []
    },
    // 请求参数
    Req: {
      // 导航显示，1为分类显示 2城市显示
      showType: 0,
      // 当前页码
      index: 0,
      // 总记录数
      total: 1,
      // 是否正在加载，解决多次向上拉加载请求
      loading: false,
      // 是否为向上拉加载，解决是否需要追加集还是绑定集
      scroll: false,
      // 处理wxml显示问题
      hasMore: true
    }
  },
  onShareAppMessage: function () {
    var that = this;
    var Class = that.data.Class;
    var Region = that.data.Region;
    var title = Region.showname;
    var arg = '';
    if (Class.id > 0) {
      title += ' - ' + Class.name;
      title += ' - ' + '专家列表';
    } else {
      title += ' - 孕育专家';
    }
    arg = '?provinceid=' + Region.pid;
    arg += '&cityid=' + Region.cid;
    arg += '&classid=' + Class.id;

    return {
      title: title,
      path: '/pages/lecturers/lecturers' + arg
    }
  },
  // 显示页
  onShow: function (options) {
    var that = this;
    // 记录
    var showinfo = wx.getStorageSync('showinfo');
    if (showinfo == 'true') {
      wx.setStorageSync('showinfo', null);
      return;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    });
    console.log('onShow');
    console.log(options);
    var ilObj = wx.getStorageSync('ilclass');
    if (ilObj.isShow == true) {
      var Req = that.data.Req;
      Req.index = 0;
      Req.showType = 0;
      Req.scroll = false;
      Req.hasMore = true;
      that.setData({
        Req: Req
      })
      // 第一步 获取ApiConfig/StoreConfig信息，为后续遍历加载
      functions.getconfig(function (res) {
        // 设置导航list集
        SetPageDataNavList(that);
        // #########非参数进入
        // 第二步 获取定位信息；true,代表系统默认值，需要获取定位信息
        if (configs.is_default == true) {
          functions.getlocation(function (res2) {
            if (res2.status != false) {
              res2.status = res2.status || true;
            }
            // 设置默认为
            configs.is_default = false;
            // 默认返回True
            if (res2.status) {
              functions.setdatas(res2, function () {
                // 由于上一步应该对 configs 赋值，所以使用 configs
                // 使用配置的值
                SetPageDataNavId(that);
                // 配置分类
                SetPageDataNavClass(that, ilObj);
                // 设置标题名称
                SetPageDataNavName(that);
                // 讲师列表
                GetLecturer(that);
              });
            } else {
              // 使用配置的值
              SetPageDataNavId(that);
              // 配置分类
              SetPageDataNavClass(that, ilObj);
              // 设置标题名称
              SetPageDataNavName(that);
              // 讲师列表
              GetLecturer(that);
            }
          });
        } else {
          // 使用配置的值
          SetPageDataNavId(that);
          // 配置分类
          SetPageDataNavClass(that, ilObj);
          // 设置标题名称
          SetPageDataNavName(that);
          // 讲师列表
          GetLecturer(that);
        }
      });
    }
  },
  onReady: function (options) {
    console.log('onReady');
    console.log(options);
  },
  onLoad: function (options) {
    console.log('onLoad');
    console.log(options);

    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    });
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.screenHeight)
        console.log(res.windowHeight)
        var Config = that.data.Config;
        // 屏幕高度，默认值
        Config.wHeight = res.screenHeight - 155;
        that.setData({
          Config: Config
        })
      }
    })
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu,
      iImgExt: api.iImgExt
    });
    // 处理从首页的跳转
    var ilObj = wx.getStorageSync('ilclass');
    if (ilObj.isShow == true) {
      return;
    }
    // 分类 Object
    var Class = that.data.Class;
    // 城市 Object
    var Region = that.data.Region;
    // 是否为参数传入 ?arg=true
    options.arg = options.arg || false;
    Region.pid = options.provinceid || 0;
    Region.cid = options.cityid || 0;
    Class.id = options.classid || 0;

    if (options.arg != false || (Region.pid > 0 || Region.cid > 0 || Class.id > 0)) {
      options.arg = true;
      Region.arg = true;
      // 设置保存值
      that.setData({
        Class: Class,
        Region: Region
      });
    } else {
      options.arg = false;
      Region.arg = false;
      // 设置保存值
      that.setData({
        Region: Region
      });
    }
    // 第一步 获取ApiConfig/StoreConfig信息，为后续遍历加载
    functions.getconfig(function (res) {
      // 设置导航list集
      SetPageDataNavList(that);
      if (options.arg) {
        // #########为参数进入
        // 设置标题名称
        SetPageDataNavName(that);
        // 讲师列表
        GetLecturer(that);
      } else {
        // #########非参数进入
        // 第二步 获取定位信息；true,代表系统默认值，需要获取定位信息
        if (configs.is_default == true) {
          functions.getlocation(function (res2) {
            if (res2.status != false) {
              res2.status = res2.status || true;
            }
            // 设置默认为
            configs.is_default = false;
            // 默认返回True
            if (res2.status) {
              functions.setdatas(res2, function () {
                // 由于上一步应该对 configs 赋值，所以使用 configs
                // 使用配置的值
                SetPageDataNavId(that);
                // 设置标题名称
                SetPageDataNavName(that);
                // 讲师列表
                GetLecturer(that);
              });
            } else {
              // 使用配置的值
              SetPageDataNavId(that);
              // 设置标题名称
              SetPageDataNavName(that);
              // 讲师列表
              GetLecturer(that);
            }
          });
        } else {
          // 使用配置的值
          SetPageDataNavId(that);
          // 设置标题名称
          SetPageDataNavName(that);
          // 讲师列表
          GetLecturer(that);
        }
      }
    });

    // 第三步 设置导航名称
    // 第四步 请求讲师API
  },
  scrolltolower: function () {
    var that = this
    var Req = that.data.Req;
    if (!Req.loading) {
      // 处理是否为下拉刷新
      Req.loading = true;
      Req.scroll = true;
      that.setData({
        Req: Req
      })
      // 讲师列表
      GetLecturer(that)
    } else {
      console.log('scrolltolower => 刷新 => 驳回');
    }
  },
  // 详情
  bingInfo: function (event) {
    var that = this;
    var id = event.currentTarget.dataset.id;
    // 记录
    wx.setStorageSync('showinfo', 'true');
    wx.navigateTo({
      url: '../lecturerinfo/lecturerinfo?id=' + id
    })
  },
  // :beging 事件处理
  //服务选项
  ClassdTap: function (e) {
    var that = this;
    var Req = that.data.Req;
    // 导航显示，1为分类显示 2城市显示
    if (Req.showType != 1) {
      Req.showType = 1
    } else {
      Req.showType = 0;
    }
    that.setData({
      Req: Req
    });
  },
  // 地区选择
  RegionTap: function (e) {
    var that = this;
    var that = this;
    var Req = that.data.Req;
    // 导航显示，1为分类显示 2城市显示
    if (Req.showType != 2) {
      Req.showType = 2
    } else {
      Req.showType = 0;
    }
    that.setData({
      Req: Req
    });
  },
  // 选择省
  ProvinceTap: function (event) {
    var that = this;
    // 城市
    var Region = that.data.Region;
    // 集合
    var Lists = that.data.Lists;
    Region.pid = event.currentTarget.dataset.id;
    Region.pname = event.currentTarget.dataset.name;
    if (configs.store.provinces != undefined) {
      // 遍历集
      [].forEach.call(configs.store.provinces, function (item, i) {
        if (item.id == Region.pid && item.nop > 0) {
          if (item.citys != undefined) {
            Lists.cityList = item.citys;
            if (Lists.cityList[0].id != 0 && item.name.indexOf('市') < 0) {
              Lists.cityList.splice(0, 0, {
                "id": 0,
                "nop": 1,
                "name": "全省"
              });
            }
          }
        }
      });
    }
    that.setData({
      Region: Region,
      Lists: Lists
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

    var Req = that.data.Req;
    var Region = that.data.Region;
    Region.showname = Region.pname;
    Region.cid = cid;
    if (cid > 0) {
      Region.showname = cName;
    }
    if (Region.showname.length > 6) {
      Region.showname = Region.showname.substr(0, 6);
    }

    // 处理是否为下拉刷新
    Req.loading = false;
    Req.scroll = false;
    Req.index = 0;
    Req.showType = 0;

    that.setData({
      Req: Req,
      Region: Region
    });
    // 讲师列表
    GetLecturer(that);
  },
  // 选择类别
  ClassTap: function (event) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    });
    var Req = that.data.Req;
    // 分类
    var Class = that.data.Class;
    // 分类id
    Class.id = event.currentTarget.dataset.id;
    // 分类导航名称
    Class.name = event.currentTarget.dataset.title;

    if (Class.id <= 0) {
      Class.name = '全部';
    } else {
      if (Class.name.length > 6) {
        Class.name = Class.name.substr(0, 6);
      }
    }

    // 处理是否为下拉刷新
    Req.loading = false;
    Req.scroll = false;
    Req.index = 0;
    Req.showType = 0;
    that.setData({
      Req: Req,
      Class: Class
    });
    // 讲师列表
    GetLecturer(that);
  },
  HideGeoTap: function (event) {
    var that = this;
    var Req = that.data.Req;
    // 导航显示，1为分类显示 2城市显示
    Req.showType = 0;
    that.setData({
      Req: Req
    })
  }
  // :end 事件处理
})
// 设置导航List
function SetPageDataNavList(that) {
  // List Object
  var Lists = that.data.Lists;
  Lists.classList = configs.store.services || [];
  Lists.regionList = configs.store.provinces || [];
  // 设置保存值
  that.setData({
    Lists: Lists
  });
}

// 设置导航的值
function SetPageDataNavId(that) {
  // 分类 Object
  var Class = that.data.Class;
  // 城市 Object
  var Region = that.data.Region;
  // 不是参数值，而是定位值
  Region.pid = configs.province_id || 0;
  Region.cid = configs.city_id || 0;
  Class.id = 0;
  // 设置保存值
  that.setData({
    Class: Class,
    Region: Region
  });
}
// 设置分类Id
function SetPageDataNavClass(that, ilObj) {
  // 分类 Object
  var Class = that.data.Class;
  Class.id = ilObj.classid;
  Class.name = ilObj.className;
  // 删除缓存
  wx.removeStorageSync('ilclass');
  that.setData({
    Class: Class
  })
}
// 设置导航的值
function SetPageDataNavName(that) {
  // 分类 Object
  var Class = that.data.Class;
  // 城市 Object
  var Region = that.data.Region;
  // 城市集
  var Lists = that.data.Lists;
  Class.name = '全部';
  // 这里怪怪的############################
  Region.pname = configs.province_name;
  Region.showname = configs.city_name;
  if (configs.store.provinces != undefined) {
    // 遍历集
    [].forEach.call(configs.store.provinces, function (item, i) {
      if (item.id == Region.pid && item.nop > 0) {
        // 省名称
        Region.pname = item.name;
        Region.showname = item.name;
        if (item.citys != undefined) {
          Lists.cityList = item.citys;
          if (item.citys[0].id != 0 && item.name.indexOf('市') < 0) {
            Lists.cityList.splice(0, 0, {
              "id": 0,
              "nop": 1,
              "name": "全省"
            });
          }
          [].forEach.call(item.citys, function (itemc, ic) {
            if (itemc.id == Region.cid && itemc.nop > 0 && !Region.arg) {
              Region.showname = itemc.name;
            }
          });
        }
      }
    });
  }
  if (configs.store.services != undefined) {
    [].forEach.call(configs.store.services, function (item, i) {
      if (item.id == Class.id) {
        Class.name = item.title;
      }
    });
  }
  console.log('Region.showname');
  console.log(Region.showname);
  // 设置保存值
  that.setData({
    Class: Class,
    Region: Region,
    Lists: Lists
  });
}

function SetConfigs(that, mapdata) {
  var Lprovince = res.result.ad_info.province;
  var Lcity = res.result.ad_info.city;
  // 遍历,得到默认的ID
  [].forEach.call(region, function (item, i, arr) {
    if (item.name == that.globalData.GeoMap.ProvinceName) {
      that.globalData.GeoMap.ProvinceId = item.id;
    }
  });
  // 遍历集
  [].forEach.call(region2, function (item1, i1, arr1) {
    if (item1.name == Lprovince && item1.nop > 0) {
      // 记录省ID
      that.globalData.GeoMap.ProvinceId = item1.id;
      that.globalData.GeoMap.ProvinceName = item1.name;
      [].forEach.call(item1.citys, function (itemc, ic, arrc) {
        if (itemc.name == Lcity && itemc.nop > 0) {
          that.globalData.GeoMap.CityId = itemc.id;
          that.globalData.GeoMap.CityName = itemc.name;
        }
      })
    }
  });
}

// 讲师列表
function GetLecturer(that) {
  // 分类
  var Class = that.data.Class;
  // 城市
  var Region = that.data.Region;
  // 集合
  var Lists = that.data.Lists;
  // // 讲师集合
  // Lists.lecturerList
  var Req = that.data.Req;
  Req.loading = true;
  that.setData({
    Req: Req
  })
  // 请求参数
  Req.index = (Req.index + 1);

  // 获取讲师列表
  api.wxRequest({
    data: {
      provinceid: Region.pid,
      cityid: Region.cid,
      serverid: Class.id,
      page: Req.index,
    },
    success: function (res) {
      var dataObj = res.data;
      if (dataObj.status == 0) {

        // 分页信息
        var pageObj = dataObj.data;
        // 结果信息
        var result = pageObj.data;

        Req.total = pageObj.total;
        Req.loading = false;
        // 是否加载
        Req.hasMore = true;
        if (result.length === 0) {
          Req.hasMore = false;
        }

        // 是否为下拉显示，下拉为追元素
        if (Req.scroll) {
          Lists.lecturerList = Lists.lecturerList.concat(result);
        } else {
          Lists.lecturerList = result;
        }
        Req.scroll = false;
        that.setData({
          Req: Req,
          Lists: Lists
        })
      } else {
        Req.index = 0;
        Req.total = 1;
        Lists.lecturerList = [];
        that.setData({
          Lists: Lists,
          Req: Req
        })
      }
      wx.hideToast();
    },
    fail: function (res) {
      wx.hideToast();
    }
  }, api.host + api.iLecturer)
}
