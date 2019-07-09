$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    eventPage.init();
});

window._createObjectInForm = function (formId) {
    let obj = $(formId).serializeArray();
    return _.chain(obj)
            .remove(function (item) {//Loai bo nhung obj co value = null
                return !_.isEqual(item.value, "");
            })
            .groupBy('name')//groupBy theo name [{name1 : []}, {name2 : []}]
            .mapValues(function(item) {//{name1 : "", name2 : ["", ""]}
                let a = _.map(item, 'value'); 
                return (a.length > 1 ? a : a[0]);
            })
            .value()
};

window._createObjectSort = function() {
    let obj = {};
    let elements = $('.sort').not('[data_sort="0"]');
    if(elements && elements.length > 0){
        obj[$(elements[0]).attr('data_path')] = $(elements[0]).attr('data_sort');
    };
    return obj;
}

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

window._bindBodyTable = function (tableId, fields, data) {
    fields = _.filter(_fields, function (element) {//Thuc hien loc cac filed co stastusShow = -1 va 1
        return (element.statusShow == -1 || element.statusShow == 1)
    });

    console.log(tableId);
    console.log(fields);

    $(tableId + ' tbody').empty();
    

    _.forEach(data, function (rowData) {

        var html = '<tr class="">' + 
                    '<td class="text-center align-middle">' +
                    '<div class="custom-control custom-checkbox">' +
                    '<input type="checkbox" class="custom-control-input" name="hi" id="hi"/>' +
                    '<label class="custom-control-label" for="hi"></label>' +
                    '</td>';
                   
        _.forEach(fields, function (field) {
            html += itemBody(rowData, field);
        })

        // html += '<th class="text-center align-middle"><button type="submit" class="btn-primary form-control"><i class="fa fa-filter"></i> Lọc</button></th>';
        html += '</tr>';

        $(tableId + ' tbody').append(html);
        
    })
    
    
}

function createTitleHeadTable(fields) {
    if (!fields) return '';

    var html = '<tr id="title_head_table">';
    html += '<th class="text-center align-middle" style="width : 20px">#</th>';

    _.forEach(fields, function (item) {
        if(item.statusSort){
            html += '<th role="button" class="text-center align-middle sort" ' +
                'data_instance="' + item.instance + '" ' +
                'data_path="' + item.path + '" ' +
                'data_sort="0" data-toggle="tooltip" data-placement="top" title="Sắp xếp">' +
                '<i class="fa fa-sort-amount-asc"></i> ' + item.textShow +
                '</th>';
        }else{
            html += '<th class="text-center align-middle">' + item.textShow + '</th>';
        }
    })

    html += '<th class="text-center align-middle" style="width : 105px">Tác vụ</th>';
    html += '</tr>';
    return html;
}

function createFilterHeadTable(fields) {
    if (!fields) return '';

    var html = '<tr id="filter_head_table"> ';
    html += '<th class="text-center align-middle">' +
        '<div class="custom-control custom-checkbox">' +
        '<input type="checkbox" class="custom-control-input" name="hi" id="hi"/>' +
        '<label class="custom-control-label" for="hi"></label>' +
        '</th>';
    _.forEach(fields, function (item) {
        html += itemFilter(item);
    })
    html += '<th class="text-center align-middle"><button type="submit" class="btn-primary form-control"><i class="fa fa-filter"></i> Lọc</button></th>';
    html += '</tr>';
    return html;
}

function itemFilter(item) {
    var html = '<th class="text-center align-middle">';
    if(item.statusSearch){
        switch (item.instance) {
            case 'ObjectID':
                html += '<input class="form-control" type="text" autocomplete="off" name="'+ item.path +'"></input>';
                break;
            case 'String':
                html += '<input class="form-control" type="text" autocomplete="off" name="'+ item.path +'"></input>';
                break;
            case 'Number':
                html += '<input class="form-control" type="number" autocomplete="off" name="'+ item.path +'"></input>';
                break;
            case 'Date':
                html += '<div class="input-group">'+
                    '<input type="text" autocomplete="off" class="form-control datetimepicker-input" id="date_'+  item.path +'" name="'+  item.path +'" data-toggle="datetimepicker" data-target="#date_'+  item.path +'"/>'+
                    '<div class="input-group-append">' +
                    '<span class="input-group-text"><i class="fa fa-calendar"></i></span>'+
                    '</div>' +
                    '</div>';
                break;
            case 'Select':
                html += 
                    '<div class=" input-group">' +
                    '<select class="selectpicker form-control"  autocomplete="off" multiple data-selected-text-format="count > 2" data-width="auto" ' +
                    'name="'+ item.path +'"'+
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

function itemBody(data, field) {
    var html = '<td class="text-center" title="fsd">';
    if(field.statusSearch){
        switch (field.instance) {
            case 'ObjectID':
                html += '<span style="display:inline-table;">' +data[field.path] + '</span>';
                break;
            case 'String':
                html += '<span style="display:inline-table;">' +data[field.path] + '</span>';
                break;
            case 'Number':
                html += '<span style="display:inline-table;">' +data[field.path] + '</span>';
                break;
            case 'Date':
                html += '<span style="display:inline-table;">' +data[field.path] + '</span>';
                break;
            case 'Select':
                html += '<span style="display:inline-table;">' + _.find(field.valueSelect, {_id : data[field.path]}) + '</span>';
                break;
            default:
                return '';
        }
    }

    html += '</td>';
    return html;
}


window._changeIconSort = function name(element) {
    let data_sort_index = element.attr('data_sort');
    resetIconSort();
    setValueSort(element, data_sort_index);
}

function resetIconSort () {
    $('.sort').children('i').removeClass();
    $('.sort').children('i').addClass('fa fa-sort-amount-asc');
    $('.sort').attr('title', 'Sắp xếp');
    $('.sort').attr('data_sort', '0');
}

function setValueSort (element, data_sort_index) {
    var dataArray = [
        {data : '-1', stringClass : 'fa fa-sort-alpha-desc text-warning', numberClass : 'fa fa-sort-numeric-desc text-warning', title : 'Sắp xếp giảm dần'},
        {data : '0', stringClass : 'fa fa-sort-amount-asc', numberClass : 'fa fa-sort-amount-asc', title : 'Sắp xếp'},
        {data : '1', stringClass : 'fa fa-sort-alpha-asc text-warning', numberClass : 'fa fa-sort-numeric-asc text-warning', title : 'Sắp xếp tăng dần'},
    ]

    element.children('i').removeClass();
    var dataNextShow = null;

    switch (data_sort_index) {
        case '1':
            dataNextShow = dataArray[0];
            break; 
        case '-1':
            dataNextShow = dataArray[1];
            break;
        case '0':
            dataNextShow = dataArray[2];
            break; 
        default:
            break;
    }
    if(dataNextShow){
        element.attr('title', dataNextShow.title);
        element.attr('data_sort', dataNextShow.data);
    
        if(_.includes(['Number', 'Date'], element.attr('data_instance'))){
            element.children('i').addClass(dataNextShow.numberClass);
        }else{
            element.children('i').addClass(dataNextShow.stringClass);
        }
    }
}