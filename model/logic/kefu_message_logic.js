/**
 * Created by 3241214616 on 2018-1-25.
 */

// 数据库
var mysql = require('../../core/mysql.js');

// 保存发送的消息
function fireSaveMessage(opts) {
    mysql.dataMessage.saveMessage({
        param:[opts.message.id, opts.message.companyrltid, opts.message.roomid, opts.message.forid, opts.message.type, opts.message.content, opts.message.isread, opts.message.addtime],
        success:function (res) {
            typeof opts.success == "function" && opts.success(res);
        }
    });
}

module.exports = {
    // 保存发送的消息
    fireSaveMessage: fireSaveMessage,
};