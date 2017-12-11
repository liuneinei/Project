
var util = require('../../utils/util.js')
var ymtool = require('../ymtool.js');

Page({
  data: {
    userdata:{
      area:'',    // 地区集 1,3,5
      service:'', // 服务集 1,5,7
      train: '',  // 培训机构
      cert_imgs: '',// 证书Url
      index:2,    // 索引
    },
    showdata:{
      area: [],     // 地区集合 {province:0,city:1,name:''}
      service: [],  // 服务集合 {id:0,name:''}
    },
  },
  onLoad: function () {
    // 操作 - 同步缓存
    var _userdata = wx.getStorageSync('$userdata');
  },
  
  // Begin 服务地区 ###################################################
  // Begin: 事件处理
  /*
  * 服务地区 - 选择
  */
  btnChooseCity:function(){
    wx.navigateTo({
      url: '/pages/mycity/mycity',
    });
  },

  /*
  * 服务地区 - 更新 ****** 回调函数
  */
  changeCity: function (pid, cid, checkProvince) {
    var that = this;
    // 存储值
    var _userdata = that.data.userdata;
    var _areadata = _userdata.area;
    // 显示值
    var _showdata = that.data.showdata;
    var _area = _showdata.area;

    var $data = {};
    $data.province = pid;
    $data.city = cid;
    $data.name = checkProvince;
    if (ymtool.AreaWith(_area, cid) < 0){
      // 赋值
      _area.push($data);
      _areadata += cid + ',';
    }
    // 数据 - 追加对象
    _showdata.area = _area;
    // 数据 - 拼接City串
    _userdata.area = _areadata;
    that.setData({
      showdata: _showdata,
      userdata: _userdata,
    });
  },

  /*
  * 服务地区 - 删除
  */
  btnAreaDel:function(event){
    var that = this;
    var $target = event.currentTarget;
    var $id = $target.dataset.id;
    // 存储值
    var _userdata = that.data.userdata;
    var _areadata = _userdata.area;

    // 数据 - 集合
    var _showdata = that.data.showdata;
    var _area = _showdata.area;

    var $index = ymtool.AreaWith(_area, $id);
    if ($index >= 0){
      _area.splice($index, 1); //删除下标为i的元素
      _areadata = _areadata.replace($id+',', '');
    }

    // 数据 - 移除City串
    _userdata.area = _areadata;
    // 数据 - 移除对象
    _showdata.area = _area;
    
    that.setData({
      showdata: _showdata,
      userdata: _userdata,
    });
  },

  // End 服务地区 ###################################################

  // Begin 服务项 ###################################################
  /*
  * 服务项 - 选择
  */
  btnChooseService:function(event){
    wx.navigateTo({
      url: '/pages/myexp/myexp'
    });
  },
  
  /*
  * 服务项 - 更新 ****** 回调函数
  */
  changeService: function (backuserdata, backserviceobj){
    var that = this;
    // data - 存储值
    var _userdata = that.data.userdata;
    // data - 展示值
    var _showdata = that.data.showdata;

    _userdata.service = backuserdata.service;
    _showdata.service = backserviceobj;

    that.setData({
      userdata: _userdata,
      showdata: _showdata,
    });
  },

  /*
  * 扩展项 - 更新 ****** 回调函数
  */
  changExp:function(backuserdata,backshowdata){
    var that = this;
    // data - 存储值
    var _userdata = that.data.userdata;
    // 存储值 - 服务项串
    _userdata.service = backuserdata.service;
    // 存储值 - 培训机构
    _userdata.train = backuserdata.train;
    // 存储值 - 证书Url串
    _userdata.cert_imgs = backuserdata.cert_imgs;

    // data - 显示值
    var _showdata = that.data.showdata;
    // 显示值 - 服务项集
    _showdata.service = backshowdata.service;

    that.setData({
      userdata: _userdata,
      showdata: _showdata,
    });
  },

  /*
  * 服务项 - 删除
  */
  btnServiceDel:function(event){
    var that = this;
    var $target = event.currentTarget;
    var $id = $target.dataset.id;
    // 存储值
    var _userdata = that.data.userdata;
    var _servicedata = _userdata.service;

    // 数据 - 集合
    var _showdata = that.data.showdata;
    var _service = _showdata.service;

    var $index = ymtool.Servicewith(_service, $id);
    if ($index >= 0) {
      _service.splice($index, 1); //删除下标为i的元素
      _servicedata = _servicedata.replace($id + ',', '');
    }
    // 数据 - 移除City串
    _userdata.service = _servicedata;
    // 数据 - 移除对象
    _showdata.service = _service;
  
    that.setData({
      showdata: _showdata,
      userdata: _userdata,
    });
  },

  // End 服务项 ###################################################

  /*
  * 下一步操作
  */
  formSubmit: function () {
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.navigateTo({
      url: '/pages/mydesc/mydesc'
    });
  },
  // End: 事件处理
})