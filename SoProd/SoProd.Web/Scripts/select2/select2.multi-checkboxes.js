/**
 * jQuery Select2 Multi checkboxes
 * - allow to select multi values via normal dropdown control
 * 
 * author      : wasikuss
 * inspired by : https://github.com/select2/select2/issues/411
 * License     : MIT
 */

(function ($) {
    function IsArrayEmpty(arr) {
        return arr.length == 1 && arr[0] === "";
    }

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    function arr_sub(a1, a2) {
        var a = [], sub = [];
        var i;
        if (a1) {
            for (i = 0; i < a1.length; i++) {
                a[a1[i]] = true;
            }
        }
        if (a2) {
            for (i = 0; i < a2.length; i++) {
                if (a[a2[i]]) {
                    delete a[a2[i]];
                }
            }
        }

        for (var k in a) {
            if (a.hasOwnProperty(k)) {
                sub.push(k);
            }
        }
        return sub;
    }

    function format_data(data) {
        if (data == undefined) {
            return [];
        }
        if (data && !Array.isArray(data)) {
            return data.id && data.element && $(data.element).hasClass('checked') ? [data.id] : [];
        }
        return undefined;
    }

    function indexOf(value, array) {
        var i = 0, l = array.length;
        for (; i < l; i = i + 1) {
            if (equal(value, array[i])) return i;
        }
        return -1;
    }

    //function set_data(s2, data, format = true) {
    //    var _data = format ? format_data(data) : data;
    //    s2.selection.data("select2-data", _data);
    //    return _data;
    //}

    $.fn.extend({
        select2MultiCheckboxes: function () {
            var options = $.extend({
                placeholder: 'Choose elements',
                formatSelection: function (selected, total) {
                    return selected.length + ' > ' + total + ' total';
                },
                wrapClass: 'wrap',
            }, arguments[0]);

            this.each(function () {
                var s2 = $(this).select2({
                    msOptions: options,
                    allowClear: true,
                    minimumResultsForSearch: 0,
                    matcher: function (term, text, opt) {
                        return text.toUpperCase().indexOf(term.toUpperCase()) >= 0 || opt.parent("optgroup").attr("label").toUpperCase().indexOf(term.toUpperCase()) >= 0
                    },
                    placeholder: options.placeholder,
                    closeOnSelect: false,
                    formatSelection: function () {
                        var select2 = this.element.data('select2');
                        var options = $('option', this.element);
                        var total = options.length - 1;

                        var data = select2.data();
                        data = data && data.length ? data.filter(x => x) : data;

                        var _options = options.filter((x, y) => { return data && data.length > 0 && data.indexOf($(y).attr('value')) > -1; })
                        var _data = [];
                        $(_options).each(function () {
                            var countOpt = $(this).closest('optGroup').find('option').length;
                            var countChecked = $(this).closest('optGroup').find('option.checked').length;
                            if (countOpt == countChecked) {
                                _data.push("<b>" + $(this).closest('optGroup').attr('label') + "</b>");
                            }
                            else {
                                _data.push($(this).text());
                            }
                        });
                        _data = _data.filter(onlyUnique);
                        var __data = _data.map((x, y) => { return { text: x } });
                        return this.msOptions.formatSelection(__data, total);
                    },
                    formatResult: function (item) {
                        var select2 = this.element.data('select2');
                        var classes = [this.msOptions.wrapClass];
                        if ($(item.element[0]).hasClass('checked')) {
                            classes.push('checked');
                        }

                        var elem = $('<div>').text(item.text).addClass(classes.join(' '));
                        if (item.element[0].localName == 'optgroup') {

                            if ($(item.element).children().length == $(item.element).children('.checked').length) {
                                $(item.element).addClass('checked');
                                $(elem).addClass('checked');
                            }

                            $(elem).click(function () {
                                //select all bellow
                                if (!$(item.element).hasClass('checked')) {
                                    $(item.element).addClass('checked');
                                    $(item.element).find('option').addClass('checked');
                                    $(item.element).find('option').prop('selected', true);
                                    $(this).parent().parent().find('.wrap').addClass('checked');
                                }
                                else {
                                    $(item.element).removeClass('checked');
                                    $(item.element).find('option').removeClass('checked');
                                    $(item.element).find('option').prop('selected', false);
                                    $(this).parent().parent().find('.wrap').removeClass('checked');
                                }
                                select2.onSelect();
                            });
                        }
                        if (item.element[0].localName == 'option') {
                            var parent = $(item.element).parent();
                            if (parent && parent.length && parent[0].localName === 'optgroup') {
                                $(elem).click(function () {
                                    if (!$(item.element).hasClass('checked') && $(item.element).parent().hasClass('checked')) {
                                        $(item.element).parent().removeClass('checked');
                                        $(this).closest('.select2-result-with-children').find('> .select2-result-label .wrap').removeClass('checked');
                                    }
                                    if ($(item.element).hasClass('checked') && !$(item.element).parent().hasClass('checked')) {
                                        if ($(item.element).parent().children().length == $(item.element).parent().children('.checked').length) {
                                            $(item.element).parent().addClass('checked');
                                            $(this).closest('.select2-result-with-children').find('> .select2-result-label .wrap').addClass('checked');
                                        }
                                    }
                                });
                            }
                        }

                        return elem;
                    }
                }).data('select2');
                s2.onSelect = function (data, options) {
                    if (data && options) {
                        $(data.element[0]).toggleClass('checked');
                        var $t = $(options.target);
                        if (!$t.hasClass(this.opts.msOptions.wrapClass)) {
                            $t = $('.' + this.opts.msOptions.wrapClass, $t);
                        }
                        $t.toggleClass('checked');
                    }

                    var oldData = this.selection.data('select2-data');

                    var data = [];
                    $('.checked', this.select).each(function () {
                        data.push($(this).val());
                    });

                    var removed = arr_sub(oldData ? oldData : [], data ? data : []);

                    var container = this.selection.find('.select2-chosen');
                    container.empty();

                    if (data.length > 0) {
                        this.selection.data('select2-data', data);
                        this.triggerChange({ added: data, removed: removed });
                        container.append(this.opts.formatSelection());
                        this.selection.removeClass('select2-default');

                    } else {
                        data = null;
                        this.selection.data('select2-data', data);
                        this.triggerChange({ added: data, removed: removed });
                        container.append(this.getPlaceholder());
                        this.selection.addClass('select2-default');
                    }

                    return;
                };
                s2.updateSelection = function (data) {
                    // ------  select2.js (multiple implementation) ------
                    var ids = [], filtered = [], self = this;
                    // filter out duplicates
                    $(data).each(function () {
                        if (indexOf(self.id(this), ids) < 0) {
                            ids.push(self.id(this));
                            filtered.push(this);
                        }
                    });
                    data = filtered;
                    this.selection.find(".select2-search-choice").remove();
                    //$(data).each(function () {
                    //    self.addSelectedChoice(this);
                    //});
                    self.postprocessResults();

                    // ------ select2.js (single implementation) ------
                    //var container = this.selection.find(".select2-chosen"), formatted, cssClass;
                    //container.empty();
                    //if (data !== null) {
                    //    formatted = this.opts.formatSelection(data, container, this.opts.escapeMarkup);
                    //}
                    //if (formatted !== undefined) {
                    //    container.append(formatted);
                    //}
                    //cssClass = this.opts.formatSelectionCssClass(data, container);
                    //if (cssClass !== undefined) {
                    //    container.addClass(cssClass);
                    //}
                    //this.selection.removeClass("select2-default");
                    //if (this.opts.allowClear && this.getPlaceholder() !== undefined) {
                    //    this.container.addClass("select2-allowclear");
                    //}

                    return;
                };
                s2.data = (function (originalData) {
                    return function (arr) {
                        if (arguments.length == 1) {
                            var selected = {};
                            $(arr).each(function () {
                                selected[this.id] = true;
                            });
                            this.select.find('option').each(function () {
                                var $this = $(this);
                                $this[selected[$this.val()] === true ? 'addClass' : 'removeClass']('checked');
                            });
                        }
                        else {
                            var data = this.selection.data("select2-data");
                            var _data = format_data(data);
                            if (_data !== undefined)
                                data = _data;

                            if (data && data.length && this.opts.allowClear && !this.container.hasClass('select2-allowclear')) {
                                this.container.addClass('select2-allowclear');
                            }
                            else if (!data || !data.length) {
                                this.container.removeClass('select2-allowclear');
                            }

                            this.selection.data("select2-data", data);
                            return data;
                        }
                        return originalData.apply(this, arguments);
                    };
                })(s2.data);
                s2.val = (function (originalData) {
                    return function (arr) {
                        if (arguments.length === 0) {
                            var data = [];
                            var _data = this.data();
                            _data = _data && _data.length ? _data.filter(x => x) : _data;
                            $(_data).each(function () {
                                data.push(this.toString());
                            });
                            return data;
                        }
                        else {
                            var oldData = this.selection.data('select2-data');

                            // prevent null/empty to Array empty
                            if (arr === "" || arr == undefined || IsArrayEmpty(arr))
                                arr = [];

                            // force value to be an Array
                            if (!Array.isArray(arr)) {
                                arr = (arr + '').split(',');
                            }
                            // force all values in array to be string
                            else {
                                arr = arr.map(x => typeof myVar === 'string' ? x : x + '');
                            }

                            this.selection.data('select2-data', arr);
                            this.selection.removeClass('select2-default');

                            var removed = arr_sub(oldData ? oldData : [], arr);
                            this.triggerChange({ added: arr, removed: removed });

                            var container = this.selection.find('.select2-chosen');
                            container.empty().append(this.opts.formatSelection());
                            return $(this.select);
                        }
                    };
                })(s2.val);
                s2.select.on({
                    change: function (event) {
                        var i;
                        var select = this.nodeName == 'SELECT' ? this : (this.select ? this.select : this);
                        if (event.removed) {
                            for (i = 0; i < event.removed.length; i++) {
                                $('option[value="' + event.removed[i] + '"]', select).removeClass('checked');
                                $('option[value="' + event.removed[i] + '"]', select).prop('selected', false);
                            }
                        }
                        if (event.added) {
                            for (i = 0; i < event.added.length; i++) {
                                $('option[value="' + event.added[i] + '"]', select).addClass('checked');
                                $('option[value="' + event.added[i] + '"]', select).prop('selected', true);
                            }
                        }
                    }
                });
            });
        }
    });
})(jQuery);