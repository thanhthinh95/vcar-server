var eventPage = function($) {
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
            _bindHeadTable('#table_data', _fields);
            console.log('dang thuc hien submit form');
        })
    }

 
    


    return {
        init : function () {
            $('#table_modal tbody').sortable();
            _bindHeadTable('#table_data', _fields);
            bindEventClick();
        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien user');
            
        }
    }
}(jQuery)


