var api = require('../../api/api.js')
var aldstat = require('../../utils/ald-stat.js');
var configs = require('../configs.js');
var functions = require('../functions.js');
//获取应用实例
var app = getApp()
Page({
  data: {
    // 配置信息
    Config:{
      // 主机域名 - 七牛文件
      host: '',
      // 七牛的追加后缀名
      iImgExt: '',
      // 屏幕高度，默认值
      wHeight: 300,
    },
    // 分类
    Class:{
      // 分类id
      id:0,
      // 分类导航名称
      name:'全部'
    },
    // 城市
    Region:{
      // 省id
      pid:0,
      // 市id
      cid:0,
      // 省名称
      pname:'',
      // 城市导航名
      showname:'选择城市'
    },
    // 集合
    Lists:{
      // 分类集合
      classList:[],
      // 省集合
      regionList:[],
      // 市集合
      cityList:[],
      // 讲师集合
      lecturerList:[]
    },
    // 请求参数
    Req:{
      // 导航显示，1为分类显示 2城市显示
      showType:0,
      // 当前页码
      index:0,
      // 总记录数
      total:1,
      // 是否正在加载，解决多次向上拉加载请求
      loading:true,
      // 是否为向上拉加载，解决是否需要追加集还是绑定集
      scroll:false
    }
  },
  onShareAppMessage: function () {
    var that = this;
      return {
        title: '亲密孕育专业人才库',
        path: '/pages/lecturers/lecturers' + arg
      }
    },
  // 显示页
  onShow: function (options) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    });
  },
  onLoad: function (option) {
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    });
    that.setData({
      // 七牛文件查看域名
      host: api.iQiniu,
      iImgExt: api.iImgExt
    });

    // 分类 Object
    var Class = that.data.Class;
    // 城市 Object
    var Region = that.data.Region;
    // 是否为参数传入 ?arg=true
    option.arg = option.arg || false;
    if (option.arg) {
      Region.pid = option.provinceid || 0;
      Region.cid = option.cityid || 0;
      Class.id = option.classid || 0;
      // 设置保存值
      that.setData({
        Class: Class,
        Region: Region
      });
    }
    // 第一步 获取ApiConfig/StoreConfig信息，为后续遍历加载
    functions.getconfig(function (res) {
      console.log('config:');
      console.log(res);
      // 设置导航list集
      SetPageDataNavList(that);
      if (option.arg) {
        // #########为参数进入
        // 设置标题名称
        SetPageDataNavName(that);
      }else{
        // #########非参数进入
        // 第二步 获取定位信息；true,代表系统默认值，需要获取定位信息
        if (configs.is_default) {
          console.log('第二步，获取Geo1');
          functions.getlocation(function (res2) {
            console.log('第二步，获取location Back.');
            if (res2.status != false) {
              res2.status = res2.status || true;
            }
            // 默认返回True
            if (res2.status) {
              functions.setdatas(res2, function () {
                console.log('打印默认值');
                console.log(configs);
                // 由于上一步应该对 configs 赋值，所以使用 configs
                // 使用配置的值
                SetPageDataNavId(that);
                // 设置标题名称
                SetPageDataNavName(that);
              });
            } else {
              // 使用配置的值
              SetPageDataNavId(that);
              // 设置标题名称
              SetPageDataNavName(that);
            }
          });
        } else {
          console.log('第二步，获取Geo2');
          // 使用配置的值
          SetPageDataNavId(that);
          // 设置标题名称
          SetPageDataNavName(that);
        }
      }
    });
    
    // 第三步 设置导航名称
    // 第四步 请求讲师API
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
    var Req = that.data.Req;
    // 导航显示，1为分类显示 2城市显示
    if (Req.showType != 1){
      Req.showType = 1
    }else{
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
    var that = this;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 1500
    });
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
    that.setData({
      Class: Class
    });
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
function SetPageDataNavId(that){
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
            if (itemc.id == Region.cid && itemc.nop > 0) {
              Region.showname = itemc.name;
            }
          });
        }
      }
    });
  }
  if (configs.store.services != undefined){
    [].forEach.call(configs.store.services,function(item,i){
      if (item.id == Class.id){
        Class.name = item.title;
      }
    });
  }
  // 设置保存值
  that.setData({
    Class: Class,
    Region: Region,
    Lists: Lists
  });
}

