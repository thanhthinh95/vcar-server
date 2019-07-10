var eventPage = function($) {
    function bindEventClick() {




    }


    function bindBodyTable() {
        
        $('#table_data tbody').empty();

        _.forEach(_menus, function (menu) {
            console.log(menu);
            
            var html = '<tr>';
            html +=  '<td class="text-center align-middle">' +
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

        $('#table_data tbody').sortable({
            connectWith: '#table_data tbody'
        }).disableSelection();

        


    }


    return {
        init : function () {
            console.log('dang thuc hien init su kien menu');
            $('select').selectpicker();
            // $('#table_data tbody').sortable();
            
            bindBodyTable();
            // bindEventClick();
        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien menu');
            
        }
    }
}(jQuery)


