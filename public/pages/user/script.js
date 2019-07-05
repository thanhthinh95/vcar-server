var eventPage = function($) {
    function bindEventClick() {
        console.log('hello all user');

      
        
    }

    return {
        init : function () {
            bindEventClick();

        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien user');
            
            
        }
    }
}(jQuery)