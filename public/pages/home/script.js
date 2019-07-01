

var eventPage = function($) {
    return {
        init : function () {
            var socket = io(window.location.host);

            socket.emit('clientConnect', {userId : userId});

            socket.on('clientConnect', function (data) {
                console.log('socketID', socket.id);
                console.log('this is data server', data);
            });

            socket.on('kick', function (data) {
                console.log('socketID', socket.id);
                console.log('this is data server', data);

                if(data.code == 302){// Ban vua bi chiem quyen dang nhap
                    _DialogError(data.message, function name(params) {
                        window.location.href = '/';
                    })
                }
            });

   
           

            socket.on('dataUserRom', function (data) {
                console.log('socketID', socket.id);
                console.log('this is data server', data);
            });
           

        },
        uncut : function (){
            
        }
    }
}(jQuery)