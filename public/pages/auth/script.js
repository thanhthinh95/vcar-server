var eventPage = function($) {
    function bindEventClick() {
        console.log('hello');

        $(document).on('click', '#btn_role', function (e) {
            var roldeId = $(this).attr('data_id');
            console.log('dang thuc hien chon quyen', roleIndex, roldeId, user);
            
            _AjaxObject('/auth', 'POST', {_id: roldeId}, function(resp) {
                if(resp.code == 200 && resp.data){
                    roleIndex = resp.data;
                    $('#header_role_index').text(resp.data.name);
                    window.location.href = roleIndex.urlDefault ? roleIndex.urlDefault : '';
                }else{
                    _DialogError(resp.message);
                }
            });
        })
        
    }

    return {
        init : function () {
            
            bindEventClick();

        },
        uncut : function (){
            
        }
    }
}(jQuery)