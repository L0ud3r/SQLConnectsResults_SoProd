(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}(function ($) {
    $.extend(true, $.summernote.lang, {
        'en-US': {
            file: {
                file: 'File',
                btn: 'File',
                insert: 'Insert File',
                selectFromFiles: 'Select from files',
                url: 'File URL',
                maximumFileSize: 'Maximum file size',
                maximumFileSizeError: 'Maximum file size exceeded.'
            }
        }
    });

    $.extend($.summernote.options, {
        file: {
            icon: '<i class="fa fa-file"/>'
        },
        callbacks: {
            onFileUpload: null,
            onFileUploadError: null,
            onFileLinkInsert: null
        }
    });

    $.extend($.summernote.plugins, {
        'file': function (context) {
            let self = this,
                ui = $.summernote.ui,
                $note = context.layoutInfo.note,
                $editor = context.layoutInfo.editor,
                $editable = context.layoutInfo.editable,
                $toolbar = context.layoutInfo.toolbar,
                options = context.options,
                lang = options.langInfo;

            context.memo('button.file', function () {
                let button = ui.button({
                    contents: options.file.icon,
                    tooltip: lang.file.file,
                    click: function (e) {
                        context.invoke('file.show');
                    }
                });
                return button.render();
            });

            this.initialize = function () {
                let $container = options.dialogsInBody ? $(document.body) : $editor;

                let fileLimitation = '';
                if (options.maximumFileSize) {
                    let unit = Math.floor(Math.log(options.maximumFileSize) / Math.log(1024));
                    let readableSize = (options.maximumFileSize / Math.pow(1024, unit)).toFixed(2) * 1 +
                        ' ' + ' KMGTP'[unit] + 'B';
                    fileLimitation = '<small>' + lang.file.maximumFileSize + ' : ' + readableSize + '</small>';
                }

                let body = [
                    '<div class="form-group note-form-group note-group-select-from-files">',
                    '<label class="note-form-label">' + lang.file.selectFromFiles + '</label>',
                    '<input class="note-file-input note-form-control note-input" ',
                    ' type="file" name="files" accept="*/*">',
                    '</div>',
                    fileLimitation,
                    '<div class="form-group note-group-image-url" style="overflow:auto;">',
                    '<label class="note-form-label">' + lang.file.url + '</label>',
                    '<input class="note-file-url form-control note-form-control note-input ',
                    ' col-md-12" type="text">',
                    '</div>'
                ].join('');

                let footer = '<button href="#" class="btn btn-primary note-file-btn">' + lang.file.insert + '</button>';

                this.$dialog = ui.dialog({
                    title: lang.file.insert,
                    body: body,
                    footer: footer
                }).render().appendTo($container);
            };

            this.destroy = function () {
                ui.hideDialog(this.$dialog);
                this.$dialog.remove();
            };

            this.bindEnterKey = function ($input, $btn) {
                $input.on('keypress', function (event) {
                    if (event.keyCode === 13)
                        $btn.trigger('click');
                });
            };

            this.bindLabels = function () {
                self.$dialog.find('.form-control:first').focus().select();
                self.$dialog.find('label').on('click', function () {
                    $(this).parent().find('.form-control:first').focus();
                });
            };

            this.readFileAsDataURL = function (file) {
                return $.Deferred(function (deferred) {
                    $.extend(new FileReader(), {
                        onload: function (e) {
                            let dataURL = e.target.result;
                            deferred.resolve(dataURL);
                        },
                        onerror: function (err) {
                            deferred.reject(err);
                        }
                    }).readAsDataURL(file);
                }).promise();
            };

            this.createFile = function (url,filename) {
                $file = $(`<a href="` + url + `" target="_blank" contenteditable="false" class="btn btn-default btn-sm"><i contenteditable="false" class="fa fa-file"></i>  <span contenteditable="` + (filename != "" && filename != undefined ? 'false' : 'true') + `">` + (filename != "" && filename != undefined ? filename : 'File Name') + `</span></a>`);
                return $file;
            };

            this.insertFile = function (src, param) {
                let $file = self.createFile(src, param);

                if (!$file) {
                    context.triggerEvent('file.upload.error');
                }

                context.invoke('editor.beforeCommand');

                if (typeof param === 'string') {
                    $file.attr('data-filename', param);
                }

                $file.show();
                context.invoke('editor.insertNode', $file[0]);

                context.invoke('editor.afterCommand');
            };

            this.insertFilesAsDataURL = function (files) {
                $.each(files, function (idx, file) {
                    let filename = file.name;
                    if (options.maximumFileSize && options.maximumFileSize < file.size) {
                        context.triggerEvent('file.upload.error', lang.file.maximumFileSizeError);
                    } else {
                        self.readFileAsDataURL(file).then(function (dataURL) {
                            return self.insertFile(dataURL, filename);
                        }).fail(function () {
                            context.triggerEvent('file.upload.error');
                        });
                    }
                });
            };

            this.show = function (data) {
                context.invoke('editor.saveRange');
                this.showFileDialog().then(function (data) {
                    ui.hideDialog(self.$dialog);
                    context.invoke('editor.restoreRange');

                    if (typeof data === 'string') {
                        if (options.callbacks.onFileLinkInsert) {
                            context.triggerEvent('file.link.insert', data);
                        } else {
                            self.insertFile(data);
                        }
                    } else {
                        if (options.callbacks.onFileUpload) {
                            context.triggerEvent('file.upload', data);
                        } else {
                            self.insertFilesAsDataURL(data);
                        }
                    }
                }).fail(function () {
                    context.invoke('editor.restoreRange');
                });
            };
            this.showFileDialog = function () {
                return $.Deferred(function (deferred) {
                    let $fileInput = self.$dialog.find('.note-file-input');
                    let $fileUrl = self.$dialog.find('.note-file-url');
                    let $fileBtn = self.$dialog.find('.note-file-btn');

                    ui.onDialogShown(self.$dialog, function () {
                        context.triggerEvent('dialog.shown');
                        $fileInput.replaceWith($fileInput.clone().on('change', function (event) {
                            deferred.resolve(event.target.files || event.target.value);
                        }).val(''));

                        $fileBtn.click(function (e) {
                            e.preventDefault();
                            deferred.resolve($fileUrl.val());
                        });

                        $fileUrl.on('keyup paste', function () {
                            let url = $fileUrl.val();
                            ui.toggleBtn($fileBtn, url);
                        }).val('');

                        self.bindEnterKey($fileUrl, $fileBtn);
                        self.bindLabels();
                    });
                    ui.onDialogHidden(self.$dialog, function () {
                        $fileInput.off('change');
                        $fileUrl.off('keyup paste keypress');
                        $fileBtn.off('click');

                        if (deferred.state() === 'pending')
                            deferred.reject();
                    });
                    ui.showDialog(self.$dialog);
                });
            };
        }
    });
}));
