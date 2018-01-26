/**
 * Created by 3241214616 on 2018-1-23.
 */

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

};