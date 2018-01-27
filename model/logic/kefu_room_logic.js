/**
 * Created by 3241214616 on 2018-1-23.
 */

// 数据库
var mysql = require('../../core/mysql.js');

/*
*   修改用户对应的客服
 */
function fireEditUserId(opts) {
    mysql.dataRoom.editUserId({
        userid: opts.userid,
        memberid: opts.memberid,
        success: function (res) {
            if ((res.row.affectedRows || 0) <= 0) {
                typeof opts.success === "function" && opts.success({ result: false, message: '绑定失败' });
                return;
            }
            typeof opts.success === "function" && opts.success({ result: false });
        }
    });
}

/*
*   修改用户对应的SocketId
 */
function fireEditMemberSocketId(opts) {
    mysql.dataRoom.editMemberSocketId({
        socketid: opts.socketid,
        memberid: opts.memberid,
        success: function (res) {
            if ((res.row.affectedRows || 0) <= 0) {
                typeof opts.success === "function" && opts.success({ result: false, message: '修改失败' });
                return;
            }
            typeof opts.success === "function" && opts.success({ result: false });
        }
    });
}

module.exports = {
    // 修改用户对应的客服
    fireEditUserId: fireEditUserId,
    // 修改用户对应的SocketId
    fireEditMemberSocketId: fireEditMemberSocketId,
};
