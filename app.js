
// HTML 5 Socket.io 聊天室
var http = require('http');
var express = require('express');
var path = require('path');
var mymd5 = require('./core/md5.js');
// 所有逻辑处理
var mysqlkefulogic = require('./model/logic/mysql_kefu_logic');
// 工具类
var kefuarrtool = require('./comm/kefuarrtool.js');
// 客服处理类
var kefuusertool = require('./comm/kefuusertool.js');
// 存储类
var kefustorage = require('./comm/kefustorage.js');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
// app.listen(8087);

var server = http.createServer(app);
server.listen(8087);
var sio = require('socket.io');
var io = sio.listen(server);

// 客服在线
var kefuuseronlines = [];
// 用户在线
var kefumemberonlines = [];

// 房间信息
var kefu_rooms = {};

//var nsp = io.of('/yb123');
io.sockets.on('connection', function (socket) {
    // 所有 socket 连接集
    // console.log(io.sockets.server.eio);

    /*
	*	连接时推送
	*/
    socket.emit('init:push', { socketid: socket.id });

    /*
	*	发送消息触发
	*/
    socket.on('user:pub', function (msg, id, fn) {
        // 注1： param Id 小于 0 或 socket.memberid 且小于 0，则说明参数被窜改
        // 注2： param Id 大于 0 且 socket.userid 小于 0，则说明参数被窜改
        // 注3： param Id 小于 0 且 socket.userid 大于 0，则说明参数被窜改
        if (((id || 0) <= 0 && (socket.memberid || 0) <= 0) ||
            ((id || 0) > 0 && (socket.userid || 0) <= 0) ||
            ((id || 0) < 0 && (socket.userid || 0) > 0)) {
            return;
        }

        // 客服发送消息 : 默认
        var messageType = 1;
        // 1客服 0用户
        var forid = 0;

        if ((id || 0) <= 0) {
            // 用户发给客服
            id = socket.memberid || 0;

            // 用户发送消息
            messageType = 0;
        }

        // 用户在线 - 读取对象 - 并验证处理
        var index = kefuarrtool.getWith(kefumemberonlines, 'id', id);
        if (index < 0) {
            // 读取用户信息
            _funMember();

        } else {
            // 读取用户信息
            var memberonline = kefumemberonlines[index];
            if ((memberonline.id || 0) <= 0) {
                // 读取用户信息
                _funMember();
            } else {
                // 发送 Room 消息
                _funSendMessage(memberonline);
            }
        }

        // 读取用户信息
        function _funMember() {
            // 读取用户信息
            mysqlkefulogic.back_member.fireById({
                id: id,
                success: fireByIdBack
            });
            // 读取用户信息 回调
            function fireByIdBack(res) {
                // 读取用户信息
                var memberonline = res.row;
                // 数据库无信息，停止执行
                if ((memberonline.id || 0) <= 0) return;
                // 发送 Room 消息
                _funSendMessage(memberonline);
            }
        }

        // 发送 Room 消息
        function _funSendMessage(memberonline) {
            // 给除了自己以外的 Room 里广播消息
            socket.broadcast.to(memberonline.socketid).emit("user:pub", { name: socket.name, message: msg, id: id });

            // 自增Id
            mysqlkefulogic.back_tabkey.fireTabKey({ arr: kefustorage.tabkey, tabname: 'keyName', tabvalue: 'kefu_message', success: fireTabKeyBackSend });

            // 自增Id 回调
            function fireTabKeyBackSend(res) {
                // Error back
                if (!res.result) return false;

                // 1客服 0用户
                forid = messageType == 1 ? socket.userid : socket.memberid;

                // Arr保存 - 保存发送的消息
                _funMessageStorage(memberonline);

                // Sql保存 - 保存发送的消息
                _funSaveMessage(res.row.value, memberonline);
            }
        }

        /***************    以下处理消息保存    ********************/

        /*
        *   Arr保存 - 保存发送的消息
        *
        *   注1：函数内使用return false, 表示函数体执行结束；如果使用return;可能会导致Parent 体结束执行；
        *
         */
        function _funMessageStorage(memberonline) {
            // 聊天记录
            var messagearr = kefustorage.messages[memberonline.id] || [];
            // 追加数据
            messagearr.push({
                companyRltId: memberonline.companyrltid,
                forid: forid,
                name: socket.name,
                type: messageType,
                content: msg,
                isRead: 0,
                addTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss")
            });
            // 保存数据
            kefustorage.messages[memberonline.id] = messagearr;
        }

        // Sql保存 - 保存用户发送的消息
        function _funSaveMessage(id, memberonline) {
            // Sql保存 - 保存发送消息
            mysqlkefulogic.back_message.fireSaveMessage({
                message: {
                    id: id,
                    companyrltid: memberonline.companyrltid,
                    roomid: (memberonline.id).toString(),
                    forid: forid,
                    type: messageType,
                    content: msg,
                    isread: 0,
                    addtime: (new Date()).Format("yyyy-MM-dd hh:mm:ss")
                },
                success: fireSaveMessageBack
            });
            // Sql保存 - 保存发送消息 回调
            function fireSaveMessageBack(res) {
                if (!res.result) {
                    return false;
                }
                // 记录未读消息
                mysqlkefulogic.back_member.fireEditMessage({ prime: 'add', messagetime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"), id: memberonline.id });
            }
        }

        // 给除了自己以外的客户端广播消息
        //socket.broadcast.emit("user:pub", socket.nickname, msg);
    });

    /*
	*	客服选择对应的用户时，返回对应的聊天消息
	*/
    socket.on('kefu_user_message:to_roomid', function (id, fn) {
        // 聊天记录
        var messagearr = kefustorage.messages[id] || [];
        if (messagearr.length <= 0) {
            typeof fn === "function" && fn({ result: false, rows: [] }); return;
        }
        typeof fn === "function" && fn({ result: true, rows: messagearr });
        // 消息处理 - 标为已读
        mysqlkefulogic.back_message.fireEditIsRead({ isread: 1, roomid: id });
        // 消息处理 - 用户未读数清空
        mysqlkefulogic.back_member.fireEditMessage({ prime: 'clear', messagetime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"), id: id })
    });

    /*
    *   私聊
    */
    socket.on('user:private', function (msg, to) {
        // if(onlines[to]){
        // 	onlines[to].emit('user:private',socket.nickname,msg,to);
        // }
    });

    /*
	*	客服登录
	* 	param 	nickuser 登录名 | nickpwd 密码 | fn 回调函数
	*/
    socket.on('kefu_user:login', function (socketid, username, password, fn) {
        var index = kefuarrtool.getWith(kefuuseronlines, 'username', username);
        if (index >= 0) {
            typeof fn === 'function' && fn({ result: false, message: '账号已在其他端登录!' }); return;
        }

        // 客服登录
        mysqlkefulogic.back_users.fireUserLogin({ socketid: socketid, username: username, password: mymd5.md5(password), success: fireUserLoginBack });

        // 客服登录 回调
        function fireUserLoginBack(res) {
            if (!res.result) {
                typeof fn === 'function' && fn({ result: res.result, message: res.message }); return;
            }
            typeof fn === 'function' && fn({ result: res.result, cookieid: res.row.cookieid });
        }
    });

    /*
	*	客服登录验证
	*/
    socket.on('kefu_user_login:verification', function (socketid, cookieid, fn) {
        if (cookieid == '') {
            typeof fn === 'function' && fn({ result: false, message: '未验证登录' });
        } else {
            // 客服在线 初始数据
            mysqlkefulogic.back_users.fireUserOnLine({ cookieid: cookieid, success: fireUserOnLineBack });

            // 客服在线 初始数据  回调
            function fireUserOnLineBack(res) {
                if (!res.result) {
                    typeof fn === 'function' && fn({ result: false, message: '未验证登录' });
                }

                // 验证是否已经登录
                var index = kefuarrtool.getWith(kefuuseronlines, 'username', res.row.username);
                if (index >= 0) {
                    typeof fn === 'function' && fn({ result: false, message: '账号已在其他端登录!' }); return;
                }

                // 添加在线客服
                kefuuseronlines.push({ id: res.row.id, username: res.row.username, name: res.row.name, img: res.row.img, cookieid: res.row.cookieid, admitnum: res.row.admitnum, socketid: socketid });

                // 用户房间集
                var memberrooms = rooms_admit_member(res.rooms);

                // 绑定接待用户
                kefu_rooms[cookieid] = memberrooms;

                // 记录cookieid
                socket.cookieid = cookieid;
                // 记录userid
                socket.userid = res.row.id;
                // 记录名称
                socket.name = res.row.name;
                // 客服登录集
                io.sockets.emit('kefu_user:onlines', kefuuseronlines);
                // 接待用户集
                io.sockets.emit('members:' + res.row.cookieid, { type: 'list', rooms: memberrooms });

                typeof fn === 'function' && fn({ result: true });
            }

            /*************************** 客服接待用户 ***********************************/
            function rooms_admit_member(members) {
                if (members.length <= 0) {
                    return [];
                }
                // 遍历
                members.forEach(function (item, index) {
                    if (item.status == 1) {
                        // 读取用户在 io.sockets.rooms 是否有连接 
                        var adroom = io.sockets.adapter.rooms[item.member_socketid] || {};
                        if ((adroom.length || 0) > 0) {
                            console.log('adroom 00000:');
                            console.log(item.member_socketid);
                            // 加入 Room
                            socket.join(item.member_socketid);
                        } else {
                            // 标为离线状态
                            item.status = 0;
                            // 数据库更改状态
                            mysqlkefulogic.back_member.fireEditStatus({ status: item.status, id: item.id })
                        }
                    }
                });
                return members;
            }
        }
    });

    /*
	*	用户登录初始化
	*/
    socket.on('kefu_member_login:init', function (socketid, cookieid, fn) {
        // 自增Id
        mysqlkefulogic.back_tabkey.fireTabKey({ arr: kefustorage.tabkey, tabname: 'keyName', tabvalue: 'kefu_member', success: fireTabKeyBack });
        // 自增Id 回调
        function fireTabKeyBack(res) {
            // Error back
            if (!res.result) {
                typeof fn === 'function' && fn({ result: res.result, message: res.message }); return;
            }
            // 初始化用户 或 登录用户
            mysqlkefulogic.back_member.fireMemberLogin({
                socketid: socketid,
                cookieid: cookieid,
                member: {
                    id: res.row.value,
                    centerid: '',
                    companyrltid: 0,
                    username: 'm' + (Math.random() * 1000000).toFixed(0),
                    password: mymd5.md5('123').toString(),
                    name: '会员' + res.row.value,
                    img: '',
                    cookieid: mymd5.md5(socketid).toString(),
                    messagenum: 0,
                    messagetime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                    status: 1,
                    addtime: (new Date()).Format("yyyy-MM-dd hh:mm:ss")
                },
                success: fireMemberLoginBack
            });
        }

        // 初始化用户 或 登录用户 回调
        function fireMemberLoginBack(res) {
            if (!res.result) {
                // Error back
                typeof fn === 'function' && fn({ result: res.result, message: res.message }); return;
            }
            // 查找用户是否已在线
            var index = kefuarrtool.getWith(kefumemberonlines, 'id', res.row.id);
            if (index >= 0) {
                typeof fn === 'function' && fn({ result: res.result, message: '账号已在其他端登录!' });
            } else {
                // 追加在线用户
                kefumemberonlines.push({
                    id: res.row.id,
                    companyrltid: res.row.companyrltid,
                    name: res.row.name,
                    img: res.row.img,
                    socketid: socketid,
                    userid: res.row.user_id,
                    usercookieid: '',
                });
            }
            // 记录Id
            socket.roomid = socketid;
            // 记录Id
            socket.memberid = res.row.id;
            // 记录名称
            socket.name = res.row.name;
            // 用户登录集
            io.sockets.emit('kefu_member:onlines', kefumemberonlines);
            // 订阅
            socket.join(socketid);

            // 修改用户状态
            mysqlkefulogic.back_member.fireEditStatus({ status: 1, id: res.row.id });

            // 用户连接客服
            memberroom(res);
        }

        // 用户连接客服
        function memberroom(res) {
            // 返回人数最少的客服
            var userline = kefuusertool.GetLessAdmitNum(kefuuseronlines, 'admitNum');

            // 有客服在线时才处理
            if ((userline.id || 0) > 0) {
                // 绑定客服
                mysqlkefulogic.back_room.fireEditUserId({ userid: userline.id, memberid: res.row.id });

                // 更新客服接待人数
                kefuusertool.UpdateAdmitNum(kefuuseronlines, userline.id);
                // 得到当前客服接待的信息
                var rooms = kefu_rooms[userline.cookieid] || [];
                // 检查是否已经包含
                var roomsindex = kefuarrtool.getWith(rooms, 'id', res.row.id);

                // 用户对象
                var roomMember = {};

                if (roomsindex < 0) {
                    // 用户对象赋值
                    roomMember = {
                        member_socketid: res.row.member_socketid,
                        id: res.row.id,
                        name: res.row.name,
                        img: res.row.img,
                        messagenum: res.row.messagenum,
                        messagetime: res.row.messagetime,
                        status: 1,
                    };
                    // 客服接待更新
                    rooms.push(roomMember);
                }

                kefu_rooms[userline.cookieid] = rooms;

                // Socket连接对象
                var eioObj = io.sockets.server.eio;
                // 没有连接对象
                if (eioObj.clientsCount <= 0) return;

                // 呼叫客服加入房间
                io.sockets.emit('room:join:' + userline.cookieid, { membersocketid: socketid });

                if ((roomMember.id || 0) > 0) {
                    // 新接待用户
                    io.sockets.emit('members:' + userline.cookieid, { type: 'new', rooms: roomMember });
                } else {
                    // 用户上线
                    io.sockets.emit('members:' + userline.cookieid, { type: 'on', rooms: res.row });
                }

                // 用户 绑定 客服信息
                var userindex = kefuarrtool.getWith(kefumemberonlines, 'id', res.row.id);
                if (userindex >= 0) {
                    var useritem = kefumemberonlines[userindex];
                    useritem.userid = userline.id;
                    useritem.usercookieid = userline.cookieid;
                }
            }
            typeof fn === 'function' && fn({ result: res.result, cookieid: res.row.cookieid });
        }
    });

    /*
	*	客服回应加入Room
	*/
    socket.on('online:join', function (roomId, fn) {
        //console.log('user:join');

        //console.log('socketid : ' + socket.id);
        //console.log('roomId : ' + roomId);

        //console.log(io.sockets.adapter.rooms[roomId]);

        socket.join(roomId);

        //console.log(io.sockets.adapter.rooms[roomId]);
        typeof fn === "function" && fn();
    });

    /*
	*	离线处理
	*/
    socket.on('disconnect', function () {
        // 客服离线处理
        if ((socket.userid || 0) > 0) {
            // 客服对象
            var oldUser = {};

            // 验证是否登录
            var index = kefuarrtool.getWith(kefuuseronlines, 'id', socket.userid);

            if (index < 0) return;

            // 读取对象
            oldUser = kefuuseronlines[index];

            // 移除对象
            kefuuseronlines.splice(index, 1);

            // 读取接待用户
            var oldRooms = kefu_rooms[oldUser.cookieid];

            if (oldRooms.length <= 0) return;

            /************************* 转移客服接待用户 ***********************/
            for (var i = 0, maxlen = oldRooms.length; i < maxlen; i++) {
                var oldMember = oldRooms[i];
                // 用户ID
                if ((oldMember.id || 0) <= 0) continue;

                // 用户无SocketID
                if (!oldMember.member_socketid) continue;

                // 用户已离线
                if (oldMember.status <= 0) continue;

                // 返回人数最少的客服
                var userline = kefuusertool.GetLessAdmitNum(kefuuseronlines, 'admitNum');

                // 客服ID
                if ((userline.id || 0) <= 0) continue;

                // 呼叫客服加入房间
                io.sockets.emit('room:join:' + userline.cookieid, { membersocketid: oldMember.member_socketid });

                // 代码数据改变
                var newRooms = kefu_rooms[userline.cookieid] || [];
                newRooms.push(oldMember);

                // 将 用户连接 对象改为 对应客服
                mysqlkefulogic.back_room.fireEditUserId({ userid: userline.id, memberid: oldMember.id });

                // 接待用户集
                io.sockets.emit('members:' + userline.cookieid, { type: 'dis', rooms: oldMember });
            }

            // 原客服清空
            kefu_rooms[oldUser.cookieid] = [];
        }

        // 用户离线处理
        if ((socket.memberid || 0) > 0) {
            // 修改用户状态
            mysqlkefulogic.back_member.fireEditStatus({ status: 0, id: socket.memberid });

            /************************* 在线记录删除 ***********************/
            // 用户在线 - 检查是否已经包含
            var mmeberindex = kefuarrtool.getWith(kefumemberonlines, 'id', socket.memberid);
            if (mmeberindex < 0) return;
            // 用户在线 - 读取用户信息
            var onlineMenber = kefumemberonlines[mmeberindex];
            // 用户在线 - 移除在线用户
            kefumemberonlines.splice(mmeberindex, 1);
            // 用户在线 - 用户Id为空
            if ((onlineMenber.userid || 0) <= 0) return;

            // 通知客服 下线
            io.sockets.emit('members:' + onlineMenber.usercookieid, { type: 'off', rooms: onlineMenber });


            /************************* 客服接待用户 ***********************/
            // 客服接待用户 - 获取信息
            var newRooms = kefu_rooms[onlineMenber.usercookieid] || [];
            if (newRooms.length <= 0) return;

            // 客服接待用户 - 用户所在索引
            mmeberindex = kefuarrtool.getWith(newRooms, 'id', socket.memberid);
            if (mmeberindex < 0) return;

            // 客服接待用户 - 用户对象
            onlineMenber = newRooms[mmeberindex];
            if ((onlineMenber.id || 0) <= 0) return;

            // 客服接待用户 - 用户状态 标志为 下线状态
            onlineMenber.status = 0;
        }
    });
});




