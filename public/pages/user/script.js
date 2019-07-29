var eventPage = function($) {
    var dataTableRows = null;

    function bindEventClick() {
        $(document).on('click', '#config', function (e) {
            $('#modal_config').modal('show');
            $("#table_modal tbody").empty();
            $('#sumRow').val(_sumRow);
            $('#sum_column').text(_.filter(_fields, {statusShow : -1}))
            _appendModalConfig('#table_modal', _.filter(_fields, {statusShow : -1}));
            _appendModalConfig('#table_modal', _.filter(_fields, {statusShow : 1}));
            _appendModalConfig('#table_modal', _.filter(_fields, {statusShow : 0}));
        })

        $(document).on('click', '#create_new', function (e) {
            _bindModalInfo(null, '#modal_info', _fields, ['name', 'email', 'numberPhone', 'birthDay', 'gender', 'roles', 'status']);

            $('.datetimepicker-input').datetimepicker({
                locale : 'vi',
                format : 'DD/MM/YYYY'
            });
        })

        $(document).on('click', '#edit_row_table', function (e) {
            var dataRow = _.find(dataTableRows, {_id : $(this).attr('data_id')});
            if(dataRow){
                _bindModalInfo(dataRow, '#modal_info', _fields, ['name', 'email', 'numberPhone', 'password', 'birthDay', 'gender', 'roles', 'status']);

                $('.datetimepicker-input').datetimepicker({
                    locale : 'vi',
                    format : 'DD/MM/YYYY'
                });
            }else{
                _DialogError('Không tìm thấy bản ghi');
            }
        })

        $(document).on('submit', '#form_modal_config', function (e) {
            e.preventDefault();
            var _filedTems = _.filter(_fields, {statusShow : -1});
            let objChecked = $('#form_modal_config').serializeArray();
            
            let objSumRow = _.find(objChecked, {name : 'sumRow'}); //Tim kiem va dat lai sumRow mac dinh cua page
            _sumRow = objSumRow ? objSumRow.value  : _sumRow;

            _.forEach(objChecked, function(item) {//Tim kiem va data lai gia tri fields
                let nameItems = _.split(item.name, 'field_config_');
                if(nameItems[1]){//Da tim thay fields can dat gia tri
                    let obj = _.find(_fields, {path : nameItems[1]});
                    obj.statusShow = 1;
                    _filedTems.push(obj);
                }
            })

            let objUnCheck = _.map($("input:checkbox:not(:checked)"), function (item) {
                return {name : item.name};
            })

            _.forEach(objUnCheck, function(item) {//Tim kiem va dat lai data Uncheck
                let nameItems = _.split(item.name, 'field_config_');
                if(nameItems[1]){//Da tim thay fields can dat gia tri
                    let obj = _.find(_fields, {path : nameItems[1]});
                    obj.statusShow = 0;
                    _filedTems.push(obj);
                }
            })
            
            _fields = _filedTems;
            $('#modal_config').modal('hide');
            bindHeadTable();
            bindBodyTable();
        })


        $(document).on('submit', '#form_table', function name(e) {
            e.preventDefault();
            bindBodyTable();
        })

        $(document).on('click', '.sort' , function(e){
            _changeIconSort($(this));
            bindBodyTable();
        });



        $(document).on('submit', '#form_modal_info', function (e) {
            e.preventDefault();
            $('#modal_info').modal('hide');
            var objData = _createObjectInForm('#form_modal_info');


            if(_.isEqual($(this).attr('data_action'), 'create')){
                _AjaxObject('/user', 'POST', objData, function(resp) {
                    if(resp.code == 200){
                        _DialogSuccess('Đã tạo mới thành công', function () {
                            _loadPageChild('user');
                        })
                    }else{
                        _DialogError(resp.message);
                    }
                })
            }else if(_.isEqual($(this).attr('data_action'), 'update')) {
                _AjaxObject('/user', 'PUT', objData, function(resp) {
                    if(resp.code == 200){
                        _DialogSuccess('Đã cập nhật thành công', function () {
                            _loadPageChild('user');
                        })
                    }else{
                        _DialogError(resp.message);
                    }
                })
            }
        })

        $(document).on('click', '#delete_row_table', function (e) {
            var _id = $(this).attr('data_id');
            _DialogQuestion('Bạn đã chắc chắn ?', 'Quyền truy cập người dùng sẽ không còn vai trò này nữa', function () {
                _AjaxObject('/user', 'DELETE', {ids : [_id]}, function(resp) {
                    if(resp.code == 200){
                        _DialogSuccess('Đã xóa bỏ thành công', function () {
                            _bindMenuSideBar(roleIndex._id);                                                
                            _loadPageChild('user');
                        })
                    }else{
                        _DialogError(resp.message);
                    }
                })
            })
          
        })

        $(document).on('click', '.page', function(e) {
            bindBodyTable($(this).attr('data_page'))
        })

        $(document).on('click', '#check_all_item_table', function (e) {
            if($('#check_all_item_table').is(':checked')){
                $('.check_item_table').prop("checked", true);
            }else{
                $('.check_item_table').prop("checked", false);
            }
        })

        $(document).on('click', '#delete_item_checked', function (e) {
            var dataIds = _createObjectInForm('.check_item_table')
            if(_.has(dataIds, 'checkBoxIds')){
                _DialogQuestion('Bạn có chắc chắn?', 'Dữ liệu bạn chọn sẽ bị xóa bỏ vĩnh viễn', function () {
                    _AjaxObject('/user', 'DELETE', {ids : dataIds.checkBoxIds}, function(resp) {
                        if(resp.code == 200){
                            _DialogSuccess('Đã xóa bỏ thành công', function () {
                                _bindMenuSideBar(roleIndex._id);                    
                                _loadPageChild('user');
                            })
                        }else{
                            _DialogError(resp.message);
                        }
                    })
                })
            }else{
                _DialogError('Chọn một vài đối tượng để thực hiện xóa bỏ');
            }
        })
    }

 
    function bindHeadTable() {
        _bindHeadTable('#table_data', _fields);
        $('select').selectpicker({
            countSelectedText :   '{0} mục đã chọn',
        });

        $('.datetimepicker-input').datetimepicker({
            locale : 'vi',
            format : 'DD/MM/YYYY'
        });
    }
    

    function bindBodyTable(page) {
        var objFilter = {
            dataMatch : _createObjectInForm('#form_table'),
            dataSort : _createObjectSort(), 
            sumRow : _sumRow,
            page : page ? page : 1,
        }

        if(_.has(objFilter.dataMatch, 'checkBoxIds')){//loai bo checkBoxId selected neu co
            delete objFilter.dataMatch.checkBoxIds;
        }

     
        _AjaxObject('/user/search', 'GET', objFilter, function(resp) {
            dataTableRows = null;
            
            if(resp.code == 200){
                dataTableRows = resp.data.docs;
                console.log(dataTableRows);
                
                delete resp.data.docs;

                _bindBodyTable('#form_table', _fields, dataTableRows, _menu.activities);
                _bindPaginate(resp.data);
            }else{
                _DialogError(resp.message);
            }
        })
    }


    return {
        init : function () {
            console.log('dang thuc hien init su kien user');
            $('#table_modal tbody').sortable();
            bindHeadTable();
            bindBodyTable();
            bindEventClick();
        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien user');
            $(document).off('click', '#config')
            $(document).off('click', '#create_new')
            $(document).off('click', '.sort')
            $(document).off('click', '.page')
            $(document).off('click', '#edit_row_table')
            $(document).off('click', '#delete_row_table')
            $(document).off('click', '#delete_item_checked')
            $(document).off('click', '#check_all_item_table')
            $(document).off('submit', '#form_modal_config')
            $(document).off('submit', '#form_table')
            $(document).off('submit', '#form_modal_info')
        }
    }
}(jQuery)


