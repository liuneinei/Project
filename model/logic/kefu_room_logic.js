/**
 * Created by 3241214616 on 2018-1-23.
 */

// 数据库
var mysql = require('../../core/mysql.js');

/*
*   修改用户对应的客服
 */
function fireEditUserId(opts) {
    mysql.dataRoom.editUserId(opts);
}

/*
*   修改用户对应的SocketId
 */
function fireEditMemberSocketId(opts) {
    mysql.dataRoom.editMemberSocketId(opts);
}

module.exports = {
    // 修改用户对应的客服
    fireEditUserId: fireEditUserId,
    // 修改用户对应的SocketId
    fireEditMemberSocketId: fireEditMemberSocketId,
};
