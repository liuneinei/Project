/**
 * Created by 3241214616 on 2018-1-19.
 */

var KefuArrTool = require('./kefuarrtools.js');

/*
*   从小到大 排序
*   return 返回某信息最小的对象
*/
function GetLessAdmitNum(arr, field) {
    if(arr.length <= 0){
        return {};
    }
    arr = KefuArrTool.getSort(arr, field);
    return arr[0] || {};
}

/*
*   更新接待人数
 */
function UpdateAdmitNum(arr, id) {
    if(arr.length > 0){
        for(var i = 0; i < arr.length; i++){
            var obj = arr[i];
            if(obj.id == id){
                obj.admitNum += 1;
            }
        }
    }
}

module.exports = {
    // 获取当前接待人数较少的在线客服
    GetLessAdmitNum:GetLessAdmitNum,
    // 更新接待人数
    UpdateAdmitNum: UpdateAdmitNum
};