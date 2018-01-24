/**
 * Created by 3241214616 on 2018-1-23.
 */

/*
*   CookieId 读取用户信息
 */
function byCookieId(client, opts) {
    //opts.sqltext = 'select * from kefu_member where cookieid = ?';
    // 连表查询得到用户与房间信息
    opts.sqltext = 'select * from kefu_member LEFT JOIN kefu_room on kefu_member.id = kefu_room.member_id where kefu_member.cookieid = ?';
    client.query(opts.sqltext, [opts.cookieid], function (err, rows, fields) {
        if (err || rows.length <= 0){
            typeof opts.success === "function" && opts.success({result:false, message:err || '找不到数据'});
            return;
        }
        var row = rows[0] || {};
        if((row.id || 0) <= 0){
            typeof opts.success === "function" && opts.success({result:false, message:err || '找不到数据'});
            return;
        }
        typeof  opts.success === "function" && opts.success({result:true, row:row});
    });
}

/*
*   Id 读取用户信息
 */
function byId(client, opts) {
    opts.sqltext = 'select * from kefu_member LEFT JOIN kefu_room on kefu_member.id = kefu_room.member_id where kefu_member.id = ?';
    client.query(opts.sqltext, [opts.id], function (err, rows, fields) {
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

/*
*   初始化用户
 */
function initAdd(client, opts) {
    opts.sqltext = 'INSERT INTO kefu_member VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
    client.query(opts.sqltext, opts.param, function(err, rows, fields) {
        typeof opts.success === "function" && opts.success({err:err, row:rows});
    });
}

module.exports = {
    // CookieId 读取用户信息
    byCookieId: byCookieId,
    // Id 读取用户信息
    byId: byId,
    // 初始化用户
    initAdd: initAdd,
};