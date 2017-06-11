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
var fs = require('fs');

var connect = require('connect');
// var app = http.createServer(
// 		connect.static(__dirname);
// 	).listen(8080);
var app = http.createServer(handler);
app.listen(8080);

function handler(req,res){
	// index.html 包含我们的客户端代码
	fs.readFile(__dirname+'/',function(err,data){
		if(err){
			res.writeHead(500);
			return res.end('Error loading indexs.html');
		}
		res.writeHead(200);
		res.end(data);
	});
}

//函数Response，将HTML、css、js等文件响应给客户端
var Response = function(res,filePath){
    //读取文件，读取完成后给客户端响应
    fs.readFile(filePath,function(err,data){
        if(err){                        //如果失败，就返回错误文件
            if(filePath != error)       //如果失败的不是错误文件，才返回错误文件
                Response(res,error);
        }else{
            //获取后缀名
            var i = filePath.lastIndexOf('.');
            var suffix = filePath.substr( i+1, filePath.length);
            res.writeHead(200,{                     //响应客户端，将文件内容发回去
                'Content-type':"text/"+suffix});    //通过后缀名指定mime类型
            res.end(data);
        }
    });
};

var sio = require('socket.io');
var io = sio.listen(app),
	nicknames={},
	onlines={};

io.sockets.on('connection',function(socket){
	socket.emit('news',{hello:'world'});
	socket.on('user:pub',function(msg){
		//给除了自己以外的客户端广播消息
		socket.broadcast.emit("user:pub",socket.nickname,msg);
	});
	// 这算是双人聊天吗？
	socket.on('user:private',function(msg,to){
		if(onlines[to]){
			onlines[to].emit('user:private',socket.nickname,msg,to);
		}
	});

	socket.on('nickname',function(nick,fn){
		// fn 用于确认是否登录聊天室成功了，ture 表示有相同的昵称的用户进入
		if(nicknames[nick]){
			fn(true);
		}else{
			fn(false);
			// 这里是登录时的操作，nick 为登录名称
			nicknames[nick] = socket.nickname = nick;
			onlines[nick] = socket;
			socket.broadcast.emit('announcement',nick+'已连接');
			io.sockets.emit('nicknames',nicknames);
		}
	});

	socket.on('disconnect',function(){
		if(!socket.nickname){
			return;
		}
		delete nicknames[socket.nickname];
		delete onlines[socket.nickname];

		socket.broadcast.emit('announcement',socket.nickname+'断开连接了');
		socket.broadcast.emit('nicknames',nicknames);
	});
});




