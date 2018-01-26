/**
 * Created by 3241214616 on 2018-1-25.
 */

// 数据库
var mysql = require('../../core/mysql.js');

// 保存发送的消息
function fireSaveMessage(opts) {
    opts.message.id += 1;
    mysql.dataMessage.saveMessage({
        param: [opts.message.id, opts.message.companyrltid, opts.message.roomid, opts.message.forid, opts.message.type, opts.message.content, opts.message.isread, opts.message.addtime],
        success: function (res) {
            if ((res.row.affectedRows || 0) <= 0) {
                typeof opts.success == "function" && opts.success({result:false, message:'保存消息失败'});return;
            }
            typeof opts.success == "function" && opts.success({result:true});

            // 修改 kefu_tabkey1 表 字段 Value 值
            mysql.dataTabkey.editValueOrange({ tabvalue: 'kefu_message', value:opts.message.id, success:function () {} });
        }
    });
}
// 标识为已读
function fireEditIsRead(opts) {
    mysql.dataMessage.editIsRead(opts);
}

module.exports = {
    // 保存发送的消息
    fireSaveMessage: fireSaveMessage,
    // 标识为已读
    fireEditIsRead: fireEditIsRead,
};