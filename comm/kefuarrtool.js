/**
 * Created by 3241214616 on 2018-1-18.
 */

// 公共处理
var kefucommon = require('../public/js/kefucommon.js');

/*
* 获取信息当前的 Id 所在的索引
 */
function getIndex(arr, field, id) {
    var length = arr.length;
    for (var i = 0; i < length; i++){
        var obj = arr[i];
        if(obj[field] == id){
            return i;
        }
    }
    return -1;
}

/*
 * 获取信息当前的 Id 所在的对象
 */
function getWiths(arr, field, id) {
    var length = arr.length;
    for (var i = 0; i < length; i++){
        var obj = arr[i];
        if(obj[field] == id){
            return obj;
        }
    }
    return {};
}

/*
 *   从小到大排序
 *   return 集合
 */
function getSort(arr, field) {
    if(arr.length <= 0){
        return [];
    }
    arr.sort(function (a, b) {
        return a[field] - b[field];
    });
    return arr;
}

/*
 *   从大到小排序
 *   return 集合
 */
function getSortDesc(arr, field) {
    if (arr.length <= 0) {
        return [];
    }
    arr.sort(function (a, b) {
        return b[field] - a[field];
    });
    return arr;
}

module.exports={
    // 获取信息当前的 Id 所在的索引
    getIndex: getIndex,
    // 获取信息当前的 Id 所在的对象
    getWiths: getWiths,
    // 从小到大排序
    getSort: getSort,
};