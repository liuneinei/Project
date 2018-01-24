
// HTML 5 Socket.io 聊天室
var http = require('http');
var express = require('express');
var path = require('path');
var mymd5 = require('./core/md5.js');
// 数据库连接
var mysqlexecute = require('./core/mysql.js');

// 所有逻辑处理
var mysqlkefulogic = require('./model/logic/mysql_kefu_logic');


// 工具类
var kefuarrtool = require('./comm/KefuArrTool.js');
// 客服处理类
var kefuusertool = require('./comm/KefuUserTool.js');
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

// 客服在线 - sessionId
var kefuuser_sessionids = {};
// 用户在线 - roomId
var kefumember_roomids = {};

// 解决分库分表的主键Id自增
var kefutabkey = [];

// 房间信息
var kefu_rooms = {
    // 客服 sessionId
    sessionId: [
		{
		    room: 'room1',	// 用户 roomId
		    member: {},	// 用户对象
		    user: {},	// 客服对象
		    message: [
				{
				    companyRltId: '商户 Id',
				    forid: '主键Id (用户主键 或 客服主键)',
				    name: '名称',
				    type: '类型 0用户发送 1客服发送',
				    content: '发送内容',
				    isRead: '是否已读',
				    addTime: '发送时间'
				}
		    ]
		}
    ]
};

