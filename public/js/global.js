

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();
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
        $('[data-toggle="tooltip"]').tooltip();

    }, 'html')
}


window._bindModalConfig = function (modalId, fields) {
    if(fields){
        var html = '';
        _.forEach(fields, function (item) {
            html += '<tr>';
            html += '<td class="td_modal">';
            html += '<div class="custom-control custom-checkbox">';
            html += '<input type="checkbox" class="custom-control-input" name="field_config_' + item.path + '" id="field_config_' + item.path + '" '+ (item.statusShow == -1 || item.statusShow == 1   ? 'checked ' : ' ')  + (item.statusShow == -1 ? 'disabled' : '') + '>';
            html += '<label class="custom-control-label" for="field_config_' + item.path + '">' + item.textShow + ' (' + item.path + ')</label>';
            html += '</td>';
            html += '</tr>';    
        })    

        $(modalId +' tbody').append(html);
    }
}


window._bindHeadTable = function (tableId, fields) {
    if(fields){
        console.log(fields.length);
        
        $(tableId +' thead').empty();


        var html = '';
        html += '<tr>';
        html += '<th class="w-30 text-center">#</th>';

        _.forEach(fields, function (item) {
            
            html += '<th class="text-center">'+ item.textShow +'</th>';
 
            
        })    

        html += '</tr>';

        console.log(html);
        
        $(tableId +' thead').append(html);
    }
}