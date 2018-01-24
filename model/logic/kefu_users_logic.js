/**
 * Created by 3241214616 on 2018-1-24.
 */

// 数据库
var mysql = require('../../core/mysql.js');

/*
*   客服登录
 */
function fireUserLogin(opts) {
    if(!opts.username || !opts.password){
        typeof opts.success === "function" && opts.success({result: false, message: '用户名或密码不能为空!'}); return;
    }
    mysql.dataUsers.userLogin({ socketid: opts.socketid, username: opts.username, password: opts.password,
        success: function (res) {
            if(!res.result){
                typeof opts.success === "function" && opts.success({result: res.result, message: '用户名或密码错误!'}); return;
            }
            typeof opts.success === "function" && opts.success({result: res.result, row: res.row});
        }
    });
}

/*
*   客服在线显示   
 */
function fireUserOnLine(opts) {
    // CookieId 处理 客服是否在线
    mysql.dataUsers.byCookieId({ cookieid: opts.cookieid, success: byCookieIdBack});

    // CookieId 处理 客服是否在线  回调
    function byCookieIdBack(res){
        if (!res.result) {
            typeof opts.success === 'function' && opts.success({ result: res.result, message: '无效标识，请重登录!' }); return;
        }

        // 记录
        opts.row = res.row;

        // 客服所接待的用户
        mysql.dataRoom.byUserIdList({ userid: res.row.id, success: byUserIdListBack });
    }

    // 客服所接待的用户 回调
    function byUserIdListBack(res){
        typeof opts.success === 'function' && opts.success({ result: res.result, row: opts.row, rooms: res.rows }); return;
    }
}

/*
*   Id 读取用户信息   
 */
function fireById(opts) {
    mysql.dataUsers.byId(opts);
}

module.exports = {
    // 客服登录
    fireUserLogin: fireUserLogin,
    // 客服在线显示   
    fireUserOnLine: fireUserOnLine,
    // Id 读取用户信息   
    fireById: fireById,
};