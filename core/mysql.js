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
    database: config.mysql.database
});
// 开启连接
client.connect();
//关闭连接
//client.end();

/*
*   自增表
 */
var kefu_Tabkey_fun = {
    /*
     *   通过KeyName 获取对象
     *   param client 数据库连接对象 | opts.param ['KeyName'] | opts.success 回调函数
     *   return 对象
     */
    byKeyName: function (opts) {
        return tabkeyfun.byKeyName(client, opts);
    },
    /*
     *   修改Value值
     *   param client 数据库连接对象 | opts.param [5,'KeyName']
     *   不回调
     */
    editValue: function (opts) {
        return tabkeyfun.editValue(client, opts);
    },
    // 集中处理
    editValueOrange:function (opts) {
      return tabkeyfun.editValueOrange(client, opts);
    },
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
    // 修改未读信息
    editMessage: function (opts) {
      return memberfun.editMessage(client, opts);
    },
    // 通过中心Id
    byCenterId: function (opts) {
        return memberfun.byCenterId(client, opts);
    }
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
    saveMessage: function (opts) {
        return messagefun.saveMessage(client, opts);
    },
    // 标识为已读
    editIsRead: function (opts) {
        return messagefun.editIsRead(client, opts);
    },
};

module.exports = {
    /************* TabKey 自增表  *********************/
    dataTabkey: {
        //通过KeyName 获取对象
        byKeyName: kefu_Tabkey_fun.byKeyName,
        // 修改Value值
        editValue: kefu_Tabkey_fun.editValue,
        // 集中处理
        editValueOrange:kefu_Tabkey_fun.editValueOrange,
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
        // 修改未读信息
        editMessage: kefu_Member_fun.editMessage,
        // 通过中心Id
        byCenterId: kefu_Member_fun.byCenterId,
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
    dataMessage: {
        // 保存发送的消息
        saveMessage: kefu_Message_fun.saveMessage,
        // 标识为已读
        editIsRead: kefu_Message_fun.editIsRead,
    },
};


