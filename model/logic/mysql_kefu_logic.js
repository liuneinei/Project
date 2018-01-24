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
        fireUserLogin : kefuserslogic.fireUserLogin,
    },
    back_member: {
        fireMemberLogin: kefumemberlogic.fireMemberLogin,
    },
    back_room: {},
    back_message: {}
};