

$(document).ready(function(){
    eventPage.init();
});

window._AjaxObject = function (url, method, object, success, dataType) {
    $('#loader').modal('show');

    $.ajax({
        async: true,
        url : url,
        type : method,
        dataType : dataType ? dataType : "json",
        data : object,
        success : function(resp) {
            setTimeout(function() {
                $('#loader').modal('hide');
                setTimeout(function() {
                    success(resp)
                }, 100);
            }, 500);
        },
    })
}


window._DialogError = function(content, fn_OK) {
    $.confirm({
        title: 'Đã có lỗi xảy ra!',
        content: content,
        type: 'red',
        typeAnimated: true,
        buttons: {
            OK: {
                text: 'OK',
                btnClass: 'btn-blue',
                action: fn_OK
            },
        }
    });
}

window._DialogSuccess = function(content, fn_OK) {
    $.confirm({
        title : 'Thành Công',
        content: content,
        type: 'blue',
        typeAnimated: true,
        buttons: {
            OK: {
                text: 'OK',
                btnClass: 'btn-blue',
                action: fn_OK
            },
        }
    });
}

window._DialogQuestion = function(title, content, fn_success) {
    $.confirm({
        title: title,
        icon: 'fa fa-question-circle',
        type: 'blue',
        content: content,
        autoClose: 'cancelAction|8000',
        buttons: {
            OK: {
                text: 'Đồng ý',
                btnClass: 'btn-blue',
                action: fn_success
            },
            cancelAction: {
                text : 'Hủy bỏ'
            }
        }
    });
}


window.loadPageChild = function(url) {
    var path = window.location.origin + '/' + url;
    eventPage.uncut();
    _AjaxObject(path, 'GET', null, function(html) {
        $('#pageChild').html(html);
        eventPage.init();
    }, 'html')
}