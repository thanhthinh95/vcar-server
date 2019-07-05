var eventPage = function($) {
    function bindEventClick() {
        $(document).on('click', '#config', function (e) {
            $('#modal_config').modal('show');
            $("#table_modal tbody").empty();

            $('#sum_column').text(_.filter(_fields, {statusShow : -1}))
            _bindModalConfig('#table_modal', _.filter(_fields, {statusShow : -1}));
            _bindModalConfig('#table_modal', _.filter(_fields, {statusShow : 1}));
            _bindModalConfig('#table_modal', _.filter(_fields, {statusShow : 0}));
        })
    }



    return {
        init : function () {
            $('#table_modal tbody').sortable();
            bindEventClick();
        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien user');
            
        }
    }
}(jQuery)


