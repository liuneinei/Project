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
    mysql.dataUsers.userLogin({
        socketid: opts.socketid,
        username: opts.username,
        password: opts.password,
        success: function (res) {
            if(!res.result){
                typeof opts.success === "function" && opts.success({result: res.result, message: '用户名或密码错误!'}); return;
            }
            typeof opts.success === "function" && opts.success({result: res.result, row: res.row});
        }
    });
}

module.exports = {
    // 客服登录
    fireUserLogin: fireUserLogin,
};