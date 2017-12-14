
var util = require('../../utils/util.js')
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
        }
      ]
    },
  },
  onLoad: function () {
    
  },

  // Begin: 事件处理
  btnNewsInfo:function(event){
    var that = this;
    var $target = event.currentTarget;
    var $id = $target.dataset.id;
  },
  // End: 事件处理
})
