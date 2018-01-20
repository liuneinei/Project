// **********与节点的http服务器使用
// var app = require('http').createServer(handler),
// 	io = require('socket.io').listen(app),
// 	fs = require('fs');

// app.listen(3000);

// function handler(req,res){
// 	// index.html 包含我们的客户端代码
// 	fs.readFile(__dirname+'/index.html',function(err,data){
// 		if(err){
// 			res.writeHead(500);
// 			return res.end('Error loading index.html');
// 		}
// 		res.writeHead(200);
// 		res.end(data);
// 	});
// }

// // 利用http模块创建一个服务器实例app,并监听80端口
// // var app = http.createServer(handler);
// // app.listen(80);
// io.sockets.on('connection',function(socket){
// 	socket.emit('news',{hello:'world'});
// 	socket.on('my other event',function(data){
// 		console.log(data);
// 	});
// });

// ***************与快递3/4使用
// var app = require('express')();
// var server = require('http').createServer(app);
// var io = require('socket.io')(server);

// server.listen(3000);
// app.get('/',function(req,res){
// 	res.sendfile(__dirname+'/index.html');
// });

// io.on('connection',function(socket){
// 	socket.emit('news',{hello:'world'});
// 	socket.on('my other event',function(data){
// 		console.log(data);
// 	});
// });

// ****************与快递2.X使用.  这里使用是express版本是4.15.3 ；由于express 4 与 2 的区别有大幅度变化；这里不能使用
// var app = require('express').createServer();
// var io = require('socket.io')(app);

// app.listen(3000);

// app.get('/',function(req,res){
// 	res.sendfile(__dirname+'/index.html');
// });
// io.on('connection',function(socket){
// 	socket.emit('news',{hello:'world'});
// 	socket.on('my other event',function(data){
// 		console.log(data);
// 	});
// });

// HTML 5 Socket.io 聊天室
var http = require('http');
var express = require('express');
var path = require('path');
var mymd5 = require('./core/md5.js');
// 数据库连接
var mysqlexecute = require('./core/mysql.js');
// 工具类
var kefuarrtool = require('./comm/KefuArrTool.js');
// 客服处理类
var kefuusertool = require('./comm/KefuUserTool.js');
var app = express();

app.use(express.static(path.join(__dirname,'public')));
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

// 房间信息
var kefu_rooms = {};

