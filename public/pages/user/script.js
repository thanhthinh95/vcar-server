var eventPage = function($) {
    function bindEventClick() {
        $(document).on('click', '#config', function (e) {
            $('#modal_config').modal('show');

            $("#table_modal tbody").empty();
            $('#sumRow').val(_sumRow);
            $('#sum_column').text(_.filter(_fields, {statusShow : -1}))
            _bindModalConfig('#table_modal', _.filter(_fields, {statusShow : -1}));
            _bindModalConfig('#table_modal', _.filter(_fields, {statusShow : 1}));
            _bindModalConfig('#table_modal', _.filter(_fields, {statusShow : 0}));
        })

        $(document).on('submit', '#form_modal_config', function (e) {
            e.preventDefault();

            var obj = $('#form_modal_config').serializeArray();
            console.log(obj);
            console.log('dang thuc hien submit form');
        })
    }




    return {
        init : function () {
            $('#table_modal tbody').sortable();
            _bindHeadTable('#table_data', _.filter(_fields, function(element) {
                return (element.statusShow == -1 || element.statusShow == 1)
            }));
            bindEventClick();
        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien user');
            
        }
    }
}(jQuery)


