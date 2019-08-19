var eventPage = function ($) {
    var data_floor = car_type.seatDiaGram;

    function bindEventClick() {
        $(document).on('click', '#new_floor', function (e) {
            e.preventDefault();

            numColumn = $('#numColumn').val();
            numRow = $('#numRow').val();
            if (!numColumn || !numRow) {
                _DialogError("Hãy nhập thông tin cố cột và số hàng");
            } else {
                newFloor(numColumn, numRow);
            }
        })

        $(document).on('submit', '#form_data', function (e) {
            e.preventDefault();
            if(data_floor.length == 0){
                _DialogError("Hãy thêm một sơ đồ chỗ ngồi");
            }else{
                var objData = _createObjectInForm('#form_data');
                objData.seatDiaGram = data_floor;
    
                _AjaxObject('car_type', 'PUT', objData, function (resp) {
                    if (resp.code == 200) {
                        _DialogSuccess('Cập nhật thể loại xe thành công', function () {
                            _loadPageChild('car_type');
                        })
                    } else {
                        _DialogError(resp.message);
                    }
                })
            }
           
        })

        $(document).on('click', '.non_active', function (e) {
            $(this).removeClass("non_active");
            $(this).addClass("ok_active");

            let numFloor = Number($(this).attr('numFloor'));
            let seat = $(this).text();
            data_floor[numFloor].data[seat] = '1';
            $('#numberSeat').val(Number($('#numberSeat').val()) + 1);
        })

        $(document).on('click', '.ok_active', function (e) {
            $(this).removeClass("ok_active");
            $(this).addClass("non_active");

            let numFloor = Number($(this).attr('numFloor'));
            let seat = $(this).text();
            data_floor[numFloor].data[seat] = '0';
            $('#numberSeat').val(Number($('#numberSeat').val()) -1);
        })

        $(document).on('click', '.remove_floor', function (e) {
            let numFloor = Number($(this).attr('numFloor'));
            let sumActive = 0;
            _.each(data_floor[numFloor].data, function (item) {
                if(_.isEqual(item, '1')){
                    sumActive++;
                }
            })
            $('#numberSeat').val(Number($('#numberSeat').val()) - sumActive);

            data_floor.splice(numFloor, 1);
            renderFloor();
        })

        $(document).on('click', '.add_new_row', function (e) {
            let numFloor = Number($(this).attr('numFloor'));
            var data = {};
            data_floor[numFloor].numRow = (Number(data_floor[numFloor].numRow) + 1).toString();
            for(let row = 0; row < Number(data_floor[numFloor].numRow); row++){
                for(let col = 0; col < Number(data_floor[numFloor].numColumn); col++){
                    let seat = (numFloor +  1) + mapNumber(row) + (col + 1);
                    data[seat] = data_floor[numFloor].data[seat] ? data_floor[numFloor].data[seat] : '0';
                }
            }
            data_floor[numFloor].data = data;
            renderFloor();
        })

        $(document).on('click', '.add_new_column', function (e) {
            let numFloor = Number($(this).attr('numFloor'));
            var data = {};
            data_floor[numFloor].numColumn = (Number(data_floor[numFloor].numColumn) + 1).toString();
            for(let row = 0; row < Number(data_floor[numFloor].numRow); row++){
                for(let col = 0; col < Number(data_floor[numFloor].numColumn); col++){
                    let seat = (numFloor +  1) + mapNumber(row) + (col + 1);
                    data[seat] = data_floor[numFloor].data[seat] ? data_floor[numFloor].data[seat] : '0';
                }
            }
            data_floor[numFloor].data = data;
            renderFloor();
        })
    }

    function newFloor(numColumn, numRow) {
        var seatFloor = {};
        seatFloor.numRow = numRow;
        seatFloor.numColumn = numColumn;
        seatFloor.data = {};

        for (let row = 0; row < numRow; row++) {
            for (let col = 0; col < numColumn; col++) {
                var seat = (data_floor.length + 1) + mapNumber(row) + (col + 1)
                seatFloor.data[seat] = '0';
            }
        }

        data_floor.push(seatFloor);
        renderFloor();
    }

    function renderFloor() {
        $('#diagram_floor').html('');
        _.each(data_floor, function (floor, index) {
            let html = '';

            html += '<div class="row pt-2">'
            html += '<div class="col col-lg-10 col-md-10 col-sm-10">'
            html += '<b>Tầng ' + (index + 1) + '</b>'
            html += '</div>'

            html += '<div class="col col-lg-2 col-md-2 col-sm-2 p-0 pl-5">'
            html += '<span><button class="btn add_new_column" style="width: 20px" numFloor="'+ index +'"><i class="fa fa-arrows-h text-primary"'
            html += 'aria-hidden="true" data-toggle="tooltip"'
            html += 'title="Thêm cột mới"></i></button></span>'

            html += '<span><button class="btn add_new_row" style="width: 20px" numFloor="'+ index +'"><i class="fa fa-arrows-v text-primary"'
            html += 'aria-hidden="true" data-toggle="tooltip"'
            html += 'title="Thêm hàng mới"></i></button></span>'

            if(index == data_floor.length - 1){//neu la tang cuoi cung thi hien thi nut loai bo
                html += '<span><button class="btn remove_floor" style="width: 20px" numFloor="'+ index +'"><i class="fa fa-lg fa-minus-circle text-danger"'
                html += 'aria-hidden="true" data-toggle="tooltip"'
                html += 'title="Loại bỏ tầng"></i></button></span>'
            }

            html += '</div>'


            html += '<table class="seatDiaGram" numFloor="' + (index + 1) + '">'
            html += '<tbody>'

           

            for (let row = 0; row < floor.numRow; row++) {
                html += '<tr>'
                for (let col = 0; col < floor.numColumn; col++) {
                    let seat = (index + 1) + mapNumber(row) + (col + 1);
                    html += '<td>'
                    html += '<span class="btn '+ (floor.data[seat] == '0' ? 'non_active' : 'ok_active') +'" '
                    html += 'numFloor="'+ index +'" '
                    html += '>' + seat + '</span>'
                    html += '</td>'
                }
                html += '</tr>'
            }

            html += '</tbody>'
            html += '</table>'
            html += '</div>'
            $('#diagram_floor').append(html);
        })
    }


    function mapNumber(number) {
        if (!_.isNumber) return null;
        switch (number) {
            case 0:
                return 'A';
            case 1:
                return 'B';
            case 2:
                return 'C';
            case 3:
                return 'D';
            case 4:
                return 'E';
            case 5:
                return 'F';
            case 6:
                return 'G';
            case 7:
                return 'H';
            case 8:
                return 'I';
            case 9:
                return 'J';
            case 10:
                return 'K';
            case 11:
                return 'L';
            case 12:
                return 'M';
            case 13:
                return 'N';
            case 14:
                return 'O';
            case 15:
                return 'P';
            case 16:
                return 'Q';
            case 17:
                return 'R';
            case 18:
                return 'S';
            case 19:
                return 'T';
            case 20:
                return 'U';
            case 21:
                return 'V';
            case 22:
                return 'W';
            case 23:
                return 'X';
            case 24:
                return 'Y';
            case 25:
                return 'Z';

            default:
                return null;
        }


    }

    return {
        init: function () {
            console.log('dang thuc hien init su kien car_type_edit');
            $('select').selectpicker('refresh');

            renderFloor();
            bindEventClick();
        },
        uncut: function () {
            console.log('dang thuc hien uncut su kien car_type_edit');
            $(document).off('submit', '#form_data');
            $(document).off('click', '#new_floor');
            $(document).off('click', '.non_active');
            $(document).off('click', '.ok_active');
            $(document).off('click', '.add_new_row');
            $(document).off('click', '.add_new_column');
            $(document).off('click', '.remove_floor');
        }
    }
}(jQuery)


