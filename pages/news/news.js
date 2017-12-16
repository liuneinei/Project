
var api = require('../../api/api.js');
var configs = require('../configs.js');
var functions = require('../functions.js');

Page({
  data: {
    // 课程
    coursesdata:{
      list: [
        {
          id: 1,
          title: 'DOJ watchdog reveals how ex-Mueller agents anti-Trump texts came to light',
          img: 'http://a57.foxnews.com/hp.foxnews.com/images/2017/12/1024/576/d680001fcc19fbd356eefe7a8fc72fb0.jpg',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        },
        {
          id: 1,
          title: 'Three arrested after Connecticut man is thrown 45 feet off bridge, police say',
          img: 'http://a57.foxnews.com/images.foxnews.com/content/fox-news/us/2017/12/14/three-arrested-after-connecticut-man-is-thrown-45-feet-off-bridge-police-say/_jcr_content/par/featured_image/media-0.img.jpg/931/524/1513234477158.jpg?ve=1&tl=1&text=big-top-image',
          tags: [
            {
              name: '标签1',
            },
            {
              name: '标签2',
            }
          ],
        }
      ],
    },
    // 请求参数
    req: {
      // 当前页码
      page: 1,
      // 显示的总行数，该值由接口返回，默认值为：10，
      maxlen: 10,
      // 是否正在加载，解决多次向上拉加载请求
      loading: false,
      // 是否已加载完
      over: false
    },
    scroll:{
      height:300,
    }
  },
  onLoad: function () {
    var that = this;
    var _sysinfo = wx.getSystemInfoSync();
    var _scroll = that.data.scroll;
    _scroll.height = _sysinfo.windowHeight;
    that.setData({
      scroll: _scroll
    })
    // 课程列表
    getcourse(that, function (res) {
      //回调函数
    });
  },

  // Begin: 事件处理
  /*
  * 滑动底部事件
  */
  scrolltolower: function (event) {
    var that = this;
    var _req = that.data.req;
    if (!_req.loading) {
      // 处理是否为下拉刷新
      _req.loading = true;
      _req.index += 1;  
      that.setData({
        req: _req
      })
      // 课程列表
      getcourse(that, function(res){
        //回调函数
      });
    }
  },

  scroll:function(e){
    console.log('sssssssssss');
  },

  /*
  * 查看详情
  */
  btnCoursesInfo:function(event){
    var that = this;
    var $target = event.currentTarget;
    var $id = $target.dataset.id;

    // 跳转入库页面
    wx.navigateTo({
      url: '/pages/newsinfo/newsinfo?id=' + $id
    });
  },
  // End: 事件处理
})

// Begin : 扩展方法
/*
* 加载列表
*/
function getcourse(that, fb){
  var _req = that.data.req;
  // 获取讲师列表
  api.wxRequest({
    data:{
      provinceid: 0,
      cityid: 0,
      serverid: 0,
      page: _req.page,
    },
    success:function(res){
      console.log(res);
    },
    fail:function(res){
      console.log(res);
    }
  }, api.host + api.iLecturer);
}
// End : 扩展方法
