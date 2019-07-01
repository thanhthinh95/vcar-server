

var eventPage = function($) {
    return {
        init : function () {
            $(document).on('submit', '#form_login', function (e) {
                e.preventDefault();
                var obj = $('#form_login').serializeArray();

                _AjaxObject('/login', 'POST', obj, function(resp) {
                    console.log(resp);
                    if(resp.code == 200){
                        window.location.href = '/home';
                    }else{
                        _DialogError(resp.message, function() {
                            $('#email').val('');
                            $('#password').val('');
                        });
                    }
                });
            })
        },
        uncut : function (){
            console.log('dang huy bo su kien');
            
        }
    }
}(jQuery)