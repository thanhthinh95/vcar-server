var eventPage = function($) {
    function bindEventClick() {
        $(document).on('click', '#add_new_image', function (e) {
            e.preventDefault();
            $("#upload_image").click();
        })

        $(document).on('change', '#upload_image', function name(e) {
            console.log('dang co su kien thay doi update image');
            
            if(this.files){
                let checkSize = true;
                let sumSize = 0;
                var formData = new FormData();

                _.forEach(this.files, function (file) {
                    formData.append('image_files', file);
                    var size = Number(((file.size / 1024) / 1024).toFixed(4));
                    sumSize += size;
                    if (size > 5) { // MB
                        checkSize =  false;
                    }
                })

                if(checkSize && sumSize < 20){
                    _AjaxFormData('car/action/upload_image', 'POST', formData, function(resp) {
                        if(resp.code == 200){
                            _.forEach(resp.data.urls, function (url) {
                                var html = '<div class="preview-image">' +
                                    '<input type="hidden" name="imageUrl" value="'+ url +'">' +
                                    '<div class="image-cancel">x</div>' +
                                    '<div class="image-zone"><img src="' + url + '"></div>' +
                                    '</div>';
                               $(".preview-images-zone").append(html);
                            })

                            $("#upload_image").val("");
                        }else {
                            _DialogError(resp.message);
                        }
                    })
                }else{
                    _DialogError('Số lượng 1 file phải nhỏ hơn 5MB, tổng dung lượng file phải nhỏ hơn 20MB');
                }
            }
        })

        $(document).on('click', '.image-cancel', function() {
            let preview_image = $(this).parent();
            let img = preview_image.find('img')[0];
            let src = img.src;

            if(src){
                _AjaxObject('car/action/delete_image', 'POST', {url : src}, function(resp) {
                    if(resp.code == 200){
                        preview_image.remove();            
                    }else {
                        _DialogError(resp.message);
                    }
                })
            }
        });


        $(document).on('click', '.btn_remove_point', function (e) {
            var tr = $(this).parents('tr');
            _DialogQuestion('Bạn có chắc chắn ?', 'Điểm dừng này sẽ bị loại bỏ ra khỏi trặng đường của xe.', function () {
                tr.remove();
                $('#sum_stop_point').text('Số điểm dừng: ' + $('#table_timeline tbody').children('tr').length);
            })
        })

        $(document).on('click', '#add_new_point_stop', function (e) {
            let pointObj =  _.find(pointStop, {_id : $('#pointStop').val()});
            if(pointObj){
                let pointStop_select = $('#table_timeline tbody').children('tr');
                let check = true;
                _.forEach(pointStop_select, function (item) {
                    let id_select = $(item).attr('data_id');
                    if(_.isEqual(id_select, pointObj._id.toString())){
                        check = false;
                    }
                })

                if(!check){
                    _DialogError('Điểm dừng này đã được thêm trước đó, hãy chọn một điểm khác')
                }else{
                    let html = '';
                    html += '<tr data_id="'+ pointObj._id +'">';
                    html += '<input type="hidden" name="pointStop" value="'+ pointObj._id +'">';
                    html += '<td class="td_modal">';
                    html += '<img class="img_timeline" src="img/timeline.png">';
                    html += '<label class="">'+ pointObj.name +'</label>';
                    html += '<span class="align-middle my-auto float-right pt-2">';
                    html += '<button class="btn btn-defauft btn_remove_point">';
                    html += '<i class="fa fa-lg fa-minus-circle text-danger" aria-hidden="true"';
                    html += 'data-toggle="tooltip" title="Loại bỏ điểm dừng"></i>';
                    html += '</button>';
                    html += '</span>';
                    html += '</td>';
                    html += '</tr>';
    
                    $('#table_timeline tbody').append(html);
                    $('.custom_overflow').scrollTop(1000);
                    $('#sum_stop_point').text('Số điểm dừng: ' + $('#table_timeline tbody').children('tr').length);
                }

                $('#pointStop').val('');
                $('#pointStop').selectpicker('refresh')
            }else {
                _DialogError('Hãy chọn một điểm dừng');
            }
        })

        $(document).on('submit', '#form_data', function (e) {
            e.preventDefault();
            var objData = _createObjectInForm('#form_data');
            console.log(objData);

            _AjaxObject('car', 'PUT', objData, function (resp) {
                if(resp.code == 200){
                    _DialogSuccess('Cập nhật xe thành công', function () {
                        _loadPageChild('car');
                    })
                }else {
                    _DialogError(resp.message);
                }
            })
        })
    }

    

    return {
        init : function () {
            console.log('dang thuc hien init su kien car_edit');
            $('select').selectpicker({
                countSelectedText : '{0} mục đã chọn',
            });

            $('#timeonly').datetimepicker({
                format: 'HH:mm',
                use24hours: true
            });
            
            $( ".preview-images-zone" ).sortable();
            $('select').selectpicker('refresh');
            $('#table_timeline tbody').sortable();
            bindEventClick();
        },
        uncut : function (){
            console.log('dang thuc hien uncut su kien car_edit');

            $(document).off('click', '.image-cancel');
            $(document).off('click', '#add_new_image');
            $(document).off('change', '#upload_image');
            $(document).off('click', '#upload_image');
            $(document).off('click', '#add_new_point_stop');
            $(document).off('click', '.btn_remove_point');   
            $(document).off('submit', '#form_data');
        }
    }
}(jQuery)


