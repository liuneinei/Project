/**
 * Created by 3241214616 on 2018-1-23.
 */

function byUserId(client, opts) {
    opts.sqltext = '';
}

/*
*   保存发送的消息
 */
function saveMessage(client, opts) {
    opts.sqltext = 'INSERT INTO kefu_message VALUES (?,?,?,?,?,?,?,?)';
    client.query(opts.sqltext, opts.param, function (err, rows, fields) {
        typeof opts.success === "function" && opts.success({ err: err, row: rows });
    });
}

/*
*   标识为已读
 */
function editIsRead(client, opts) {
    opts.sqltext = 'update kefu_message set isread = ? where roomid = ?';
    client.query(opts.sqltext, [opts.isread, opts.roomid], function (err, rows, fields) {
        typeof opts.success === "function" && opts.success({ err: err, row: rows });
    });
}

module.exports = {
    // 保存发送的消息
    saveMessage: saveMessage,
    // 标识为已读
    editIsRead: editIsRead,
};