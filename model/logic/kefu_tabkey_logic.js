/**
 * Created by 3241214616 on 2018-1-23.
 */

// 工具类
var kefuarrtool = require('../../comm/kefuarrtool.js');
// 存储类
var kefustorage = require('../../comm/kefustorage.js');

// 数据库
var mysql = require('../../core/mysql.js');

/*
* 读取自增Id
* opts.arr = [];        // Tabkey 集合
* opts.tabname = '';    // 列名KeyName
* opts.tabvalue = '';   // 列名KeyName 值
* opts.success = function () {};
 */
function fireTabKey(opts) {
    // 查找索引
    var keyindex = kefuarrtool.getIndex(opts.arr, opts.tabname, opts.tabvalue);
    // 初始化对象
    var keyItem = {};
    if (keyindex >= 0) { // 存在
        // TabKey 对象
        keyItem = opts.arr[keyindex];
        backfun();
    } else {
        mysql.dataTabkey.byKeyName({
            param: [opts.tabvalue], success: function (res) {
                if (res.result) {
                    keyItem = res.row;
                }
                kefustorage.tabkey.push(keyItem);
                backfun();
            }
        });
    }
    // 回调
    function backfun() {
        if ((keyItem.id || 0) <= 0) {
            typeof opts.success === "function" && opts.success({ result: false, message: '连接失败' });
        } else {
            typeof opts.success === "function" && opts.success({ result: true, row: keyItem, index: keyindex });

            // 修改 opts.tabvalue Value 值
            //mysql.dataTabkey.editValue({ param: [keyItem.value, opts.tabvalue] });
        }
    }
}

module.exports = {
    // 读取自增Id
    fireTabKey: fireTabKey,
};