//var nsp = io.of('/yb123');
io.sockets.on('connection', function (socket) {
    // 所有 socket 连接集
    // console.log(io.sockets.server.eio);

    /*
	*	连接时推送
	 */
    socket.emit('init:push', {
        socketid: socket.id
    });

    /*
	*	发送消息触发
	 */
    socket.on('user:pub', function (msg, roomid) {
        var $roomid = roomid || undefined; // 默认为客服发送，当参数 roomid 为空时说明为用户
        if (!$roomid && socket.roomid) {
            $roomid = socket.roomid;
        }
        console.log('Room:' + $roomid);

        if ($roomid) {
            // 给除了自己以外的组里广播消息
            socket.broadcast.to($roomid).emit("user:pub", { name: socket.name, message: msg, roomid: $roomid });

            /***************    以下处理消息入库    ********************/
            var markId = $roomid;// 默认用户发送
            var markType = 0;	// 默认用户类型
            if (socket.sessionid) { // 客服发送
                markId = socket.sessionid;
                markType = 1;
            }
            // 记录消息至数据库中
            mysqlexecute.mysqlMessageStorage({
                roomId: $roomid,
                markId: markId,
                type: markType,
                content: msg,
                addTime: (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
                success: MessageStorage
            });

            /***************    以下处理消息保存    ********************/
            function MessageStorage(resmessage) {
                if (resmessage.result) {
                    var $backObj = resmessage.backObj;
                    // 根据 sessionId 获取信息
                    var sessionArr = kefu_rooms[$backObj.sessionId] || [];
                    if (sessionArr.length > 0) {
                        var roomindex = kefuarrtool.getWith(sessionArr, 'room', $roomid);
                        if (roomindex >= 0) {
                            var roomArr = sessionArr[roomindex].message || [];
                            roomArr.push({
                                companyRltId: $backObj.companyRltId,
                                forid: $backObj.forId,
                                name: $backObj.name,
                                type: $backObj.type,
                                content: $backObj.content,
                                isRead: $backObj.isRead,
                                addTime: $backObj.addTime
                            });
                            console.log('回复消息记录：');
                            console.log(kefu_rooms[$backObj.sessionId][0].message || []);
                        }
                    }
                }
            }
        }

        // 给除了自己以外的客户端广播消息
        //socket.broadcast.emit("user:pub", socket.nickname, msg);
    });

    /*
	*	客服选择对应的用户时，返回对应的聊天消息
	 */
    socket.on('kefu_user_message:to_roomid', function (roomid, fn) {
        var rooms = kefu_rooms[socket.sessionid] || [];
        if (rooms.length <= 0) {
            typeof fn === "function" && fn({ result: false, rows: [] });
            return;
        }
        var roomindex = kefuarrtool.getWith(rooms, 'room', roomid);
        if (roomindex < 0) {
            typeof fn === "function" && fn({ result: false, rows: [] });
            return;
        }
        // 消息集
        var messages = rooms[roomindex].message || [];
        if (messages.length < 0) {
            typeof fn === "function" && fn({ result: false, rows: [] });
            return;
        }
        typeof fn === "function" && fn({ result: true, rows: messages });
    });

    // 这算是双人聊天吗？
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

                // 绑定接待用户
                kefu_rooms[cookieid] = res.rooms;

                // 记录userid
                socket.userid = res.row.id;
                // 记录名称
                socket.name = res.row.name;
                // 客服登录集
                io.sockets.emit('kefu_user:onlines', kefuuseronlines);
                // 接待用户集
                io.sockets.emit(res.row.cookieid, { rooms: res.rooms });

                typeof fn === 'function' && fn({ result: true });
            }
        }
    });

    /*
	*	用户登录初始化
	*/
    socket.on('kefu_member_login:init', function (socketid, cookieid, fn) {

        // 自增Id
        mysqlkefulogic.back_tabkey.fireTabKey({ arr: kefutabkey, tabname: 'keyName', tabvalue: 'kefu_member', success: fireTabKeyBack });

        // 自增Id 回调
        function fireTabKeyBack(res) {
            if (!res.result) {
                // Error back
                typeof fn === 'function' && fn({ result: res.result, message: res.message }); return;
            }

            if (res.index >= 0) {
                kefutabkey.splice(res.index, 1);
            }
            kefutabkey.push(res.row);

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

            var index = kefuarrtool.getWith(kefumemberonlines, 'id', res.row.id);
            if (index >= 0) {
                typeof fn === 'function' && fn({ result: res.result, message: '账号已在其他端登录!' });
            } else {
                // 追加在线用户
                kefumemberonlines.push({
                    id: res.row.id,
                    name: res.row.name,
                    img: res.row.img,
                    socketid: res.row.member_socketid,
                });
            }
            // 记录Id
            socket.memberid = res.row.id;
            // 记录名称
            socket.name = res.row.name;
            // 用户登录集
            io.sockets.emit('kefu_member:onlines', kefumemberonlines);
            // 订阅
            socket.join(socketid);

            // 用户连接客服
            memberroom(res);
        }

        // 用户连接客服
        function memberroom(res) {
            // 返回人数最少的客服
            var userline = kefuusertool.GetLessAdmitNum(kefuuseronlines, 'admitNum');
            // 有客服在线时才处理
            if ((userline.id || 0) > 0 && false) {
                // 绑定客服
                mysqlexecute.mysqlMemberBindUser({ userid: userline.id, sessionid: userline.sessionId, roomid: res.roomId });

                // 更新客服接待人数
                kefuusertool.UpdateAdmitNum(kefuuseronlines, userline.id);
                // 得到当前客服接待的信息
                var rooms = kefu_rooms[userline.sessionId] || [];
                // 检查是否已经包含
                var roomsindex = kefuarrtool.getWith(rooms, 'room', res.roomId);
                if (roomsindex < 0) {
                    // 客服接待更新
                    rooms.push({
                        room: res.roomId,
                        member: {
                            name: res.name,
                            status: res.status
                        },
                        user: {
                            name: userline.name,
                            status: userline.status
                        },
                        message: []
                    });
                }
                kefu_rooms[userline.sessionId] = rooms;

                // 呼叫在线客服加入房间
                io.sockets.emit(userline.sessionId, { roomId: res.roomId, rooms: kefu_rooms[userline.sessionId] });
            }

            typeof fn === 'function' && fn({ result: res.result, cookieid: res.row.cookieid }); return;
        }

    });

    /*
	*	客服回应加入Room
	*/
    socket.on('online:join', function (roomId, fn) {
        socket.join(roomId);
        typeof fn === "function" && fn();
    });

    /*
	*	离线处理
	*/
    socket.on('disconnect', function () {
        // 客服离线处理
        if ((socket.userid || 0) > 0) {
            // 客服对象
            var userobj = {};

            // 验证是否登录
            var index = kefuarrtool.getWith(kefuuseronlines, 'id', socket.userid);
            if (index < 0) {
                return;
            }

            // 读取对象
            userobj = kefuuseronlines[index];

            // 移除对象
            kefuuseronlines.splice(index, 1);

            // 读取接待用户
            var rooms = kefu_rooms[userobj.cookieid];

            if (rooms.length <= 0) {
                return;
            }

            [].forEach.call(rooms, function (item, index) {

                console.log('读取接待用户 2:' + item.member_socketid);
                console.log(item);

                // 返回人数最少的客服
                var userline = kefuusertool.GetLessAdmitNum(kefuuseronlines, 'admitNum');

                console.log('返回人数最少的客服 2:' + item.member_socketid);
                console.log(userline);
                console.log('pp:' + (item.messagenum > 0 && (userline.id || 0) > 0));

                console.log('所有连接 2:');
                console.log(io.sockets.server.eio);
                console.log('所有连接 3:');
                console.log(io.sockets.server.eio.clientsCount);
                console.log(io.sockets.server.eio.clients[userline.socketid]);

                if (item.messagenum > 0 && (userline.id || 0) > 0) {
                    /***************** 转移给其他客服 ****************************/
                    
                }
            });






            //var sessionIndex = kefuarrtool.getWith(kefuuseronlines, 'sessionId', socket.sessionid);
            //if (sessionIndex >= 0) {
            //    // 通过下标移除目标
            //    kefuuseronlines.splice(sessionIndex, 1);
            //    // 客服登录集
            //    socket.emit('kefu_user:onlines', kefuuseronlines);

            //    //......在这里做更多的事
            //    /*********************    客服断线，将用户转接给你在线的客服    ***************************/
            //    // 得到当前该客服接待的用户
            //    var rooms = kefu_rooms[socket.sessionid] || [];
            //    if (rooms.length > 0) {
            //        // 返回人数最少的客服
            //        var userline = kefuusertool.GetLessAdmitNum(kefuuseronlines, 'admitNum');

            //        // 有客服在线时才处理
            //        if ((userline.id || 0) > 0) {
            //            // 得到转移后客服所接待的用户
            //            var migrate_room = kefu_rooms[userline.sessionId] || [];

            //            [].forEach.call(rooms, function (item, index) {
            //                migrate_room.push(item);

            //                // 转用户移到新的客服上
            //                kefu_rooms[userline.sessionId] = migrate_room;

            //                // 呼叫在线客服加入房间
            //                io.sockets.emit(userline.sessionId, { roomId: item.room, rooms: kefu_rooms[userline.sessionId] });

            //                /*console.log('返回用户实例：');
            //				console.log(item);
            //				console.log(userline);*/
            //                // 绑定客服
            //                mysqlexecute.mysqlMemberBindUser({ userid: userline.id, sessionid: userline.sessionId, roomid: item.room });
            //            });
            //            // 原客服清空接待用户
            //            kefu_rooms[socket.sessionid] = [];
            //        }
            //    }
            //}
        }

        // 用户离线处理
        if (socket.roomid) {
            var roomIndex = kefuarrtool.getWith(kefumemberonlines, 'roomId', socket.roomid);
            if (roomIndex >= 0) {
                // 通过下标移除目标
                kefumemberonlines.splice(roomIndex, 1);
                // 用户登录集
                socket.emit('kefu_member:onlines', kefumemberonlines);

                //......在这里做更多的事
            }
        }
    });
});




