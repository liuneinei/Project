
var util = require('../../utils/util.js')
Page({
  data: {
    coursesdata:{
      id:1,
      title: 'Kentucky lawmakers death stuns Statehouse already beset by sex scandal',
      date:'2012-12-12',
      content: 'The death of a state representative -- who apparently committed suicide Wednesday after being accused of molestation -- sent more shock waves through a Kentucky Statehouse already rocked by other sexual misconduct scandals.',
    }
  },
  onShareAppMessage: function () {
    var that = this;
    var _coursesdata = that.data.coursesdata;
    return {
      title: _coursesdata.title + ' - 课程',
      path: '/pages/newsinfo/newsinfo?id=' + _coursesdata.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onLoad: function (option) {
    option = option || {};
  }
})
