/**
 * Created by 3241214616 on 2018-1-23.
 */

// 自增逻辑处理
var kefutabkeylogic = require('./kefu_tabkey_logic.js');
// 用户逻辑处理
var kefumemberlogic = require('./kefu_member_logic.js');
// 客服逻辑处理
var kefuserslogic = require('./kefu_users_logic.js');
// 房间逻辑处理
var kefroomlogic = require('./kefu_room_logic.js');

module.exports = {
    back_tabkey: {
        // 读取自增Id
        fireTabKey: kefutabkeylogic.fireTabKey,
    },
    back_users: {
        // 客服登录
        fireUserLogin: kefuserslogic.fireUserLogin,
        // 客服在线显示   
        fireUserOnLine: kefuserslogic.fireUserOnLine,
        // Id 读取用户信息   
        fireById: kefuserslogic.fireById,
    },
    back_member: {
        // 用户初始化登录 
        fireMemberLogin: kefumemberlogic.fireMemberLogin,
        // CookieId 读取用户信息
        fireByCookieId: kefumemberlogic.fireByCookieId,
        // Id 读取用户信息
        fireById: kefumemberlogic.fireById,
    },
    back_room: {},
    back_message: {}
};