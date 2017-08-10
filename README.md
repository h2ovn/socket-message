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
    socket.on('onUnRegister', function (data) {
      console.log("onUnRegister", data);
    });
    socket.on('onMessage', function (data) {
      console.log("onMessage", data);
    });
    socket.on('onMyMessage', function (data) {
      console.log("onMessage", data);
    });
    registerRevice(groupName) {
      // Register Revice massage form group
      socket.emit('register', groupName);
    }
    unRegisterRevice(groupName) {
      // Register Revice massage form group
      socket.emit('unRegister', groupName);
    }
    sendMessage(groupName, message) {
      socket.emit('message', groupName, message);
    }

  </script>
```
