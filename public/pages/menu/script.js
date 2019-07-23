var eventPage = function($) {
    var _menuAll = [];

    function bindEventClick() { 
        $(document).on('click',  '#expandAll', function () {
            $('.dd').nestable('expandAll');
        })

        $(document).on('click',  '#collapseAll', function () {
            $('.dd').nestable('collapseAll');
        })


        $(document).on('submit', '#form_create', function(e) {
            e.preventDefault();
            var data = _createObjectInForm('#form_create');
            console.log(data);
            
            _AjaxObject('/menu', 'POST', data, function (resp) {
                if(resp.code == 200){
                    _loadPageChild('menu');
                    _bindMenuSideBar(roleIndex._id);
                }else {
                    _DialogError(resp.message);
                }
            })
        })


        $(document).on('click', '#delete', function (e) {
            var _id = $(this).attr('data_id');

            _DialogQuestion('Bạn có chắc chắn ?', 'Danh mục đang chọn và con của danh mục sẽ bị xóa vĩnh viễn!', function () {
                _AjaxObject('/menu', 'DELETE', {ids : [_id]}, function (resp) {
                    if(resp.code == 200){
                        _DialogSuccess('Đã xóa bỏ thành công', function () {
                            _loadPageChild('menu');
                            _bindMenuSideBar(roleIndex._id);
                        })
                    }else {
                        _DialogError(resp.message);
                    }
                })
            })
        })

        $(document).on('click', '#update', function (e) {
            let objMenu = _.find(_menuAll, {_id : $(this).attr('data_id')});
            if(objMenu){
                $('#modal_update').modal('show');

                $('#id_update').val(objMenu._id);
                $('#icon_update').selectpicker('val', objMenu.icon);
                $('#name_update').val(objMenu.name);
                $('#link_update').val(objMenu.link);

                let html = '';
                _.forEach(_roles, function (role) {
                    html += '<div class="col col-md-12 col-sm-12 pt-2 custom-control custom-checkbox">'
                        + '<input type="checkbox" class="custom-control-input" name="roleIds" id="' + role._id + '_update"  value="' + role._id + '" '+ (_.find(objMenu.activities, {roleId : role._id}) ? ' checked ' : ' ' ) +'/>'
                        + '<label class="custom-control-label" for="' + role._id + '_update">' + role.name + '</label>'
                        + '</div>'
                })

                $('#roles_update').html(html);
                _bindMenuSideBar(roleIndex._id);

            }
        })

        $(document).on('submit', '#form_modal_update', function (e) {
            e.preventDefault();
            $('#modal_update').modal('hide');
            
            var data = _createObjectInForm('#form_modal_update');
            _AjaxObject('/menu', 'PUT', data, function(resp) {
                if(resp.code == 200){
                    _DialogSuccess('Đã cập nhật thành công', function () {
                        _loadPageChild('menu');
                        _bindMenuSideBar(roleIndex._id);
                    })
                }else {
                    _DialogError(resp.message);
                }
            })
            
        })
    }



    function bindNesTable(menus) {
        var html = bindMenus(menus);
        $('#nestable').html(html);
    }

    function bindMenus(menus) {
        var html = '<ol class="dd-list">';
        _.forEach(menus, function(menu){
            if(_.has(menu, '_id')){
                _menuAll.push(menu);
                html += '<li class="dd-item dd3-item" data-id="'+ menu._id +'">';
                html += '<div class="dd-handle dd3-handle"><i class="' + menu.icon +'" aria-hidden="true"></i> </div>';
                html += '<div class="dd3-content">'
                html += '<span>' + menu.name + '</span>';
                html += '<span>'+ (menu.link ? ' [' + menu.link + ']' : '') +'</span>';
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
            }
        });

        html += '</ol>';
        return html;
    }

    var updateOutput = function(e) {//day la ham mac dinh cua netable
        var list   = e.length ? e : $(e.target);   
        if (window.JSON) {
            var data = list.nestable('serialize');
            _AjaxObject('/menu', 'PUT', {dataUpdate : data}, function(resp) {
                _bindMenuSideBar(roleIndex._id);
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
            $(document).off('click', '#update');
            $(document).off('submit', '#form_create');
            $(document).off('submit', '#form_modal_update');
            
        }
    }
}(jQuery)