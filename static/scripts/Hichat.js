$(document).ready(function() {
  var hichat = new HiChat()
  hichat.init()
})

var HiChat = function() {
  this.socket = null
}

HiChat.prototype = {
  init: function() {
    var that  =this
    this.socket = io.connect()
    this.socket.on('connect', function(){
      $('#info').text('Your nickName:)')
      $('#nickWrapper').show()
      $('#nicknameInput').focus()
    })
    this.socket.on('login success', function () {
      document.title = 'hichat |' + $('#nicknameInput').val()
      $('#loginWrapper').hide()
      $('#messageInput').focus( )
    })
    this.socket.on('nick existed', function() {
      $('#info').text('nickname is taken, choose another pls'); //显示昵称被占用的提示
    });
    this.socket.on('system',function (nickname, userCnt, type) {
      var msg = nickname + (type === 'login' ? ' joined' : ' left')
      that._displayNewMsg('system', msg, 'red')
    })
    this.socket.on('newMsg', function(user, msg) {
      that._displayNewMsg(user, msg);
    });
    bindEvent(that)
  },
  _displayNewMsg: function(user, msg, color) {
    var $historyMsg = $('#historyMsg')
    var date = new Date().toTimeString().substr(0, 8)
    var text = user + '<span class="time">(' + date + ')</span>: ' + msg
    var textColor = color || '#d3d3d3'
    $historyMsg.append('<p style="color:' + textColor +'">' + text + '</p>')
  }
}

function bindEvent(obj) {
  $('#loginBtn').on('click', function () {
    var nickname = $('#nicknameInput').val().trim()
    if (nickname) {
      obj.socket.emit('login', nickname)
    } else {
      $('#nicknameInput').focus()
    }
  })

  $('#sendBtn').on('click', function () {
    var $msgInput = $('#messageInput')
    var msg = $msgInput.val().trim()
    if (msg.length !== 0) {
      obj.socket.emit('postMsg', msg);
      obj._displayNewMsg('me', msg);
      $msgInput.val('').focus()
    };
  })
}
