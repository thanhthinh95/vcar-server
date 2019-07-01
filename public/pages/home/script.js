

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
        console.log(roles, roleIndex);

        if(!roleIndex){//Neu user truoc do chua chon quyen
            console.log('this is here');
            
            readEjsFile("/views/auth.ejs", null);

        }
        
        
    }



    function readEjsFile(filename, dataViewChile) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", filename);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4) {
                var html =  ejs.render(rawFile.responseText, dataViewChile);
                console.log('html ', html);
                
                $('#pageChild').html(html);
            }
        }
        rawFile.send();
    }

    return {
        init : function () {
            initSocket();
            initRole(roles, roleIndex);

        },
        uncut : function (){
            
        }
    }
}(jQuery)