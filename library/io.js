

module.exports = function(socket) {

    socket.on('clientConnect', function (data) {// data : {userId}
        console.log('SocketID Connect: ', socket.id);
        console.log('UserId socket: ' + data.userId);
        console.log('dataConnect: ', data);
        
        socket.userId = data.userId;
        socket.join('userRoom');


        logoutUser(socket.id, data.userId);

     
        
    

        socket.emit('clientConnect', _output(300));
    });

    socket.on('helloUserRoom', function (data) {
        // console.log('SocketID JoinRoom: ', socket.id);
        // console.log('dataJoinRoom: ', data);

        socket.broadcast.to('userRoom').emit('dataUserRom', data);
    })


    socket.on('disconnect', function (data) {
        console.log('socketID', socket.id);
        console.log('disconnect: ', data);
    });
}


function logoutUser(socketId, userId) {
    var clients = io.sockets.adapter.rooms['userRoom']; //Tim ra tat ca socket cua user dang online co trong phong userRoom
    var socketIds = _.invertBy(clients.sockets).true;//Tra ve 1 mang cac socketId

    _.forEach(socketIds, function (id) {
        var socketindex = io.sockets.connected[id]//lay ra socket theo ID;
        if(!_.eq(socketId, socketindex.id) && _.eq(userId, socketindex.userId)){//Co mot nguoi khac dang dung tai khoan nay de dang nhap truoc do. Thuc hien logout tai khoan do.
            socketindex.emit('kick', _output(302));
            socketindex.disconnect();
        }
    })
}