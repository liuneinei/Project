/*
* 服务地区 - 得到索引
*/
const AreaWith = (_arr, _city) => {
  var length = _arr.length;
  for (var i = 0; i < length; i++) {
    var _obj = _arr[i];
    if (_obj.city == _city) {
      // _arr.splice(i, 1); //删除下标为i的元素
      return i;
    }
  }
  return -1;
}

/*
* 服务项 - 得到索引
*/
const Servicewith = (_arr, _id) => {
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

module.exports = {
  // 服务地区 - 得到索引
  AreaWith,
  // 服务项 - 得到索引
  Servicewith,
}