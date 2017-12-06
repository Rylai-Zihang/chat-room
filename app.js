var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http) // bind io to server
var users = []
//指定静态文件的位置
app.use('/', express.static(__dirname + '/static'))

// socket表示当前连接到服务器的客户端
io.on('connection', function(socket) {
  socket.on('login', function (nickname) {
    console.log(users)
    if (users.indexOf(nickname) > -1) {
      socket.emit('nick existed')
    } else {
      socket.userIndex = users.length
      socket.nickname = nickname
      users.push(nickname)
      socket.emit('login success')
      io.sockets.emit('system', nickname, users.length, 'login')
    }
  })
  socket.on('disconnect', function () {
    users.splice(socket.userIndex, 1)
    socket.broadcast.emit(socket.nickname, users.length, 'logout')
  })

  socket.on('postMsg', function (msg) {
    console.log(msg)
    //将消息发送到除自己外的所有用户
    socket.broadcast.emit('newMsg', socket.nickname, msg);
  });
})

http.listen(3000, function() {
  console.log('Listening on *:3000');
})
