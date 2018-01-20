/**
 * Created by 3241214616 on 2018-1-18.
 */

var mysql = require('mysql');
var config = require('../config/database.js');

//创建连接
var client = mysql.createConnection({
    host:config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database :config.mysql.database
});

// 开启连接
client.connect();

//关闭连接
//client.end();

/*
*   获取单条记录
*   param：sqltext Sql语句 | param Sql语句参数 | success 执行返回函数
 */
function mysqlQueryOne(opts) {
    client.query(opts.sqltext, opts.param, function(err, rows, fields) {
        if (err || rows.length <= 0){
            rows = [];
        }
        typeof opts.success === 'function' && opts.success(rows[0] || {});
    });
}

/*
*   获取多条记录
*   param：sqltext Sql语句 | param Sql语句参数 | success 执行返回函数
 */
function mysqlQueryList(opts) {
    client.query(opts.sqltext, opts.param, function(err, rows, fields) {
        if (err || rows.length <= 0) {
            rows = [];
        }
        typeof opts.success === "function" && opts.success(rows || []);
    });
}

/*
*   执行 增、删、改
*   param：sqltext Sql语句 | param Sql语句参数 | success 执行返回函数
*/
function mysqlExecute(opts) {
    client.query(opts.sqltext, opts.param, function(err, rows, fields) {
        typeof opts.success === "function" && opts.success({err:err,rows:rows});
    });
}

/*
*   自增Id
*   param：param Sql语句参数 | success 执行返回函数
*/
function mysqlTabKey1(opts) {
    opts.sqltext = 'select * from kefu_tabkey1 where keyName = ?';
    client.query(opts.sqltext, opts.param, function (err, rows, fields) {
        if (err || rows.length <= 0){
            typeof opts.success === "function" && opts.success({result:false, message:err || '操作失败'});
        }
        var obj = rows[0] || {};
        if((obj.id || 0) > 0){
            typeof  opts.success === "function" && opts.success({result:true, value:(obj.value + 1)});
            var $uptabkey = 'update kefu_tabkey1 set value='+ (obj.value + 1) +' where keyName=?';
            client.query($uptabkey, opts.param, function () {});
        }
    });
}

/*
*   消息记录
*   param：roomId 房间Id | markId 标识Id(为 user 的sessionId 或 member 的roomId) | type 类型(0用户发送1客服发送) | content 发送内容 | addTime 添加时间
 */
function mysqlMessageStorage(opts) {
    opts.roomId = opts.roomId || '';
    opts.markId = opts.markId || '';
    opts.type = opts.type || 0;
    opts.content = opts.content || '';
    opts.addTime = opts.addTime || '';
    opts.success = opts.success || function () {};

    // 客服的sessionId
    var backObj = {
        companyRltId: '',
        forId: 0,
        name: '',
        type: opts.type,
        content: opts.content,
        isRead: 0,
        addTime: opts.addTime,
        sessionId : '',
    };

    if(opts.type == 0){  // 用户发送
        mysqlQueryOne({
            sqltext:'select * from kefu_member where roomId = ?', 
            param:[opts.markId],
            success:function (res) {
                backObj.companyRltId = res.companyRltId;
                backObj.forId = res.id;
                backObj.name = res.name;
                backObj.sessionId = res.userSessionId;
                queryBack((res.id || 0),(res.companyRltId || 0));
            }
        });
    }else if(opts.type == 1){  // 客服发送
        mysqlQueryOne({
            sqltext:'select * from kefu_users where sessionId = ?',
            param:[opts.markId],
            success:function (res) {
                backObj.companyRltId = res.companyRltId;
                backObj.forId = res.id;
                backObj.name = res.name;
                backObj.sessionId = res.sessionId;
                queryBack((res.id || 0),(res.companyRltId || 0));
            }
        });
    }else{
        typeof opts.success === "function" && opts.success({result: false, error:'type 无效'});
        return;
    }

    // 查询回调
    function queryBack(forid, companyRltId) {
        if(forid <= 0){
            typeof opts.success === "function" && opts.success({result: false});
            return;
        }
        // 获取自增Id
        mysqlTabKey1({param:['kefu_message'],success:TabKeyBackFun});

        // 获取自增Id - 回调
        function TabKeyBackFun(tabkey) {
            if(!tabkey.result){
                typeof opts.success === "function" && opts.success({result: false});
                return;
            }
            // 添加发送信息
            mysqlExecute({
                sqltext:'INSERT INTO kefu_message VALUES (?,?,?,?,?,?,?,?)',
                param:[tabkey.value, companyRltId, forid, opts.type, opts.roomId, opts.content, 0, opts.addTime],
                success:function (resmessage) {
                    typeof opts.success === "function" && opts.success({result: true, backObj: backObj});
                    return;
                }
            });
        }
    }
}

module.exports = {
    // 获取单条记录
    mysqlQueryOne: mysqlQueryOne,
    // 获取多条记录
    mysqlQueryList: mysqlQueryList,
    // 执行 增、删、改
    mysqlExecute: mysqlExecute,
    // 消息记录
    mysqlMessageStorage: mysqlMessageStorage,
    // 自增Id
    mysqlTabKey1: mysqlTabKey1
};