function SetConfigs(that,mapdata){
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
  var requests = that.data.requests;
  requests.isLoad = true;
  that.setData({
    requests: requests
  })
  var requests = that.data.requests;
  var page = (requests.page + 1);
  console.log('lec加载');
  console.log(that);
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
      ProvinceName: GeoMap.ProvinceName,
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
    GetLecturer(that);
  }else{
    wx.hideToast();
  }

  // 如果省ID 大于0 ，则初始化默认加载市
  GetCitys(that, that.data.provinceid)
}

// 获取选项信息
function GetConfig(that) {
  console.log('a1');
   var config = wx.getStorageSync('config')||{};
   if(config.Config == 'undefined' || config.Config == undefined){
     console.log('a2');
      // 地区拉取API
    api.wxRequest({
      success: (res) => { 
        console.log('a3');
        console.log(that);
        console.log(res);
        //同步存储
        wx.setStorageSync('config', res.data.data);
        that.setData({
          region: res.data.data.provinces,
          classl: res.data.data.services
        });
        console.log('a3-1');
      console.log(that);
        SetDataNav(that);
      }
    }, api.host + api.iconfig);
   }else{
     console.log('a4');
      that.setData({
          region: config.provinces,
          classl: config.services
        });
        SetDataNav(that);
   }
}
//设置标头
function SetDataNav(that){
  console.log('b1');
  var dataObj= that.data;
  console.log(that);
  var ProvinceName='';
  var regionName='';
  var citys=[];
  if(dataObj.region.length>0){
    [].forEach.call(dataObj.region,function(item,i){
      if(item.id== dataObj.provinceid){
        regionName=item.name;
        ProvinceName = item.name;
        citys = item.citys;
        if (citys[0].id != 0 && item.name.indexOf('市') < 0) {
          citys.splice(0, 0, {
            "id": 0,
            "nop": 1,
            "name": "全省"
          });
        }
         if (item.name.indexOf('市') < 0) {
           if(item.citys.length >0){
             [].forEach.call(item.citys,function(itemc,i){
               if (itemc.id > 0 && itemc.id == dataObj.cityid){
                 regionName = itemc.name;
               }
             });
           }
         }
      }
    });
    if (regionName != ''){
      that.setData({
        ProvinceName: ProvinceName,
        RegionName:regionName,
        citys:citys
      });
    }
  }
  if(dataObj.classl.length>0){
    [].forEach.call(dataObj.classl,function(citem,i){
      if(citem.id == dataObj.classid){
        that.setData({
          ClassName: citem.title
        });
      }
    });
  }
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

// 如果是参数进来，则获取名称
function GetNavName(that){
  console.log('参数进来了');
  console.log(that);
  var requests = that.data.requests;
  if (requests.isarg){
    requests.isarg=false;
    if (that.classid > 0 && that.classl.length >0){
      [].forEach.call(that.classl,function(item,i){
        if (item.id == that.classid){
          that.setData({
            ClassName: item.title,
            requests: requests
          })
        }
      })
    }
    if ((that.provinceid > 0 || that.cityid > 0) && that.region.length>0){
      var regionName ='';
      [].forEach.call(that.region,function(item,i){
        if (that.provinceid == item.id){
          regionName=item.name;
          if (item.citys.length > 0 && that.cityid>0){
            [].forEach.call(item.citys,function(itemc,ic){
              if(itemc.id == that.cityid){
                regionName = itemc.name;
              }
            })
          }
          that.setData({
            RegionName: regionName,
            requests: requests
          })
        }
      })
    }
  }
}