//var nsp = io.of('/yb123');
io.sockets.on('connection',function(socket){
	// 所有 socket 连接集
	// console.log(io.sockets.server.eio);

	/*
	*	连接时推送
	 */
	socket.emit('init:push',{
		hello:'hollo world.'
	});

	/*
	*	发送消息触发
	 */
	socket.on('user:pub', function(msg, roomid){
		var $roomid = roomid || undefined; // 默认为客服发送，当参数 roomid 为空时说明为用户
		if(!$roomid && socket.roomid){
			$roomid = socket.roomid;
		}
		console.log('Room:' + $roomid);

		if($roomid){
			// 给除了自己以外的组里广播消息
			socket.broadcast.to($roomid).emit("user:pub", {name:socket.name, message:msg, roomid: $roomid});

			/***************    以下处理消息入库    ********************/
			var markId = $roomid;// 默认用户发送
			var markType = 0;	// 默认用户类型
			if (socket.sessionid){ // 客服发送
				markId = socket.sessionid;
				markType = 1;
			}
			// 记录消息至数据库中
			mysqlexecute.mysqlMessageStorage({
				roomId : $roomid,
				markId : markId,
				type : markType,
				content : msg,
				addTime : (new Date()).Format("yyyy-MM-dd hh:mm:ss"),
				success:MessageStorage
			});

			/***************    以下处理消息保存    ********************/
			function MessageStorage(resmessage) {
				if(resmessage.result){
					var $backObj = resmessage.backObj;
					// 根据 sessionId 获取信息
					var sessionArr = kefu_rooms[$backObj.sessionId] || [];
					if(sessionArr.length > 0){
						var roomindex = kefuarrtool.getWith(sessionArr, 'room', $roomid);
						if(roomindex >= 0){
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
		if(rooms.length <= 0){
			typeof fn === "function" && fn({result:false, rows:[]});
			return;
		}
		var roomindex = kefuarrtool.getWith(rooms, 'room', roomid);
		if(roomindex < 0){
			typeof fn === "function" && fn({result:false, rows:[]});
			return;
		}
		// 消息集
		var messages = rooms[roomindex].message || [];
		if(messages.length < 0){
			typeof fn === "function" && fn({result:false, rows:[]});
			return;
		}
		typeof fn === "function" && fn({result:true, rows:messages});
	});

	// 这算是双人聊天吗？
	socket.on('user:private', function(msg, to){
		// if(onlines[to]){
		// 	onlines[to].emit('user:private',socket.nickname,msg,to);
		// }
	});

	/*
	*	客服登录
	* 	param 	nickuser 登录名 | nickpwd 密码 | fn 回调函数
	*/
	socket.on('kefu_user:login', function(nickuser, nickpwd, fn){
		mysqlexecute.mysqlQueryOne({
			sqltext:'select * from kefu_users where userName=? and passWord=?',
			param:[nickuser, mymd5.md5(nickpwd)],
			success:function (res) {
				if(typeof res == undefined || (res.id || 0) <= 0){
					fn({result: false, message: '用户名或密码错误!'});
				}else{
					var _sessionid = mymd5.md5(res.id + Date.parse(new Date()).toString());
					mysqlexecute.mysqlQueryOne({
							sqltext:'update kefu_users set sessionId = ? where id = ?',
							param:[_sessionid, res.id],
							success:function (resup) {
								res.sessionId = _sessionid;
								kefuuserhandle(res);
							}
						}
					);
				}
			}
		});

		/*
		*	客服登录成功回调处理
		*/
		function kefuuserhandle(res) {
			var index = kefuarrtool.getWith(kefuuseronlines, 'id', res.id);
			if(index >= 0){
				fn({result:false, message:'账号已在其他端登录!'});
			}else {
				fn({result:true, message:'',sessionId: res.sessionId});
			}
		}
	});

	/*
	*	客服登录验证
	*/
	socket.on('kefu_user_login:verification', function (sessionId, fn) {
		if(sessionId == ''){
			fn({result: false, message: '未登录'});
		}else{
			mysqlexecute.mysqlQueryOne({
					sqltext:'select * from kefu_users where sessionId= ?',
					param:[sessionId],
					success:function (res) {
						var index = kefuarrtool.getWith(kefuuseronlines, 'id', res.id);
						if(index < 0){
							// 追加至数组中
							kefuuseronlines.push(res);
						}
						kefuuser_sessionids[sessionId] = socket.sessionid = res.sessionId;
						// 记录名称
						socket.name = res.name;
						// 客服登录集
						io.sockets.emit('kefu_user:onlines', kefuuseronlines);
					}
				}
			);
			fn({result: true, message: ''});
		}
	});

	/*
	*	用户登录初始化
	*/
	socket.on('kefu_member_login:init', function (roomId, fn) {
		if(roomId == ''){
			roomId = mymd5.md5(Date.parse(new Date()).toString());
			// 获取自增Id
			mysqlexecute.mysqlTabKey1({
				param:['kefu_member'],
				success:kefu_member_backfun
			});

			// 获取自增Id 回调函数
			function kefu_member_backfun(reskey) {
				insert_handle(reskey);
			}

			// 自定义用户信息
			function insert_handle(reskey) {
				var values = [reskey.value, 0, 0, 'plan' + (Math.random() * 1000), mymd5.md5('123').toString(), '匿名' + reskey.value, '', roomId, '', 1, (new Date()).Format("yyyy-MM-dd hh:mm:ss")];
				// 添加用户信息
				mysqlexecute.mysqlExecute({
					sqltext:'INSERT INTO kefu_member VALUES (?,?,?,?,?,?,?,?,?,?,?)',
					param:values,
					success:Inser_member_backfun
				});
				// 添加用户信息回调函数
				function Inser_member_backfun(res) {
					if((res.rows.affectedRows || 0) > 0){
						getby_sessionId(roomId);
					}
				}
			}
		}else{
			getby_sessionId(roomId);
		}

		// 查找用户信息
		function getby_sessionId(roomId) {
			mysqlexecute.mysqlQueryOne({
				sqltext:'select * from kefu_member where roomId = ?',
				param:[roomId],
				success:getby_backfun
			});
			// 查找用户信息 回调函数
			function getby_backfun(res) {
				var index = kefuarrtool.getWith(kefumemberonlines, 'id', res.id);
				if(index >= 0){
					fn({result:false, message:'账号已在其他端登录!'});
				}else{
					kefumemberonlines.push(res);
				}
				kefumember_roomids[roomId] = socket.roomid = res.roomId;
				// 记录名称
				socket.name = res.name;
				// 用户登录集
				io.sockets.emit('kefu_member:onlines', kefumemberonlines);
				// 订阅
				socket.join(res.roomId);

				// 返回人数最少的客服
				var userline = kefuusertool.GetLessAdmitNum(kefuuseronlines, 'admitNum');
				// 有客服在线时才处理
				if((userline.id || 0) > 0) {
					// 绑定客服
					mysqlexecute.mysqlMemberBindUser({userid :userline.id, sessionid :userline.sessionId, roomid : res.roomId });

					// 更新客服接待人数
					kefuusertool.UpdateAdmitNum(kefuuseronlines, userline.id);
					// 得到当前客服接待的信息
					var rooms = kefu_rooms[userline.sessionId] || [];
					// 检查是否已经包含
					var roomsindex = kefuarrtool.getWith(rooms, 'room', res.roomId);
					if(roomsindex < 0) {
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
					io.sockets.emit(userline.sessionId, {roomId: res.roomId, rooms: kefu_rooms[userline.sessionId]});
				}

				// 客服呼叫 - 请求返回
				fn({result:true, roomid:res.roomId});
			}
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
	socket.on('disconnect', function(){
		// 客服离线处理
		if(socket.sessionid){
			var sessionIndex = kefuarrtool.getWith(kefuuseronlines, 'sessionId', socket.sessionid);
			if(sessionIndex >= 0){
				// 通过下标移除目标
				kefuuseronlines.splice(sessionIndex, 1);
				// 客服登录集
				socket.emit('kefu_user:onlines', kefuuseronlines);

				//......在这里做更多的事
				/*********************    客服断线，将用户转接给你在线的客服    ***************************/
				// 得到当前该客服接待的用户
				var rooms = kefu_rooms[socket.sessionid] || [];
				if(rooms.length > 0){
					// 返回人数最少的客服
					var userline = kefuusertool.GetLessAdmitNum(kefuuseronlines, 'admitNum');

					// 有客服在线时才处理
					if((userline.id || 0) > 0) {
						// 得到转移后客服所接待的用户
						var migrate_room = kefu_rooms[userline.sessionId] || [];

						[].forEach.call(rooms, function (item, index) {
							migrate_room.push(item);

							// 转用户移到新的客服上
							kefu_rooms[userline.sessionId] = migrate_room;

							// 呼叫在线客服加入房间
							io.sockets.emit(userline.sessionId, {roomId: item.room, rooms: kefu_rooms[userline.sessionId]});

							/*console.log('返回用户实例：');
							console.log(item);
							console.log(userline);*/
							// 绑定客服
							mysqlexecute.mysqlMemberBindUser({userid :userline.id, sessionid :userline.sessionId, roomid : item.room });
						});
						// 原客服清空接待用户
						kefu_rooms[socket.sessionid] = [];
					}
				}
			}
		}

		// 用户离线处理
		if(socket.roomid){
			var roomIndex = kefuarrtool.getWith(kefumemberonlines, 'roomId', socket.roomid);
			if(roomIndex >= 0){
				// 通过下标移除目标
				kefumemberonlines.splice(roomIndex,1);
				// 用户登录集
				socket.emit('kefu_member:onlines', kefumemberonlines);

				//......在这里做更多的事
			}
		}
	});
});




