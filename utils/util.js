function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

Array.prototype.remove=function(dx){
  if(isNaN(dx) || dx> this.length){return false};
  var n = 0;
  [].forEach.call(this, function (item, i, arr) {
    if (arr[i] != arr[dx]){
      this[n++] = this[i]
    }
  });
}

module.exports = {
  formatTime: formatTime
}
