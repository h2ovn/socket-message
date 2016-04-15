# socket-message
Socket.IO server
Used for transmit message between platforms

#usage

```
<script src="http://ip:port/socket.io/socket.io.js"></script>
<script>

    var socket = io('http://ip:port');
    socket.on('onRegister', function (data) {
      console.log("onRegister", data);
    });
    socket.on('onJoin', function (data) {
      console.log("onJoin", data);
    });
    socket.on('onJoinOther', function (data) {
      console.log("onJoinOther", data);
    });
    socket.on('onMessage', function (data) {
      console.log("onMessage", data);
    });

    $(function () {
      $('#cmdReg').click(function () {
        socket.emit('register');
      })
      $('#cmdJoin').click(function () {
        var groupName = $('#tbxRoom').val();
        socket.emit('join', groupName);
      })
      $('#cmdSend').click(function () {
        var o = { duration : 5};
        //send message as JSON
        socket.emit('message', o);
      })
    })
  </script>
```
