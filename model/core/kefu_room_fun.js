/**
 * Created by 3241214616 on 2018-1-23.
 */

/*
*   用户Id
 */
function byMemberid(client, opts) {
    opts.sqltext = 'select * from kefu_room where member_id = ?';
    client.query(opts.sqltext, [opts.memberid], function (err, rows, fields) {
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
*   客服Id
 */
function byUserid(client, opts) {
    opts.sqltext = 'select * from kefu_room where user_id = ?';
    client.query(opts.sqltext, [opts.userid], function (err, rows, fields) {
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
*   客服所接待的用户
 */
function byUserIdList(client, opts) {
    opts.sqltext = 'select kefu_room.member_socketid,kefu_member.`name`,kefu_member.img,kefu_member.messagenum,kefu_member.messagetime,kefu_member.`status` from kefu_room LEFT JOIN kefu_member ON kefu_room.member_id = kefu_member.id  where kefu_room.user_id = ?';

    client.query(opts.sqltext, [opts.userid], function (err, rows, fields) {
        if (err || rows.length <= 0) {
            rows = [];
        }
        typeof opts.success === "function" && opts.success({ result: true, rows: rows });
    });
}

/*
* 初始化房间
 */
function initAdd(client, opts) {
    opts.sqltext = 'INSERT INTO kefu_room VALUES (?,?,?,?,?,?,?)';
    console.log(opts);
    client.query(opts.sqltext, opts.param, function (err, rows, fields) {
        typeof opts.success === "function" && opts.success({err:err, row:rows});
    });
}

module.exports = {
    // 根据用户Id
    byMemberid: byMemberid,
    // 初始化房间
    initAdd: initAdd,
    // 客服所接待的用户
    byUserIdList: byUserIdList,
};