
var util = require('../../utils/util.js');
var ymtool = require('../ymtool.js');

Page({
  data: {
    userdata: {
      area: '',    // 地区集 1,3,5
    },
    showdata: {
      area: [],     // 地区集合 {province:0,city:1,name:''}
    },
  },
  onLoad: function () {

  },

  // Begin: 事件处理
  /*
  * 下一步操作
  */
  formSubmit: function () {
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.redirectTo({
      url: '/pages/myservice/myservice'
    })
  },

  // Begin 服务地区 ###################################################
  // Begin: 事件处理
  /*
  * 服务地区 - 选择
  */
  btnChooseCity: function () {
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
    if (ymtool.AreaWith(_area, cid) < 0) {
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
  btnAreaDel: function (event) {
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
    if ($index >= 0) {
      _area.splice($index, 1); //删除下标为i的元素
      _areadata = _areadata.replace($id + ',', '');
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

  // End: 事件处理
})
