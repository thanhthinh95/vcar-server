var eventPage = function($) {
    function bindEventClick() {
        $(document).on('click', '#btn_role', function (e) {
            var roldeId = $(this).attr('data_id');
            console.log('dang thuc hien chon quyen', roleIndex, roldeId, user);
            
            _AjaxObject('/auth/action/selectRole', 'POST', {_id: roldeId}, async function(resp) {
                if(resp.code == 200 && resp.data){
                    $('#header_role_index').text(resp.data.name);
                    roleIndex = resp.data;
                    _bindMenuSideBar(roleIndex._id);
                    _loadPageChild('my_user/id/' + user._id);
                }else{
                    _DialogError(resp.message);
                }
            });
        })
        
    }

    async function loadMenus(roleId) {
        var dataObject = {
            type : 1,
            data : {
                roleId : roleId,
            }
        }

        await _AjaxObject('/menu/search', 'GET', dataObject, function (resp) {
            if(resp.code == 200){
                _bindMenuSideBar(resp.data);
            }else {
                _DialogError(resp.message);
            }
        })
    }



    return {
        init : function () {
            console.log('dang thuc hien init su kien auth');
            
            $('#button_sidebar').css('display', 'none');
            bindEventClick();

        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien auth');
            
            
        }
    }
}(jQuery)