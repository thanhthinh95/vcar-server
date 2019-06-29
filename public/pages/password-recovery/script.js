

var eventPage = function($) {
    return {
        init : function () {
            console.log('dang khoi tao event');

            
            $(document).on('submit', '#form_password_recovery', function (e) {
                e.preventDefault();

                _DialogQuestion('Bạn có chắc chắn', 'Bạn sẽ nhận được mật khẩu mới trong hòm thư của mình. Kiểm tra hòm thư và thực hiện đăng nhập lại', function name() {
                    var obj = $('#form_password_recovery').serializeArray();

                    _AjaxObject('/login', 'PUT', obj, function(resp) {
                        console.log(resp);
                        
                    });
                })

     
                
                
            })
        },
        uncut : function (){
            console.log('dang huy bo su kien');
            
        }
    }
}(jQuery)