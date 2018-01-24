/**
 * Created by 3241214616 on 2018-1-23.
 */

/*
*   客服登录
 */
function userLogin(client, opts) {
    opts.sqltext = 'select * from kefu_users where username = ? and `password`= ?';
    client.query(opts.sqltext, [opts.username, opts.password], function (err, rows, fields) {
        if (err || rows.length <= 0){
            typeof opts.success === "function" && opts.success({result:false, message:err || '找不到数据'});
            return;
        }
        var row = rows[0] || {};
        if((row.id || 0) <= 0){
            typeof opts.success === "function" && opts.success({result:false, message:err || '找不到数据'});
            return;
        }

        // 修改CookieId
        editCookieId(client, { cookieid: opts.socketid, id: row.id, success: editCookieIdBack});
        // 修改CookieId 回调
        function editCookieIdBack(res) {
            if(res.err || (res.row.affectedRows || 0) <= 0){
                typeof opts.success === "function" && opts.success({result: false, message: res.err || '数据操作失败'});
                return;
            }
            row.cookieid = opts.socketid;
            typeof opts.success === "function" && opts.success({result:true, row:row});
        }
    });
}

/*
*   客服登录 修改CookieId
 */
function editCookieId(client, opts) {
    opts.sqltext = 'update kefu_users set cookieid = ? where id = ?';
    client.query(opts.sqltext, [opts.cookieid, opts.id], function (err, rows, fields) {
        typeof opts.success === "function" && opts.success({err:err, row:rows});
    });
}

/*
*   CookieId 读取信息
 */
function byCookieId(client, opts) {
    opts.sqltext = 'select * from kefu_users where cookieid = ?';
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
    opts.sqltext = 'select * from kefu_users where id = ?';
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


module.exports = {
    // 客服登录
    userLogin: userLogin,
    // CookieId 读取信息
    byCookieId: byCookieId,
    // Id 读取用户信息
    byId: byId,
};