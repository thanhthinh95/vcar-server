
var eventHomePage = function($) {
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
                _DialogError(data.message, function name() {
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

        }
    }



    return {
        init : function () {
            initSocket();
            // initRole(roles, roleIndex);


            $('#button_sidebar').on('click', function (e) {
                $("#myNav").width('260px')
            })

            $('#close_sidebar').on('click', function (e) {
                $("#myNav").width("0px");
            })

            $(document).on('click', 'a', function (e) {
                e.preventDefault();
                loadPageChild('auth');
            })
 
    

        },
        uncut : function (){
            
        }
    }
}(jQuery)