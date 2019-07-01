

var eventPage = function($) {
    return {
        init : function () {
            $(document).on('submit', '#form_password_recovery', function (e) {
                e.preventDefault();

                _DialogQuestion('Bạn có chắc chắn ?', 'Hệ thống sẽ gửi mật khẩu mới vào hòm thư của bạn. Kiểm tra và đăng nhập', function() {
                    var obj = $('#form_password_recovery').serializeArray();
                    
                    _AjaxObject('/login', 'PUT', obj, function(resp) {
                        if(resp.code == 200){
                            window.location.href = '/';
                        }else {
                            _DialogError(resp.message, function() {
                                $('#email').val('');
                            });
                        }
                    });
                })

     
                
                
            })
        },
        uncut : function (){
            console.log('dang huy bo su kien');
            
        }
    }
}(jQuery)