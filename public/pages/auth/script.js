var eventPage = function($) {
    function bindEventClick() {
        console.log('hello');

        $(document).on('click', '#btn_role', function (e) {
            console.log('dang thuc hien chon quyen');
            
            
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