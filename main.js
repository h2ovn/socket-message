var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');
var clients = [];
var groups = {};
var groupCounts = 0;

//port thằng user truy cập vào
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3030;

//ip thằng user truy cập vào
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

// remove một item trong một goup
function removeGroupItem(groupName, item){
	var s = groups[groupName];
	var indexRemoves = [];
	if (s != null) {
		removeItemInArray(s, item);
		if (s.length == 0) {
			groups[groupName] = null;
		}
	}
}
function removeItemInArray(array, item){
	var indexRemoves = [];
	// duyệt các item
	for(var  i = array.length -1; i >= 0 ; i--) {
		if(array[i] == item) {
			indexRemoves.push(i);
		}
	}
	// remove
	for(var i = 0; i < indexRemoves.length; i++){
		array.splice(indexRemoves[i], 1);
	}
}

app.listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});


function handler (req, res) {
  res.writeHead(200);
  res.end("hello");
}

io.on('connection', function (socket) {
	socket.data_groups = []; //danh sách group của socket
	//clients.push(socket);
	//console.log("connection " );
	// Đăng ký nhận msg từ groupName
  socket.on('register', function (groupName) {
  	//console.log("register");
		if(groups[groupName] == null) {
			groups[groupName] = [];
		}
		var kq = { data: groupName, errorCode : 0, isInGroup : 0 }
		if(!groups[groupName].some(function(s){
			return (s == socket);
		})) {
			groups[groupName].push(socket);
		}
		else{
			kq.isInGroup += 1;
		}
		if(!socket.data_groups.some(function(g){
			return (g == groupName);
		})) {
			socket.data_groups.push(groupName);
		}
		else{
			kq.isInGroup += 2;
		}
    socket.emit('onRegister', kq);
  });
  socket.on('unRegister', function (groupName) {
    //console.log("join", groupName);
		removeGroupItem(groupName, socket);
		removeItemInArray(socket.data_groups, groupName);
    socket.emit('onUnRegister', { data: groupName, errorCode : 0 });
	});
	//gửi message to group
  socket.on('message', function (groupName, data) {
  	var s = groups[groupName];
		if(s != null){
			for(var  i= 0; i < s.length; i++){
				if(s[i] != socket) {
					s[i].emit('onMessage', { errorCode: 0, data: data });
				}
				else{
					s[i].emit('onMyMessage', { errorCode: 0, data: data });
				}
			}
		}
		else{
			socket.emit('onError', { error: "group not found", errorCode : 1 });
		}
  });
  socket.on('disconnect', function () {
  	//console.log("disconnect ", socket.data_groups);
		// remove nó ra khỏi group
		if(socket.data_groups != null){
			socket.data_groups.forEach(function(value){
				removeGroupItem(value, socket);
			});
			socket.data_groups = [];
		}
  });
});