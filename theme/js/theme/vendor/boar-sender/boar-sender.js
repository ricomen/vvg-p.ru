$(document).ready(function () {
    var dropArea = $('.droparea'),
        dropAreaAttachments = $('.droparea__attachments'),
        err = 0,
        maxFileSize = 1000,
        maxFilesSize = 5000,
        classDragover = 'droparea_dragover',
        dropAreaInput = $('input[type=file]', dropArea),
        validTypes = ['jpg', 'png', 'jpeg'];

    function fileTypeCheck(files, validTypes) {
        var filesExt = [];
        // console.log(files.length);
        for (var i = 0; i < files.length; i++) {
            filesExt.push(files[i].name.substr(files[i].name.lastIndexOf('.') + 1).toLowerCase());
        }
        unicFilesExt = filesExt.filter(function (item, pos) {
            return filesExt.indexOf(item) == pos;
        });
        // console.log('validTypes: ' + validTypes);
        // console.log('filesExt: ' + filesExt);
        // console.log('unicFilesExt: ' + unicFilesExt);
        var invalidTypes = unicFilesExt.filter(n => validTypes.indexOf(n) === -1);
        if (invalidTypes.length > 0) {
            // console.log('ERR: file types invalid ');
            err = 0;
        } else {
            // console.log('OK: file types valid ');
            err = 1;
        }
        return err;
    }

    function fileSizeCheck(files, maxFileSize, maxFilesSize) {
        var fileSize = 0,
            filesSize = 0;
        // console.log(files.length);
        for (var i = 0; i < files.length; i++) {
            fileSize = files[i].size / 1000;
            if (fileSize > maxFileSize) {
                //console.log('ERR: file size: ' + fileSize);
                err = 0;
                break;
            } else {
                //console.log('OK: file size: ' + fileSize);
                err = 1;
            }
            filesSize += fileSize;
            if (filesSize > maxFilesSize) {
                //console.log('ERR: max files size: ' + filesSize);
                err = 0;
                break;
            } else {
                //console.log('OK: max files size: ' + filesSize);
            }
        }

        return err;
    }

    function addAttachentsToDropArea(files) {
        dropAreaAttachments.empty();
        if (!fileSizeCheck(files, 1200, 30000)) {
            $('.input-type-file__error').text('Максимальный размер файла 3мб. Максимальный размер всех файлов 30мб.');
        } else if (!fileTypeCheck(files, validTypes)) {
            $('.input-type-file__error').text('Вы можете загрузить только jpg и png');
        } else {
            $('.input-type-file__error').text('');
            for (i = 0; i < files.length; i++) {
                dropAreaAttachments.append(
                    '<div class="input-type-file__attachment">' +
                    '<div class="input-type-file__attachment-name">' + files[i].name + '</div>' +
                    '<div class="input-type-file__attachment-remove"></div>' +
                    '</div>');
            }
        }


    }

    function ajaxMsg(msg_text) {
        $('.ajax-form-popup-text').text(msg_text);
        $('.ajax-form-popup-overlay, .ajax-form-popup').show();
    }

    function createMsgWindow() {
        $('body').append('<div class="ajax-form-popup-overlay"></div>');
        $('body').append('<div class="ajax-form-popup"></div>');
        $('.ajax-form-popup').append('<div class="ajax-form-popup-close">+</div>');
        $('.ajax-form-popup').append('<div class="ajax-form-popup-text"></div>');
    }

    dropArea.bind('dragover', function () {
        $(this).addClass(classDragover);
    });
    dropArea.bind('dragleave', function () {
        $(this).removeClass(classDragover);
    });
    dropAreaInput.on('change', function () {
        var files = dropAreaInput[0].files;
        addAttachentsToDropArea(files);
    });


    $(document).on('click', '.ajax-form-popup-overlay, .ajax-form-popup-close', function () {
        $('.ajax-form-popup-overlay, .ajax-form-popup').hide();
    });
    createMsgWindow();
    $(".boar-sender").submit(function (files) {
        var form = $(this);
        var formData = new FormData($(this)[0]);
        var i = 0;
        var inputs = form.find('input[type=text], textarea, select');
        var requireds_arr = [];
        var ruNames_arr = [];
        inputs.each(function () {
            ruNames_arr.push($(this).data('ru-name'));
            requireds_arr.push($(this).data('required'));
        });
        formData.append('ruNames ', JSON.stringify(ruNames_arr));
        formData.append('requireds ', JSON.stringify(requireds_arr));
        //formData.append('formName', formName);
        //formData.append('ajaxID', ajaxID);
        $.ajax({
            type: 'POST',
            url: '/theme/vendor/boar-sender/boar-sender.php',
            dataType: 'json',
            processData: false,
            contentType: false,
            data: formData,
            beforeSend: function (xhr) {
                var required = $(form).find('input[data-required=1], textarea[data-required=1], select[data-required=1]');
                required.each(function () {
                    if ($(this).val() === '' || $(this).val() === undefined || $(this).val() === null) {
                        $(this).css('box-shadow', 'inset 0 0 2px 1px red');
                        xhr.abort();
                    } else {
                        $(this).css('box-shadow', 'initial');
                    }
                });
                //console.log(files);
                if (files.length > 0) {
                    if (fileSizeCheck(files, maxFileSize, maxFilesSize) && fileTypeCheck(files, validTypes)) {
                        //console.log('attached files, fileSizeCheck and fileTypeCheck OK');
                        // xhr.abort();
                    } else {
                        //console.log('no files attached');
                        xhr.abort();
                    }
                } else {
                    // console.log('no files attached');
                }
            },
            success: function (data) {
                var response = data;
                if (response['error'] === 'invalid') {
                    ajaxMsg('Подтвердите что Вы не робот!');
                    $('.popup, .popup-overlay').hide();
                    $('.overlay').fadeIn();
                    //console.log('response error ' + response['error']);
                } else if (response['error'] === 'error') {
                    ajaxMsg('Ошибка отправки. Повторите позже.');
                    $('.ajax-form-popup, .ajax-form-popup-overlay').hide();
                    $('.overlay').fadeIn();
                } else if (response['error'] === 'ok') {
                    ajaxMsg('Ваше сообщение успешно отправлено!');
                    $('.popup, .popup-overlay').hide();
                    $('.overlay').fadeIn();
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(xhr.status);
                alert(thrownError);
                console.log(xhr.status);
                console.log(thrownError);
            }
        });
        return false;
    });
});