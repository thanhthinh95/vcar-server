var eventPage = function($) {
    function bindEventClick() { 
        $(document).on('click',  '#expandAll', function () {
            $('.dd').nestable('expandAll');
        })

        $(document).on('click',  '#collapseAll', function () {
            $('.dd').nestable('collapseAll');
        })
    }



    function bindBodyTable() {
        
        $('#table_data tbody').empty();

        _.forEach(_menus, function (menu) {

            var html = '<tr draggable="true" ondragstart="drag(event)" >';
            html +=  '<td class="text-center align-middle" >' +
                    (menu.icon ?  '<i class="'+ menu.icon +'" aria-hidden="true"></i>' : '')
                    '</td>';

            html += '<td><span>' + menu.name + '</span></td>';
            html += '<td><span>' + (menu.path ? menu.path : "") + '</span></td>';
            html += '<td class="text-center align-middle"><span class="">' +
                    '<i class="fa fa-pencil-square-o text-primary pr-3" aria-hidden="true" data-toggle="tooltip" title="Chỉnh sửa"></i>' + 
                    '<i class="fa fa-minus-square text-danger" aria-hidden="true" data-toggle="tooltip" title="Loại bỏ"></i>' +
                    '</span></td>';
                             
            html += '</tr>'
            $('#table_data tbody').append(html);


            
        })

        // $('#my-sortable').sortable();

        // $('#table_data tbody').sortable({
        //     connectWith: '#table_data tbody'
        // }).disableSelection();
    }

    var updateOutput = function(e) {
        var list   = e.length ? e : $(e.target);
        console.log('list', list);
        
        var output = list.data('output');
        console.log('output', output);
            
        if (window.JSON) {
            var a = window.JSON.stringify(list.nestable('serialize'));
            console.log(a);
        } else {
            output.val('JSON browser support required for this demo.');
        }
    };


    return {
        init : function () {
            console.log('dang thuc hien init su kien menu');
            $('select').selectpicker();
            $('#nestable').nestable({
                group: 1
            })
            .on('change', updateOutput);
                    
            bindEventClick();
            // bindBodyTable();

        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien menu');
            
        }
    }
}(jQuery)