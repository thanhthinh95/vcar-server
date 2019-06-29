

var eventPage = function($) {
    return {
        init : function () {
            console.log('dang khoi tao event');

            
            $(document).on('submit', '#form_login', function (e) {
                e.preventDefault();

                

                var obj = $('#form_login').serializeArray();

                _AjaxObject('/login', 'POST', obj, function(resp) {
                    console.log(resp);
                });
            })
        },
        uncut : function (){
            console.log('dang huy bo su kien');
            
        }
    }
}(jQuery)