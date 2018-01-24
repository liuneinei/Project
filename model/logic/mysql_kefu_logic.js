/**
 * Created by 3241214616 on 2018-1-23.
 */

// 自增逻辑处理
var kefutabkeylogic = require('./kefu_tabkey_logic.js');
// 用户逻辑处理
var kefumemberlogic = require('./kefu_member_logic.js');
// 客服逻辑处理
var kefuserslogic = require('./kefu_users_logic.js');

module.exports = {
    back_tabkey: {
        fireTabKey: kefutabkeylogic.fireTabKey,
    },
    back_users: {
        // 客服登录
        fireUserLogin: kefuserslogic.fireUserLogin,
        // 客服在线显示   
        fireUserOnLine: kefuserslogic.fireUserOnLine,
    },
    back_member: {
        fireMemberLogin: kefumemberlogic.fireMemberLogin,
    },
    back_room: {},
    back_message: {}
};