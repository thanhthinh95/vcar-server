var eventPage = function($) {
    function bindEventClick() { 
        $(document).on('click',  '#expandAll', function () {
            $('.dd').nestable('expandAll');
        })

        $(document).on('click',  '#collapseAll', function () {
            $('.dd').nestable('collapseAll');
        })


        $(document).on('submit', '#form_action', function(e) {
            e.preventDefault();
            var data = _createObjectInForm('#form_action');
            if(_.isEqual($(this).attr('data_action'), 'new')){//Thuc hien tao moi
                _AjaxObject('/menu', 'POST', data, function (resp) {
                    if(resp.code == 200){
                        _loadPageChild('menu');
                    }else {
                        _DialogError(resp.message);
                    }
                })
            }else if(_.isEqual($(this).attr('data_action'), 'update')){//Thuc hien cap nhat
                _AjaxObject('/menu', 'PUT', data, function (resp) {
                    if(resp.code == 200){
                        _loadPageChild('menu');
                    }else {
                        _DialogError(resp.message);
                    }
                })
            }
        })


        $(document).on('click', '#delete', function (e) {
            var _id = $(this).attr('data_id');

            _DialogQuestion('Bạn có chắc chắn ?', 'Danh mục đang chọn và con của danh mục sẽ bị xóa vĩnh viễn!', function () {
                _AjaxObject('/menu/' + _id, 'DELETE', null, function (resp) {
                    if(resp.code == 200){
                        _DialogSuccess('Đã xóa bỏ thành công', function () {
                            _loadPageChild('menu');
                        })
                    }else {
                        _DialogError(resp.message);
                    }
                })
            })
        })

        $(document).on('click', '#update', function (e) {
            $('#modal_update').modal('show');

            var id = $(this).attr('data_id');
            console.log(id);
        })
    }



    function bindNesTable(menus) {
        var html = bindMenus(menus);
        $('#nestable').html(html);
    }

    function bindMenus(menus) {
        var html = '<ol class="dd-list">';
        _.forEach(menus, function(menu){
            html += '<li class="dd-item dd3-item" data-id="'+ menu._id +'">';
            html += '<div class="dd-handle dd3-handle"><i class="' + menu.icon +'" aria-hidden="true"></i> </div>';
            html += '<div class="dd3-content">'
            html +=     '<span>' + menu.name + '</span>';
            html +=     '<span>'+ (menu.link ? ' [' + menu.link + ']' : '') +'</span>';
    
            html += '<div class="roles_check">'

            _.forEach(_roles, function(role) {
               let obj = _.find(menu.activities, {roleId : role._id});
               html +=     '<span class="role align-middle">';
               html +=     '<input type="checkbox" class="mx-auto" disabled '+ (obj ? " checked" : '')+' />';
               html +=     '</span>'; 
            });
                
            html +=     '<span class="role">';
            html +=     '<i class="fa fa-pencil-square-o text-primary mx-auto" aria-hidden="true" data-toggle="tooltip" data_id="'+ menu._id +'" id="update" title="Chỉnh sửa"></i>';
            html +=     '<i class="fa fa-trash-o text-primary mx-auto" aria-hidden="true" data-toggle="tooltip" data_id="'+ menu._id +'" id="delete" title="Xóa bỏ"></i>';
            html +=     '</span>';
            html += '</div>';
            html += '</div>';
            if(menu.childs && menu.childs.length > 0){
                html += bindMenus(menu.childs);
            }
            html += '</li>';
        });

        html += '</ol>';
        return html;
    }

    var updateOutput = function(e) {//day la ham mac dinh cua netable
        var list   = e.length ? e : $(e.target);   
        if (window.JSON) {
            var data = list.nestable('serialize');
            _AjaxObject('/menu', 'PUT', {dataUpdate : data}, function(resp) {
                console.log(resp);
                
                
            })
        } else {
            _DialogError('Thử lại sau', function() {
                _loadPageChild('menu')
            })
        }
    };


    return {
        init : function () {
            console.log('dang thuc hien init su kien menu');
            $('select').selectpicker();
            $('#nestable').nestable({
                group: 1
            })
            .on('change', updateOutput);
                    
            bindEventClick();
            bindNesTable(_menus);

        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien menu');
            $(document).off('change', '#nestable');
            $(document).off('click', '#expandAll');
            $(document).off('click', '#collapseAll');
            $(document).off('click', '#delete');
            $(document).off('submit', '#form_action');
            
        }
    }
}(jQuery)