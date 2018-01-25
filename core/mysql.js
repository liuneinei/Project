/**
 * Created by 3241214616 on 2018-1-18.
 */

var mysql = require('mysql');
var config = require('../config/database.js');

// 自增表
var tabkeyfun = require('../model/core/kefu_tabkey_fun.js');
// 用户表
var memberfun = require('../model/core/kefu_member_fun.js');
// 房间表
var roomfun = require('../model/core/kefu_room_fun.js');
// 客服表
var usersfun = require('../model/core/kefu_users_fun.js');
// 消息表
var messagefun = require('../model/core/kefu_message_fun.js');

//创建连接
var client = mysql.createConnection({
    host: config.mysql.host,
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

/*
* 用户绑定客服
* param：userid 客服Id | sessionid 客服标识 | roomid 用户标识
 */
function mysqlMemberBindUser(opts) {
    /*opts.userid = opts.userid || 0;
    opts.sessionid = opts.sessionid || '';
    opts.roomid = opts.roomid || '';*/
    if(opts.userid <= 0 || opts.sessionid == '' || opts.roomid == ''){
        return;
    }
    mysqlExecute({
        sqltext: 'update kefu_member set userId = ? , userSessionId = ? where roomId = ?',
        param: [opts.userid, opts.sessionid, opts.roomid],
        success:function (res) {
        }
    });
}

/*
*   自增表
 */
var kefu_Tabkey_fun = {
    /*
     *   通过KeyName 获取对象
     *   param client 数据库连接对象 | opts.param ['KeyName'] | opts.success 回调函数
     *   return 对象
     */
    byKeyName:function (opts) {
        return tabkeyfun.byKeyName(client, opts);
    },
    /*
     *   修改Value值
     *   param client 数据库连接对象 | opts.param [5,'KeyName']
     *   不回调
     */
    editValue:function (opts) {
        return tabkeyfun.editValue(client, opts);
    }
};

/*
*   用户表
 */
var kefu_Member_fun = {
    // CookieId 读取用户信息
    byCookieId: function (opts) {
        return memberfun.byCookieId(client, opts);
    },
    // Id 读取用户信息
    byId: function (opts) {
        return memberfun.byId(client, opts);
    },
    // 初始化用户
    initAdd: function (opts) {
        return memberfun.initAdd(client, opts);
    },
    // 状态修改处理
    editStatus: function (opts) {
        return memberfun.editStatus(client, opts);
    },
};

/*
*   房间表
 */
var kefu_Room_fun = {
    // 根据用户Id
    byMemberid: function (opts) {
        return roomfun.byMemberid(client, opts);
    },
    // 初始化房间
    initAdd: function (opts) {
        return roomfun.initAdd(client, opts);
    },
    // 客服所接待的用户
    byUserIdList: function (opts) {
        return roomfun.byUserIdList(client, opts);
    },
    // 修改用户对应的客服
    editUserId: function (opts) {
        return roomfun.editUserId(client, opts);
    },
    // 修改用户对应的SocketId
    editMemberSocketId: function (opts) {
        return roomfun.editMemberSocketId(client, opts);
    },
};

/*
 *   客服表
 */
var kefu_User_fun = {
    // 客服登录
    userLogin: function (opts) {
        return usersfun.userLogin(client, opts);
    },
    // CookieId 读取信息
    byCookieId: function (opts) {
        return usersfun.byCookieId(client, opts);
    },
    // Id 读取用户信息
    byId: function (opts) {
        return usersfun.byId(client, opts);
    },
};

/*
 *   消息表
 */
var kefu_Message_fun = {
    // 保存发送的消息
    saveMessage:function (opts) {
        return messagefun.saveMessage(client, opts);
    },
};

module.exports = {
    /************* TabKey 自增表  *********************/
    dataTabkey:{
        //通过KeyName 获取对象
        byKeyName: kefu_Tabkey_fun.byKeyName,
        // 修改Value值
        editValue: kefu_Tabkey_fun.editValue,
    },
    /************** Member 用户表  ********************/
    dataMember: {
        // CookieId 读取用户信息
        byCookieId: kefu_Member_fun.byCookieId,
        // Id 读取用户信息
        byId: kefu_Member_fun.byId,
        // 初始化用户
        initAdd: kefu_Member_fun.initAdd,
        // 状态修改处理
        editStatus: kefu_Member_fun.editStatus,
    },
    /************** Room 房间表  ********************/
    dataRoom: {
        // 根据用户Id
        byMemberid: kefu_Room_fun.byMemberid,
        // 初始化房间
        initAdd: kefu_Room_fun.initAdd,
        // 客服所接待的用户
        byUserIdList: kefu_Room_fun.byUserIdList,
        // 修改用户对应的客服
        editUserId: kefu_Room_fun.editUserId,
        // 修改用户对应的SocketId
        editMemberSocketId: kefu_Room_fun.editMemberSocketId,
    },
    /*************** Users 客服表  *******************/
    dataUsers: {
        // 客服登录
        userLogin: kefu_User_fun.userLogin,
        // CookieId 获取信息
        byCookieId: kefu_User_fun.byCookieId,
        // Id 读取用户信息
        byId: kefu_User_fun.byId,
    },
    /*************** Message 消息表  *******************/
    dataMessage:{
        // 保存发送的消息
        saveMessage:kefu_Message_fun.saveMessage,
    },

    // 获取单条记录
    mysqlQueryOne: mysqlQueryOne,
    // 获取多条记录
    mysqlQueryList: mysqlQueryList,
    // 执行 增、删、改
    mysqlExecute: mysqlExecute,
    // 消息记录
    mysqlMessageStorage: mysqlMessageStorage,
    // 用户绑定客服
    mysqlMemberBindUser: mysqlMemberBindUser,
    // 自增Id
    mysqlTabKey1: mysqlTabKey1
};


