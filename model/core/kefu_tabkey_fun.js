/**
 * Created by 3241214616 on 2018-1-23.
 */

// 工具类
var kefuarrtool = require('../../comm/kefuarrtool.js');
// 存储类
var kefustorage = require('../../comm/kefustorage.js');

/*
*   修改Value值
*   param client 数据库连接对象 | opts.param [5,'KeyName']
*   不回调
 */
function editValue(client, opts) {
    var $uptabkey = 'update kefu_tabkey1 set value = ? where keyName = ?';
    client.query($uptabkey, opts.param, function () { });
}

/*
*   集中处理
 */
function editValueOrange(client, opts) {
    // 查找索引
    var keyindex = kefuarrtool.getIndex(kefustorage.tabkey, 'keyName', opts.tabvalue);
    if(keyindex < 0){
        typeof opts.success === "function" && opts.success({result:false,message:'无效数据'});return;
    }
    // 单个对象
    var kefutab = kefustorage.tabkey[keyindex];
    kefutab.value = opts.value;

    // 修改 kefu_tabkey1 表 字段 Value 值
    editValue(client, { param: [opts.value, opts.tabvalue] });

    typeof opts.success === "function" && opts.success({result:true})
}

/*
*   通过KeyName 获取对象
*   param client 数据库连接对象 | opts.param ['KeyName'] | opts.success 回调函数
*   return 对象
 */
function byKeyName(client, opts) {
    opts.sqltext = 'select * from kefu_tabkey1 where keyName = ?';
    client.query(opts.sqltext, opts.param, function (err, rows, fields) {
        if (err || rows.length <= 0) {
            typeof opts.success === "function" && opts.success({ result: false, message: err || '找不到数据' });
            return;
        }
        var row = rows[0] || {};
        if ((row.id || 0) <= 0) {
            typeof opts.success === "function" && opts.success({ result: false, message: err || '找不到数据' });
            return;
        }
        typeof opts.success === "function" && opts.success({ result: true, row: row });
    });
}

module.exports = {
    // 修改Value值
    editValue: editValue,
    // 通过KeyName 获取对象
    byKeyName: byKeyName,
    // 集中处理
    editValueOrange: editValueOrange,
};