

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    eventPage.init();


});

window._AjaxObject = function (url, method, object, success, dataType) {
    $('#loader').modal('show');

    $.ajax({
        async: true,
        url: url,
        type: method,
        dataType: dataType ? dataType : "json",
        data: object,
        success: function (resp) {
            setTimeout(function () {
                $('#loader').modal('hide');
                setTimeout(function () {
                    success(resp)
                }, 100);
            }, 500);
        },
    })
}


window._DialogError = function (content, fn_OK) {
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

window._DialogSuccess = function (content, fn_OK) {
    $.confirm({
        title: 'Thành Công',
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

window._DialogQuestion = function (title, content, fn_success) {
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
                text: 'Hủy bỏ'
            }
        }
    });
}


window._loadPageChild = function (url) {
    var path = window.location.origin + '/' + url;
    eventPage.uncut();
    _AjaxObject(path, 'GET', null, function (html) {
        $('#pageChild').html(html);
        eventPage.init();
        $('[data-toggle="tooltip"]').tooltip();

    }, 'html')
}


window._appendModalConfig = function (modalId, fields) {
    if (fields) {
        var html = '';
        _.forEach(fields, function (item) {
            html += '<tr>';
            html += '<td class="td_modal">';
            html += '<div class="custom-control custom-checkbox">';
            html += '<input type="checkbox" class="custom-control-input" name="field_config_' + item.path + '" id="field_config_' + item.path + '" ' + (item.statusShow == -1 || item.statusShow == 1 ? 'checked ' : ' ') + (item.statusShow == -1 ? 'disabled' : '') + ' />';
            html += '<label class="custom-control-label" for="field_config_' + item.path + '">' + item.textShow + ' (' + item.path + ')</label>';
            html += '</td>';
            html += '</tr>';
        })

        $(modalId + ' tbody').append(html);
    }
}


window._bindHeadTable = function (tableId, fields) {
    fields = _.filter(_fields, function (element) {//Thuc hien loc cac filed co stastusShow = -1 va 1
        return (element.statusShow == -1 || element.statusShow == 1)
    });

    if (fields) {
        $(tableId + ' thead').empty();
        $(tableId + ' thead').append(createTitleHeadTable(fields));
        $(tableId + ' thead').append(createFilterHeadTable(fields));

    }
}

function createTitleHeadTable(fields) {
    if (!fields) return '';

    var html = '<tr id="title_head_table"> class="d-flex"';
    html += '<th class="text-center align-middle" style="width : 20px">#</th>';

    _.forEach(fields, function (item) {
        html += '<th class="text-center align-middle">' + item.textShow + '</th>';
    })

    html += '<th class="text-center align-middle" style="width : 105px">Tác vụ</th>';
    html += '</tr>';
    return html;
}

function createFilterHeadTable(fields) {
    if (!fields) return '';

    var html = '<tr id="filter_head_table"> class="d-flex"';
    html += '<th class="text-center align-middle">' +
        '<div class="custom-control custom-checkbox">' +
        '<input type="checkbox" class="custom-control-input" name="hi" id="hi"/>' +
        '<label class="custom-control-label" for="hi"></label>' +
        '</th>';

    _.forEach(fields, function (item) {
        html += itemFilter(item);
    })
    html += '<th class="text-center align-middle"><button class="btn-primary form-control"><i class="fa fa-filter"></i> Lọc</button></th>';
    html += '</tr>';
    return html;
}

function itemFilter(item) {
    var html = '<th class="text-center align-middle">';
    if(item.statusSearch){
        switch (item.instance) {
            case 'ObjectID':
                html += '<input class="form-control" type="text" name="'+ item.path +'"></input>';
                break;
            case 'String':
                html += '<input class="form-control" type="text" name="'+ item.path +'"></input>';
                break;
            case 'Number':
                html += '<input class="form-control" type="number" name="'+ item.path +'"></input>';
                break;
            case 'Date':
                html += '<div class="input-group date">'+
                    '<input type="text" class="form-control datetimepicker-input" id="'+  item.path +'" data-toggle="datetimepicker" data-target="#'+  item.path +'"/>'+
                    '<div class="input-group-append">' +
                    '<span class="input-group-text"><i class="fa fa-calendar"></i></span>'+
                    '</div>' +
                    '</div>';
                break;
            case 'Select':
                html += 
                    '<div class="form-group">' +
                    '<select class="selectpicker form-control" multiple data-selected-text-format="count > 2" ' +
                    'name="'+ item.path +'[]"' +
                    (item.valueSelect.length > 4 ? ' data-live-search=true' : '') +
                    (item.valueSelect.length > 6 ? ' data-actions-box=true' : '') +
                    ' title="Chọn ' + _.lowerFirst(item.textShow) +'">' +
                  
                    '</div>' ;
                _.forEach(item.valueSelect, function(val) {
                    html += '<option value="'+ val._id +'">'+ val.name +'</option>';
                })
                html += '</select>';
                break;
            default:
                return '';
        }
    }

    html += '</th>';
    return html;
}