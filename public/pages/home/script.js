

var eventPage = function($) {
    function initSocket() {
        var socket = io(window.location.host);

        socket.emit('clientConnect', {userId : user._id});

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
    }  

    function initRole(roles, roleIndex) {
        if(!roleIndex){//Neu user truoc do chua chon quyen
            console.log('one');
            
            readEjsFile("/views/auth.ejs", {dataRoles : roles});
        }
    }



    return {
        init : function () {
            initSocket();
            initRole(roles, roleIndex);


            $('#button_sidebar').on('click', function (e) {
                $("#myNav").width('260px')
                

            })


            $('#close_sidebar').on('click', function (e) {
                $("#myNav").width("0px");
                

            })

 

 



    

        },
        uncut : function (){
            
        }
    }
}(jQuery)