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

module.exports = {
    // 保存发送的消息
    saveMessage: saveMessage,
}