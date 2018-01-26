/**
 * Created by 3241214616 on 2018-1-18.
 */

/*
* 获取信息当前的 Id 所在的索引
 */
function getWith(arr, field, id) {
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

/*----*/
//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz
    try {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        fmt = fmt || "yyyy-MM-dd";
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    } catch (e) {

    }
};

module.exports={
    // 获取信息当前的 Id 所在的索引
    getWith: getWith,
    // 获取信息当前的 Id 所在的对象
    getWiths: getWiths,
    // 从小到大排序
    getSort: getSort
};