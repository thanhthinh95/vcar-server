
var eventPage = function ($) {
    function initSocket() {
        var socket = io(window.location.host);

        socket.emit('clientConnect', { userId: user._id });

        socket.on('clientConnect', function (data) {
            console.log('socketID', socket.id);
            console.log('this is data server', data);
        });

        socket.on('kick', function (data) {
            console.log('socketID', socket.id);
            console.log('this is data server', data);

            if (data.code == 302) {// Ban vua bi chiem quyen dang nhap
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

 

    function initRole(roleIndex) {
        if (!roleIndex) {//Neu user truoc do chua chon quyen
            _loadPageChild('auth');
        }else {//neu user truoc do da chon quyen, thuc hien get menus ra sidebar
            _bindMenuSideBar(roleIndex._id);
        }
    }

    function closeSideBar() {
        $('#button_sidebar').removeClass();
        $('#button_sidebar').addClass("fa fa-bars fa-lg text-white");
        $('#button_sidebar').attr('data_action', 'close');
        $("#myNav").width("0px");
    }

    function openSideBar() {
        $('#button_sidebar').removeClass();
        $('#button_sidebar').addClass("fa fa-arrow-left fa-lg text-white");
        $('#button_sidebar').attr('data_action', 'open');
        $("#myNav").width('260px');
    }


    return {
        init: function () {
            initSocket();
            initRole(roleIndex);


            $('#button_sidebar').on('click', function (e) {
                var data = $(this).attr('data_action');
                
                if(data == 'close'){//Dang o trang thai dong
                    openSideBar();
                }else if(data == 'open'){// Dang o trang thai mo
                    closeSideBar();
                }
            })

         

            $(document).on('click', 'a', function (e) {
                var hash = $(this).attr('href');
                if (_.split(hash, '#').length == 2) {//duong dan co dau #
                    e.preventDefault();
                    _loadPageChild(_.split(hash, '#')[1]);

                    if ($(this).attr('data_type') == 'side') {
                      closeSideBar();
                    }
                }
            })

           

        },
        uncut: function () {

        }
    }
}(jQuery)