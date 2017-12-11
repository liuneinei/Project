
var util = require('../../utils/util.js');
var api = require('../../api/api.js');
var configs = require('../configs.js');
var functions = require('../functions.js');
var uploadfilefill = require('../uploadfile.fill.js');
var ymtool = require('../ymtool.js');

Page({
  data: {
    userdata:{
      service:'', // 服务项选中id串
      train: '',  // 培训机构
      cert_imgs:'',//证书Url
    },
    showdata:{
      servicelist:[], // 服务项集
      checks:[],   // 选中值
      service: [], // 服务项集 {id：0，name：''}
      cert_imgs:[],// 证书图片集 {url:''}
    },
    albumdata:{
      show:false,   // 是否显示
      index:0,     // 显示索引
    },
    exp:{
      host: '',//域名
    }
  },
  onLoad: function () {
    var that = this;

    // 初始化扩展属性
    InitExp(that);

    if (!configs.userinfo) {
      // 第一步，获取用户信息
      functions.getuser(function (res) {});
    }

    var _showdata = that.data.showdata;
    // 第一步 获取ApiConfig/StoreConfig信息，为后续遍历加载
    functions.getconfig(function (res) {
      _showdata.servicelist = res.services;
      that.setData({
        showdata: _showdata
      })
    });
  },

  // Begin: 事件处理
  /*
  * 服务项 - 选中
  */
  btnServiceCheck:function(event){
    var that = this;
    // 事件 - 当前目标
    var $target = event.currentTarget;

    // data - 存储对象
    var _userdata = that.data.userdata;
    // data - 选中字符串
    var _servicestr = _userdata.service;

    // data - 展示对象
    var _showdata = that.data.showdata;
    // data - 选中集
    var _checksarr = _showdata.checks;
    // data - 选中的对象集
    var _servicearr = _showdata.service;

    // 数据 - 索引
    var $index = $target.dataset.index;
    // 数据 - 主键
    var $id = $target.dataset.id;
    // 数据 - 标题
    var $name = event.target.dataset.name;
    for (var i = 0; i <= $index; i++){
      if (i == $index){
        // 未选中时
        if (_checksarr[i] == null || _checksarr[i] < 0){
          // 选中对象
          _checksarr[i] = $index;
          // 选中串
          _servicestr += $id + ',';
          var $data = {
            id: $id,
            name:$name
          }
          // 选中集
          _servicearr.push($data);
        }else{
          _checksarr[i] = -1;
          _servicestr = _servicestr.replace($id + ',' , '');
          var $serviceindex = ymtool.Servicewith(_servicearr, $id);
          if ($serviceindex >= 0){
            _servicearr.splice($serviceindex, 1);// 移除下标
          }
        }
      }else{
        if (_checksarr[i] == null){
          _checksarr[i] = -1;
        }
      }
    }

    // ## - 赋值
    // data - 选中串
    _userdata.service = _servicestr;

    // data - 选中集
    _showdata.checks = _checksarr;
    // data - 选中的对象集
    _showdata.service = _servicearr;

    that.setData({
      userdata: _userdata,
      showdata: _showdata,
    });
  },

  /*
  * 上传证书图片
  */
  btnCertImg:function(event){
    var that = this;

    // data - 对象
    var _userdata = that.data.userdata;
    var _showdata = that.data.showdata;
    // 可上传图片的数量
    var $_count = 9 - _showdata.cert_imgs.length ;

    // 选择文件 ，最多为 9张
    uploadfilefill.chooseFile($_count, function(res){
      function up(i){
        if (i < res.length){
          var filePath = res[i];

          var openid = configs.userinfo.openId;
          var _times = Math.random().toString().replace('.', '');
          var filename = 'cert/' + openid + '/' + _times + '.jpg';
          // 获取上传图片所需的token
          uploadfilefill.getuptoken(filename, function(res){
            var uploadtoken = res.uploadtoken;

            // 图片上传回调
            uploadfilefill.uploadFile(filePath, filename, uploadtoken,function(res){
              // data - 赋值
              _userdata.cert_imgs += res.key;
              _showdata.cert_imgs.push({ url: res.key });

              that.setData({
                userdata: _userdata,
                showdata: _showdata
              });
              i = i + 1;
              up(i);
            });
          });
        }
      }
      up(0);
    });
  },

  /*
  * 查看相册
  */
  btnShowAlbum:function(event){
    var that = this;
    var $target = event.currentTarget;
    // 当前索引
    var $index = $target.dataset.index;

    var _albumdata = that.data.albumdata;
    _albumdata.show = true;
    _albumdata.index = $index;

    that.setData({
      albumdata: _albumdata
    });
  },

  /*
  * 隐藏相册
  */
  btnHideAlbum: function (event){
    var that = this;
    var _albumdata = that.data.albumdata;
    _albumdata.show = false;
    _albumdata.index = 0;

    that.setData({
      albumdata: _albumdata,
    });
  },

  /*
  * 相册滑动事件
  */
  albumChange: function (event) {
    var that = this;
    var _albumdata = that.data.albumdata;
    _albumdata.index = event.detail.current;
    that.setData({
      albumdata: _albumdata
    });
  },

  /*
  * 相册删除事件
  */
  btnAlbumDel:function(event){
    var that = this;
    wx.showActionSheet({
      itemList: ['确认删除'],
      itemColor: "#000000",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            var $index = that.data.albumdata.index;

            // 存储值
            var _userdata = that.data.userdata;
            // 显示值
            var _showdata = that.data.showdata;
            // 相册值
            var _albumdata = that.data.albumdata;

            // 当前对象
            var _showObj = _showdata.cert_imgs[$index];
            // 移除证书串
            _userdata.cert_imgs = _userdata.cert_imgs.replace(_showObj.url + ',','');
            // 移动数组
            _showdata.cert_imgs.splice($index, 1);// 移除下标

            // 相册重置索引
            if (_albumdata.index > 0){
              _albumdata.index -= 1;
            }

            that.setData({
              userdata: _userdata,
              showdata: _showdata,
              albumdata: _albumdata,
            });
          }
        }
      }
    })
  },

  /*
  * 下一步操作
  */
  formSubmit: function (event) {
    var that = this;
    // 培训机构
    var $train = event.detail.value.train;

    var pages = getCurrentPages();
    if (pages.length > 1) {
      // 回调存储值
      var _userdata = that.data.userdata;
      var _showdata = that.data.showdata;
      // 赋值 - 培训机构
      _userdata.train = $train;

      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //关键在这里
      prePage.changExp(_userdata, _showdata);

      // 操作 - 缓存当前显示对象
      wx.setStorageSync('$expshowdata', _showdata);
    }
    wx.navigateBack({
      delta: 1
    });
  },
  // End: 事件处理
})

// Begin : 扩展方法
function InitExp(that) {
  var _exp = that.data.exp;

  // 域名赋值
  if (_exp.host.indexOf('http://') < 0) {
    _exp.host = api.iQiniu;
  }

  // 重新赋值
  that.setData({
    exp: _exp
  });
}
// End : 扩展方法