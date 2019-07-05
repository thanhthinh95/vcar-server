var eventPage = function($) {
    function bindEventClick() {
        $(document).on('click', '#config', function (e) {
            $('#modal_config').modal('show');
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


