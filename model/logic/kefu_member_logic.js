/**
 * Created by 3241214616 on 2018-1-23.
 */

// 数据库
var mysql = require('../../core/mysql.js');

/*
*   用户登录
*   opts.socketid = opts.socketid || '';
    opts.cookieid = opts.cookieid || '';
    opts.member = opts.member || {};
    opts.success = opts.success || function () {};
 */
function fireMemberLogin(opts) {
    if (opts.cookieid == '' && opts.socketid == '') {
        typeof opts.success === "function" && opts.success({result: false, message: '请求非法'}); return;
    } else if (opts.socketid == '') {
        typeof opts.success === "function" && opts.success({result: false, message: '链接失败'}); return;
    } else if (opts.cookieid == '') {
        // 用户初始化
        mysql.dataMember.initAdd({
            param: [opts.member.id, opts.member.centerid, opts.member.companyrltid, opts.member.username, opts.member.password, opts.member.name, opts.member.img, opts.member.cookieid, opts.member.messagenum, opts.member.messagetime, opts.member.status, opts.member.addtime],
            success: initAddMemberBack
        });
        // 用户初始化 回调
        function initAddMemberBack(rowdata) {
            if ((rowdata.row.affectedRows || 0) <= 0) {
                typeof opts.success === "function" && opts.success({result: false, message: '用户初始化失败'});
                return;
            }
            opts.cookieid = opts.member.cookieid;

            // 初始化房间
            mysql.dataRoom.initAdd({
                param: [opts.member.id, opts.member.companyrltid, opts.member.id, opts.socketid, 0, '', ''],
                success: initAddRoomBack
            });
        }

        // 初始化房间 回调
        function initAddRoomBack(rowdata) {
            if ((rowdata.row.affectedRows || 0) <= 0) {
                typeof opts.success === "function" && opts.success({result: false, message: '房间初始化失败'});
                return;
            }
            fireMemberLogin(opts);
        }
    } else {
        console.log('fireMemberLogin 3:');
        console.log(opts.cookieid);

        mysql.dataMember.byCookieId({
            cookieid: opts.cookieid, success: function (rowdata) {
                typeof opts.success === "function" && opts.success(rowdata);
            }
        });
    }
}

module.exports = {
    fireMemberLogin:fireMemberLogin,
};