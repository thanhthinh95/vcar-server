var eventPage = function($) {
    function bindEventClick() {
        console.log('hello');

        $(document).on('click', '#btn_role', function (e) {
            var roldeId = $(this).attr('data_id');
            console.log('dang thuc hien chon quyen', roleIndex, roldeId, user);
            
            _AjaxObject('/auth', 'POST', {_id: roldeId}, function(resp) {
                if(resp.code == 200 && resp.data){
                    loadMenus(roldeId);
                    $('#button_sidebar').css('display', '');
                    roleIndex = resp.data;
                    $('#header_role_index').text(resp.data.name);
                    _loadPageChild('user');

                }else{
                    _DialogError(resp.message);
                }
            });
        })
        
    }

    function loadMenus(roleId) {
        var dataObject = {
            type : 1,
            data : {
                _id : roleId,
            }
        }
        _AjaxObject('/menu/search', 'GET', dataObject, function (resp) {
            console.log(resp);
            
            
        })
    }

    return {
        init : function () {
            $('#button_sidebar').css('display', 'none');
            bindEventClick();

        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien auth');
            
            
        }
    }
}(jQuery)