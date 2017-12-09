
var util = require('../../utils/util.js')
Page({
  data: {
    userdata:{
      area:'',    // 地区集 1,3,5
      service:'', // 服务集 1,5,7
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
    if (AreaWith(_area, cid) < 0){
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
  btnTareaDel:function(event){
    var that = this;
    var $target = event.currentTarget;
    var $city = $target.dataset.id;
    // 存储值
    var _userdata = that.data.userdata;
    var _areadata = _userdata.area;

    // 数据 - 集合
    var _showdata = that.data.showdata;
    var _area = _showdata.area;

    var $index = AreaWith(_area, $city);
    if ($index >= 0){
      _area.splice($index, 1); //删除下标为i的元素
      _areadata = _areadata.replace($city+',', '');
    }
    // 数据 - 移除对象
    _showdata.area = _area;
    // 数据 - 移除City串
    _userdata.area = _areadata;
    that.setData({
      showdata: _showdata,
      userdata: _userdata,
    });
  },

  /*
  * 服务项 - 选择
  */
  btnChooseService:function(event){
    wx.navigateTo({
      url: '/pages/myexp/myexp'
    });
  },

  /*
  * 下一步操作
  */
  formSubmit: function () {
    var that = this;
    var $target = event.currentTarget;
    // 跳转入库页面
    wx.navigateTo({
      url: '/pages/myexp/myexp'
    });
  },
  // End: 事件处理
})

// Begin: 函数处理
/*
* 移除地区对象
*/
function AreaWith(_arr, _city){
  var length = _arr.length;
  for (var i = 0; i < length; i++){
    var _obj = _arr[i];
    if (_obj.city == _city){
      // _arr.splice(i, 1); //删除下标为i的元素
      return i;
    }
  }
  return -1;
}

/*
* 移除服务项对象
*/
function Servicewith(_arr, _id){
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
    var _obj = _arr[i];
    if (_obj.id == _id) {
      //_arr.splice(i, 1); //删除下标为i的元素
      return i;
    }
  }
  return -1;
}
// End: 函数处理