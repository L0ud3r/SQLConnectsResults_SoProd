/*prototypes*/
(function (factory) { if (typeof define === 'function' && define.amd) { define(['jquery'], factory); } else { factory(window.jQuery); } }(function ($) { $.fn.numeric = function (config, callback) { if (typeof config === "boolean") { config = { decimal: config, negative: true, decimalPlaces: -1 } } config = config || {}; if (typeof config.negative == "undefined") { config.negative = true } var decimal = config.decimal === false ? "" : config.decimal || "."; var negative = config.negative === true ? true : false; var decimalPlaces = typeof config.decimalPlaces == "undefined" ? -1 : config.decimalPlaces; callback = typeof callback == "function" ? callback : function () { }; return this.data("numeric.decimal", decimal).data("numeric.negative", negative).data("numeric.callback", callback).data("numeric.decimalPlaces", decimalPlaces).keypress($.fn.numeric.keypress).keyup($.fn.numeric.keyup).blur($.fn.numeric.blur) }; $.fn.numeric.keypress = function (e) { var decimal = $.data(this, "numeric.decimal"); var negative = $.data(this, "numeric.negative"); var decimalPlaces = $.data(this, "numeric.decimalPlaces"); var key = e.charCode ? e.charCode : e.keyCode ? e.keyCode : 0; if (key == 13 && this.nodeName.toLowerCase() == "input") { return true } else if (key == 13) { return false } var allow = false; if (e.ctrlKey && key == 97 || e.ctrlKey && key == 65) { return true } if (e.ctrlKey && key == 120 || e.ctrlKey && key == 88) { return true } if (e.ctrlKey && key == 99 || e.ctrlKey && key == 67) { return true } if (e.ctrlKey && key == 122 || e.ctrlKey && key == 90) { return true } if (e.ctrlKey && key == 118 || e.ctrlKey && key == 86 || e.shiftKey && key == 45) { return true } if (key < 48 || key > 57) { var value = $(this).val(); if ($.inArray("-", value.split("")) !== 0 && negative && key == 45 && (value.length === 0 || parseInt($.fn.getSelectionStart(this), 10) === 0)) { return true } if (decimal && key == decimal.charCodeAt(0) && $.inArray(decimal, value.split("")) != -1) { allow = false } if (key != 8 && key != 9 && key != 13 && key != 35 && key != 36 && key != 37 && key != 39 && key != 46) { allow = false } else { if (typeof e.charCode != "undefined") { if (e.keyCode == e.which && e.which !== 0) { allow = true; if (e.which == 46) { allow = false } } else if (e.keyCode !== 0 && e.charCode === 0 && e.which === 0) { allow = true } } } if (decimal && key == decimal.charCodeAt(0)) { if ($.inArray(decimal, value.split("")) == -1) { allow = true } else { allow = false } } } else { allow = true; if (decimal && decimalPlaces > 0) { var dot = $.inArray(decimal, $(this).val().split("")); if (dot >= 0 && $(this).val().length > dot + decimalPlaces) { allow = false } } } return allow }; $.fn.numeric.keyup = function (e) { var val = $(this).val(); if (val && val.length > 0) { var carat = $.fn.getSelectionStart(this); var selectionEnd = $.fn.getSelectionEnd(this); var decimal = $.data(this, "numeric.decimal"); var negative = $.data(this, "numeric.negative"); var decimalPlaces = $.data(this, "numeric.decimalPlaces"); if (decimal !== "" && decimal !== null) { var dot = $.inArray(decimal, val.split("")); if (dot === 0) { this.value = "0" + val; carat++; selectionEnd++ } if (dot == 1 && val.charAt(0) == "-") { this.value = "-0" + val.substring(1); carat++; selectionEnd++ } val = this.value } var validChars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "-", decimal]; var length = val.length; for (var i = length - 1; i >= 0; i--) { var ch = val.charAt(i); if (i !== 0 && ch == "-") { val = val.substring(0, i) + val.substring(i + 1) } else if (i === 0 && !negative && ch == "-") { val = val.substring(1) } var validChar = false; for (var j = 0; j < validChars.length; j++) { if (ch == validChars[j]) { validChar = true; break } } if (!validChar || ch == " ") { val = val.substring(0, i) + val.substring(i + 1) } } var firstDecimal = $.inArray(decimal, val.split("")); if (firstDecimal > 0) { for (var k = length - 1; k > firstDecimal; k--) { var chch = val.charAt(k); if (chch == decimal) { val = val.substring(0, k) + val.substring(k + 1) } } } if (decimal && decimalPlaces > 0) { var dot = $.inArray(decimal, val.split("")); if (dot >= 0) { val = val.substring(0, dot + decimalPlaces + 1); selectionEnd = Math.min(val.length, selectionEnd) } } this.value = val; $.fn.setSelection(this, [carat, selectionEnd]) } }; $.fn.numeric.blur = function () { var decimal = $.data(this, "numeric.decimal"); var callback = $.data(this, "numeric.callback"); var negative = $.data(this, "numeric.negative"); var val = this.value; if (val !== "") { var re = new RegExp("^" + (negative ? "-?" : "") + "\\d+$|^" + (negative ? "-?" : "") + "\\d*" + decimal + "\\d+$"); if (!re.exec(val)) { callback.apply(this) } } }; $.fn.removeNumeric = function () { return this.data("numeric.decimal", null).data("numeric.negative", null).data("numeric.callback", null).data("numeric.decimalPlaces", null).unbind("keypress", $.fn.numeric.keypress).unbind("keyup", $.fn.numeric.keyup).unbind("blur", $.fn.numeric.blur) }; $.fn.getSelectionStart = function (o) { if (o.type === "number") { return undefined } else if (o.createTextRange && document.selection) { var r = document.selection.createRange().duplicate(); r.moveEnd("character", o.value.length); if (r.text == "") return o.value.length; return Math.max(0, o.value.lastIndexOf(r.text)) } else { try { return o.selectionStart } catch (e) { return 0 } } }; $.fn.getSelectionEnd = function (o) { if (o.type === "number") { return undefined } else if (o.createTextRange && document.selection) { var r = document.selection.createRange().duplicate(); r.moveStart("character", -o.value.length); return r.text.length } else return o.selectionEnd }; $.fn.setSelection = function (o, p) { if (typeof p == "number") { p = [p, p] } if (p && p.constructor == Array && p.length == 2) { if (o.type === "number") { o.focus() } else if (o.createTextRange) { var r = o.createTextRange(); r.collapse(true); r.moveStart("character", p[0]); r.moveEnd("character", p[1] - p[0]); r.select() } else { o.focus(); try { if (o.setSelectionRange) { o.setSelectionRange(p[0], p[1]) } } catch (e) { } } } } }));
try {
    //$.datepicker.regional['fr'] = {
    //    clearText: 'Effacer', clearStatus: '',
    //    closeText: 'Fermer', closeStatus: 'Fermer sans modifier',
    //    prevText: '<Préc', prevStatus: 'Voir le mois précédent',
    //    nextText: 'Suiv>', nextStatus: 'Voir le mois suivant',
    //    currentText: 'Courant', currentStatus: 'Voir le mois courant',
    //    monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    //        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
    //    monthNamesShort: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
    //        'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
    //    monthStatus: 'Voir un autre mois', yearStatus: 'Voir un autre année',
    //    weekHeader: 'Sm', weekStatus: '',
    //    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    //    dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    //    dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
    //    dayStatus: 'Utiliser DD comme premier jour de la semaine', dateStatus: 'Choisir le DD, MM d',
    //    dateFormat: 'dd/mm/yy',
    //    firstDay: 1,
    //    weekStart:1,
    //    initStatus: 'Choisir la date', isRTL: false
    //};
    //$.datepicker.setDefaults($.datepicker.regional['fr']);
} catch (e) { }
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

/*hermes*/

var parseC2C;
var outTelNumber;
function diff(obj1, obj2) {
    var ret = {};
    for (var i in obj2) {
        if (obj2[i].constructor === {}.constructor) {
            var temp = diff(obj1[i], obj2[i]);
            if (!$.isEmptyObject(temp))
                ret[i] = temp;
        } else if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
            ret[i] = obj2[i];
        }
    }
    return ret;
};
var cntrlIsPressed = false;
$(function () {
    $.fn.extend({
        setDefaultValue: function () {
            var defaultValue = $(this).attr('data-value');
            if (defaultValue && $(this).select2) {
                var values = defaultValue.split(',');
                if (values.length == 1) values = values[0];
                $(this).select2('val', values).change();
            }
        }
    });
    $.openRecord = function (recordId) {
        // THIS FUNCTION IS INITED ON LAYOUT DUO TO LANGUAGES.GET() method
    };

    $.ajaxVerifierWait = 1000;
    $.ajaxVerifierHolder = {};
    $.ajaxVerifier = function (id, callback, wait) {
        if (!$.ajaxVerifierHolder[id]) $.ajaxVerifierHolder[id] = 0;
        $.ajaxVerifierHolder[id]++;
        var verifier = $.ajaxVerifierHolder[id];
        var waiting = wait || $.ajaxVerifierWait;

        setTimeout(function () {
            if (verifier == $.ajaxVerifierHolder[id]) {
                callback(verifier);
            }
        }, waiting)
    };
    $.ajaxLogin = function (sucess, error) {
        let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=600,height=300,left=100,top=100`;
        const win = window.open('/Public/Azure', 'loginSSO', params);
        const timer = setInterval(() => {
            if (win && win.location.pathname == '/Dashboard/Index') {
                win.close();
                clearInterval(timer);
                if (sucess)
                    sucess();
                return;
            }
            if (win && win.closed) {
                clearInterval(timer);
                if (error)
                    error(null);
                return;
            }
        }, 500);
    }
    $.ajaxSSO = function (sucess, error, force) {
        if (force) {
            $.ajaxLogin(sucess, error);
        } else {
            $.ajax({
                url: '/Data/aIsSSO',
                type: 'POST',
                cache: false,
                dataType: 'json',
                processData: false, // Don't process the files
                contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                success: function (data, textStatus, jqXHR) {
                    if (data.error) {
                        $.ajaxLogin(sucess, error);
                    }
                    else {
                        sucess();
                        return;
                    }
                },
                error: function (err, jqXHR, status) {
                    error(err, jqXHR, status);
                }
            });
        }
    }
    $('<a class="showHTMLbtn btn yellow" style="position:absolute;bottom:0;left:16px"><span class="fa fa-eye"></span></a>').insertAfter(".showHTML");

    $(".showHTMLbtn").click(function (e) {
        e.preventDefault();
        e.stopPropagation();
        var text = $(this).prev().val();
        if (text.length > 1) {
            bootbox.alert(text);
        }
    });
    $(document).keydown(function (event) {
        if (event.which == "17")
            cntrlIsPressed = true;
    });

    $(document).keyup(function () {
        cntrlIsPressed = false;
    });
    $.fn.serializeFormJSON = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    $.fn.serializeFormData = function () {
        var model = new FormData(this[0]);
        //var a = this.serializeArray();
        //$.each(a, function () {
        //    model.append(this.name, this.value || '');
        //});

        return model;
    };


    /*jQuery.extend(jQuery.validator.messages, {
        required: "Ce champ est requis.",
        remote: "Veuillez remplir ce champ pour continuer.",
        email: "Veuillez entrer une adresse email valide.",
        url: "Veuillez entrer une URL valide. (avec http://)",
        date: "Veuillez entrer une date valide.",
        dateISO: "Veuillez entrer une date valide (ISO).",
        number: "Veuillez entrer un nombre valide.",
        digits: "Veuillez entrer (seulement) une valeur numérique.",
        creditcard: "Veuillez entrer un numéro de carte de crédit valide.",
        equalTo: "Veuillez entrer une nouvelle fois la même valeur.",
        accept: "Veuillez entrer une valeur avec une extension valide.",
        maxlength: jQuery.validator.format("Veuillez ne pas entrer plus de {0} caractères."),
        minlength: jQuery.validator.format("Veuillez entrer au moins {0} caractères."),
        rangelength: jQuery.validator.format("Veuillez entrer entre {0} et {1} caractères."),
        range: jQuery.validator.format("Veuillez entrer une valeur entre {0} et {1}."),
        max: jQuery.validator.format("Veuillez entrer une valeur inférieure ou égale à {0}."),
        min: jQuery.validator.format("Veuillez entrer une valeur supérieure ou égale à {0}.")
    });*/

    //
    // Pipelining function for DataTables. To be used to the `ajax` option of DataTables
    //
    $.fn.dataTable.pipeline = function (opts) {
        // Configuration options
        var conf = $.extend({
            pages: 50,     // number of pages to cache
            url: '',      // script url
            data: null,   // function or object with parameters to send to the server
            // matching how `ajax.data` works in DataTables
            method: 'GET' // Ajax HTTP method
        }, opts);

        // Private variables for storing the cache
        var cacheLower = -1;
        var cacheUpper = null;
        var cacheLastRequest = null;
        var cacheLastJson = null;

        return function (request, drawCallback, settings) {
            var ajax = false;
            var requestStart = request.start;
            var drawStart = request.start;
            var requestLength = request.length;
            var requestEnd = requestStart + requestLength;

            if (settings.clearCache) {
                // API requested that the cache be cleared
                ajax = true;
                settings.clearCache = false;
            }
            else if (cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper) {
                // outside cached data - need to make a request
                ajax = true;
            }
            else if (JSON.stringify(request.order) !== JSON.stringify(cacheLastRequest.order) ||
                JSON.stringify(request.columns) !== JSON.stringify(cacheLastRequest.columns) ||
                JSON.stringify(request.search) !== JSON.stringify(cacheLastRequest.search)
            ) {
                // properties changed (ordering, columns, searching)
                ajax = true;
            }

            // Store the request for checking next time around
            cacheLastRequest = $.extend(true, {}, request);

            if (ajax) {
                // Need data from the server
                if (requestStart < cacheLower) {
                    requestStart = requestStart - (requestLength * (conf.pages - 1));

                    if (requestStart < 0) {
                        requestStart = 0;
                    }
                }

                cacheLower = requestStart;
                cacheUpper = requestStart + (requestLength * conf.pages);

                request.start = requestStart;
                request.length = requestLength * conf.pages;

                // Provide the same `data` options as DataTables.
                if ($.isFunction(conf.data)) {
                    // As a function it is executed with the data object as an arg
                    // for manipulation. If an object is returned, it is used as the
                    // data object to submit
                    var d = conf.data(request);
                    if (d) {
                        $.extend(request, d);
                    }
                }
                else if ($.isPlainObject(conf.data)) {
                    // As an object, the data given extends the default
                    $.extend(request, conf.data);
                }

                settings.jqXHR = $.ajax({
                    "type": conf.method,
                    "url": conf.url,
                    "data": request,
                    "dataType": "json",
                    "cache": false,
                    "success": function (json) {
                        Metronic.unblockUI('body');
                        cacheLastJson = $.extend(true, {}, json);

                        if (cacheLower != drawStart) {
                            json.aaData.splice(0, drawStart - cacheLower);
                        }
                        json.aaData.splice(requestLength, json.aaData.length);

                        drawCallback(json);
                    }
                });
            }
            else {
                Metronic.unblockUI('body');
                json = $.extend(true, {}, cacheLastJson);
                json.draw = request.draw; // Update the echo for each response
                json.aaData.splice(0, requestStart - cacheLower);
                json.aaData.splice(requestLength, json.aaData.length);

                drawCallback(json);
            }
        }
    };

    // Register an API method that will empty the pipelined data, forcing an Ajax
    // fetch on the next draw (i.e. `table.clearPipeline().draw()`)
    $.fn.dataTable.Api.register('clearPipeline()', function () {
        return this.iterator('table', function (settings) {
            settings.clearCache = true;
        });
    });

    $(document).ready(function () {
        /* //$(".portlet.box .portlet-title .tooltips").hover(function () {
         //});
         $(".portlet.box .portlet-title .tooltips-4dev").each(function (index) {
             var element = $(this);
             var tooltipName = $(this).attr('tooltip-name');
             if (tooltipName != "") {
                 $.ajax({
                     method: "POST",
                     url: "/Data/aGetTooltipText",
                     data: {
                         name : tooltipName
                     }
                 }).success(function (response) {
                     if (response.error) {
                         showError("Error",response.error);
                     } else {
                         $(element).attr('data-original-title', response.data);
                     }
                 });
             }
         });
    
         
         // NO SAVE MODAL
         $("#modifyTooltipModal #EditTooltipModal").click(function () {
         var element = $(this)
         var tooltipName = $("#EditTooltipNameModal").val();
         var tooltipText = $("#EditTooltipTextModal").val();
 
         if (tooltipName != "") {
             $.ajax({
                 method: "POST",
                 url: "/Data/aEditTooltipText",
                 data: {
                     name: tooltipName,
                     text: tooltipText
                 }
             }).success(function (response) {
                 if (response.error) {
                     showError("Error", response.error);
                 } else {
                     $("#modifyTooltipModal").modal('hide');
                     $(".portlet.box .portlet-title .tooltips[tooltip-name='"+tooltipName+"']").attr('data-original-title', tooltipText);
                 }
             });
         }
         });*/
    });

    //
    // DataTables initialisation
    //
    $(document).ready(function () {
        $('#example').DataTable({
            "processing": true,
            "serverSide": true,
            "ajax": $.fn.dataTable.pipeline({
                url: 'scripts/server_processing.php',
                pages: 5 // number of pages to cache
            })
        });
    });

    $.fn.valClick2Call = function (country, value) {
        if (value == undefined) {
            var tel = $(this).oldVal();
            var code = $(this).parent().next().next().find(":selected").data("code");
            if (code + "" == 'undefined') {
                return 0;
            }
            if (country) {
                if (code == "") {
                    code = "33";
                }
                if (tel[0] == 0) {
                    tel = tel.substring(1);
                }
                return code + tel;
            } else {
                if ((code == '33' || code == '99' || code == '2258' || code == '2254' || code == '590' || code == '596') && tel[0] == 0) {
                    tel = tel.substring(1);
                    if ($(this).hasClass('countriesTelephoneNumber')) {
                        return "00" + tel;
                    }
                } else {
                    if ($(this).hasClass('countriesTelephoneNumber')) {
                        return "000" + code + tel;
                    }
                }
            }
        }
        return $(this).oldVal(value);
    };
    $.fn.textClick2Call = function (value) {
        if (value == undefined) {
            var tel = $(this).prev().text();
            var code = $(this).prev().prev().find(":selected").data("code");
            if (code + "" == 'undefined') {
                return 0;
            }
            if (code == '33') {
                if (tel[0] == 0) {
                    tel = tel.substring(1);
                }
                if ($(this).hasClass('countriesTelephoneNumber')) return "00" + tel;
            } else {
                if ($(this).hasClass('countriesTelephoneNumber')) return "000" + code + tel;
            }
        }
        return $(this).oldVal(value);
    };
    parseC2C = function (value, country) {
        try {
            if (value != "") {
                var hasCountry = false;
                var code, tel;
                if (value.indexOf('(') == 0 && value.indexOf(')') != -1) {
                    code = value.substring(1, value.indexOf(')'));
                    tel = value.substring(value.indexOf(')') + 1);
                    hasCountry = true;
                }
                if (hasCountry) {
                    if (country) {
                        if (code != '') {
                            if (tel[0] == 0) {
                                tel = tel.substring(1);
                            }
                            switch ('0' + tel.substring(0, 3)) {
                                case '0639': //0639 pour Mayotte
                                case '0692': //0692 ou 0693 pour la Réunion
                                case '0693':
                                    code = '262'; //+ 262 pour la Réunion et Mayotte,
                                    break;
                                case '0690': //0690 ou 0691 pour la Guadeloupe
                                case '0691':
                                    code = '590'; //+590 pour la Guadeloupe, Saint - Barthélemy et Saint - Martin,
                                    break;
                                case '0694': //0694 pour la Guyane
                                    code = '594'; //+594 pour la Guyane,
                                    break;
                                case '0696': //0696 ou 0697 pour la Martinique
                                case '0697':
                                    code = '596'; //+596 pour la Martinique
                                    break;
                            }
                        }
                        return code + tel;
                    } else {
                        if (code != '') {
                            if (tel[0] == 0) {
                                tel = tel.substring(1);
                            }
                            return "00" + tel;
                        }
                        return "000" + code + tel;
                    }
                } else {
                    if (country) {
                        if (value[0] == 0) {
                            value = value.substring(1);
                        }
                        return "33" + value;
                    }
                    if (value[0] == 0) {
                        value = value.substring(1);
                    }
                    return "00" + value;
                }
            }
        } catch (e) {
            return value;
        }
    };
    $(".colorPickerText").focus(function (e) {
        e.preventDefault();
    });
    $(".colorPickerText").change(function () {
        $(this).parent().colorpicker("setValue", $(this).val());
    });
    //$('.page-sidebar-menu').css('min-height', ($(window).height() - 46) + "px");
    onSidebarCollapse();
    $('.sidebar-toggler').on('click', function () {
        onSidebarCollapse();
    })
    function onSidebarCollapse() {
        setTimeout(function () {
            var elem = $('.page-sidebar.navbar-collapse');
            if ($('.page-sidebar-menu').hasClass('page-sidebar-menu-closed')) {
                elem.addClass('page-sidebar-closed');
            }
            else {
                elem.removeClass('page-sidebar-closed');
            }
        }, 100);
    }
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match
                    ;
            });
        };
    }

    // suivi interfaces binds to clear results on filters change
    $('#divfilters .divFilterKPIs input').unbind();
    $('#divfilters .divFilterKPIs input').on('change', function (e) {
        $('#getStock').empty();
    });
    $('#divfilters .divFilterKPIs select').unbind();
    $('#divfilters .divFilterKPIs select').on('change', function (e) {
        $('#getStock').empty();
    });
});

var SoProdUserSettingsDataKey = 'SOPROD_USER_SETTINGS_KEY';
/*var SoProdUserSettingsData = {};*/
var SoProdUserSettingsTimer = false;
var SoProdUserSettings = {
    _saveInterval: 60000,
    _loaded: false,
    _needSave: null,
    _getDefault: function (group, name, defaultValue) {
        var data = $.jStorage.get(SoProdUserSettingsDataKey, {});
        var value = "";
        try {
            value = data[group][name];
            if (typeof value !== 'undefined')
                return value;

        } catch (e) {
            //     console.log(e);
        }
        return defaultValue;
    },
    GetCache: function (key, defaultValue) {
        var value = $.jStorage.get(key, defaultValue);
        if (value) {
            return value;
        }
        return false;
    },
    ClearCache: function (key) {
        $.jStorage.deleteKey(key)
    },
    SetCache: function (key, value, ttl) {
        if (ttl) {
            $.jStorage.set(key, value, { TTL: ttl * 1000 });
        } else {
            $.jStorage.set(key, value);
        }
    },
    Get: function (group, name, defaultValue) {
        return SoProdUserSettings._getDefault(group, name, defaultValue);
    },
    Exists: function (group, name) {
        try {
            var value = SoProdUserSettings._getDefault(group, name, defaultValue);
            return true;
        } catch (e) {
            // console.log(e);
        }
        return false;
    },
    Set: function (group, name, value) {
        try {
            if (!SoProdUserSettings._loaded) {
                throw 'SoProdUserSettingsData not loaded yet.';
            }

            if (isHTML(value)) {
                var name = makeid(10) + "_jsbug";
                var url = window.location.href;
                var encodedValue = value.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
                    return '&#' + i.charCodeAt(0) + ';';
                });
                var error = 'Invalid value on SoProdUserSettings.Set || value ("' + encodeURI(encodedValue) + '")';
                generateIssueReport(name, 'Erreur: ' + error + '<br><br>Ligne: ' + getStackTrace(), error, url, "", "");
                return true;
            }
            var data = $.jStorage.get(SoProdUserSettingsDataKey, {});
            if (!data[group]) data[group] = {};

            var save = false;
            if (name) {
                if (value && value.constructor === Array) {
                    if (!data[group][name] || data[group][name].constructor != Array || !data[group][name] || data[group][name].equals(value) === false) {
                        save = true;
                    }
                } else if (data[group][name] != value) {
                    save = true;
                }
            }


            if (save) {
                data[group][name] = value;
                SoProdUserSettings._needSave = true;
                data.updatedAt = new Date();
                $.jStorage.set(SoProdUserSettingsDataKey, data);
            }
            return true;
        } catch (e) {
            //    console.log(e);
        }
    },
    _intervalRef: null,
    InitSaveTimer: function () {
        if (SoProdUserSettings._intervalRef) {
            try {
                clearTimeout(SoProdUserSettings._intervalRef);
            } catch (e) { }
            SoProdUserSettings._intervalRef = null;
        }
        SoProdUserSettings._intervalRef = setInterval(function () {
            if (!SoProdUserSettings._needSave) return;
            SoProdUserSettings.Save();
        }, SoProdUserSettings._saveInterval);
    },
    Save: function () {
        if (this._saveTimer) {
            try {
                clearTimeout(this._saveTimer);
            } catch (e) { }
            this._saveTimer = false;
        }
        var data = $.jStorage.get(SoProdUserSettingsDataKey, {});
        SoProdUserSettings._saveTimer = setTimeout(function () {
            $.ajaxVerifier('/User/aSaveUserSettings/', function (verifier) {
                $.ajax({
                    method: "POST",
                    url: "/User/aSaveUserSettings/",
                    data: {
                        settings: JSON.stringify(data)
                    }
                }).success(function (response) {
                    if (verifier != $.ajaxVerifierHolder['/User/aSaveUserSettings/']) return;
                    SoProdUserSettingsTimer = false;
                    SoProdUserSettings._needSave = false;
                    if (response.error) {
                        showError(response.error);
                    }

                });
            });
        }, 100);
    },
    Load: function (data) {
        var cachedData = $.jStorage.get(SoProdUserSettingsDataKey, {});
        if (!data || !data.updatedAt) {
            SoProdUserSettings._needSave = true;
        }
        else if (!cachedData.updatedAt || new Date(Date.parse(data.updatedAt)) >= new Date(Date.parse(cachedData.updatedAt))) {
            $.jStorage.set(SoProdUserSettingsDataKey, data);
        }
        else {
            SoProdUserSettings._needSave = true;
        }
        $("input[data-settings]").each(function () {
            var name = $(this).attr('data-settings');
            var group = name.split("#")[0];
            if (group == name) {
                group = "global";
            } else {
                name = name.split("#")[1];
                $(this).val(SoProdUserSettings.Get(group, name));
            }
            //$(this).val(SoProdUserSettings.Get(group, name));
        });
        $("input[data-settings]").change(function () {
            var name = $(this).attr('data-settings');
            var group = name.split("#")[0];
            if (group == name) {
                group = "global";
            } else {
                name = name.split("#")[1];
                SoProdUserSettings.Set(group, name, $(this).val());
            }
            //SoProdUserSettings.Set(group, name, $(this).val()); 
        });
        SoProdUserSettings._loaded = true;
    },
    _saveTimer: false,
}

var getStackTrace = function () {
    var obj = {};
    Error.captureStackTrace(obj, getStackTrace);
    return obj.stack;
};

function isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;

    for (var c = a.childNodes, i = c.length; i--;) {
        if (c[i].nodeType == 1) return true;
    }

    return false;
}

function initCheckbox() {
    var test = $("input[type=checkbox]:not(.toggle, .make-switch, .nature), input[type=radio]:not(.toggle, .star, .make-switch)");
    if (test.size() > 0) {
        test.each(function () {
            if ($(this).parents(".checker").size() == 0) {
                $(this).show();
                $(this).uniform();
            }
        });
    }
}
function setCheckbox(element, value) {
    $(element).prop('checked', value);
    if (value) {
        $(element).closest('div.checker').find('span').addClass('checked');
    } else {
        $(element).closest('div.checker').find('span').removeClass('checked');
    }
}
var SoProdCalendar_AjaxID = -1;
var SoProdCalendar = {
    DefaultHeader: function (ident) {
        var h;
        if (Metronic.isRTL()) {

            $(ident).removeClass("mobile");
            h = {
                right: 'title',
                center: '',
                left: 'day, agendaWeek, month,prev,next'
            };

        } else {

            $(ident).removeClass("mobile");
            h = {
                left: 'title',
                center: '',
                right: 'prev,next,month,agendaWeek,agendaDay'
            };

        }
        return h;
    },
    FixCurrentHourBorder: function (view, element) {
        if (view.name == 'agendaDay' || view.name == 'agendaWeek') {
            $(element).find(".fc-axis.fc-time.fc-widget-content").each(function () {
                if ($(this).text().trim() == theTime.hour) {
                    if (theTime.minute >= 30) {
                        $(this).closest('tr').next().css('border-top', '2px solid gold');
                    } else {
                        $(this).closest('tr').css('border-top', '2px solid gold');
                    }
                    return false;
                }
            });
        }
    },
    RemoveAllDay: function (view, element) {
        if (view.name == 'agendaDay' || view.name == 'agendaWeek') {
            $(element).find(".fc-day-grid").next().remove();
            $(element).find(".fc-day-grid").remove();
        }
    },
    SetTitleSchedule: function (id, elementString, start) {
        if (!id || id == "") id = -1;

        $.ajax({
            method: "POST",
            url: "/Data/aGetScheduleName/",
            data: { id: id, start: start }
        }).success(function (response) {
            if (response.error) {
                showError(response.error);
            } else {
                if (response.name) {
                    $(elementString).text(response.name);
                }
            }
        });
    },
    SetEvents: function (type, id, calendarString, start, end, display, removeAll) {
        if (!id || id == "") id = -1;
        if (display + '' == 'undefined') {
            display = "all";
        }
        if (removeAll + "" == 'undefined') {
            removeAll = true;
        }
        var calendar = $(calendarString);

        var blockui = calendar.attr('data-blockui');
        if (blockui != "") {

            Metronic.blockUI({
                target: blockui,
                overlayColor: 'none',
                centerY: true,
                animate: true
            });
        }

        var events = [];
        if (removeAll) {
            calendar.fullCalendar('removeEvents');
        }
        var sendId = parseInt(id);
        if (id <= 0) id = userId;
        var ajaxId = SoProdHelper.UrlToObject("Data/aGetEvents/", { type: type, id: id, start: start, end: end, display: display }, function (response) {
            if (SoProdCalendar_AjaxID == ajaxId) {
                if (removeAll) {
                    calendar.fullCalendar('removeEvents');
                }
                $.each(response, function (id, event) {
                    if (event.type < 0) event.type = -event.type;
                    var fcEvent = {
                        id: event.id,
                        title: event.title,
                        start: event.start + ":00 GMT",
                        end: event.end + ":00 GMT",
                        allDay: false,
                        url: event.url,
                        action: event.action,
                        qualificationDuration: event.qualificationDuration,
                        qualification: event.qualification,
                        qualificationId: event.qualificationId,
                        canEdit: event.canEdit,
                        description: event.description,
                        className: (event.color == "" ? "event-type" + event.type : "") + " calendarEvent-" + event.type,
                        backgroundColor: event.color,
                        isBeforeEvent: event.isBeforeEvent ? true : false
                    };
                    if (fcEvent.start == fcEvent.end) {
                        fcEvent.end = event.end + ":01 GMT";
                    }
                    calendar.fullCalendar('renderEvent', fcEvent, true);

                });
                if (blockui != "") {
                    Metronic.unblockUI(blockui);
                }
            }
            //  }

        });
        SoProdCalendar_AjaxID = ajaxId;
    }
};
var SoProdIndexer = 0;
var SoProdHelper = {
    UrlToObject: function (url, data, func) {
        $.ajaxVerifier(url, function (verifier) {
            $.ajax({
                method: "POST",
                url: SoProdRootDir + url,
                data: data
            }).success(function (response) {
                if (verifier != $.ajaxVerifierHolder[url]) return;
                if (response.error) {
                    showError(response.error);
                } else {
                    func(response);
                }
            });
        });
        return ++SoProdIndexer;
    }
}
var tables = {};
function TableAddData(element, row) {
    tables[element].DataTable().fnAddData(row).draw();
}
function TableRefreshData(element, url, params) {
    $.ajax({
        method: "POST",
        url: url,
        data: params
    }).success(function (response) {
        if (response.error) {
            alert(response.error);
        } else {
            TableSetData(element, response.data);
        }
    });
}
function TableSetData(element, data) {
    tables[element].clear();
    $.each(data, function (index, value) {
        TableAddData(element, value);
    });
    tables[element].draw();
}

var dataTableFR = {
    processing: "Traitement en cours...",
    search: "Rechercher: ",
    lengthMenu: "Afficher _MENU_ &eacute;l&eacute;ments",
    info: "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
    infoEmpty: "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
    infoFiltered: "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
    infoPostFix: "",
    loadingRecords: "Chargement en cours...",
    zeroRecords: "Aucun &eacute;l&eacute;ment &agrave; afficher",
    emptyTable: "Aucune donnée disponible dans le tableau",
    paginate: {
        first: "Premier",
        previous: "Pr&eacute;c&eacute;dent",
        next: "Suivant",
        last: "Dernier"
    },
    aria: {
        sortAscending: ": activer pour trier la colonne par ordre croissant",
        sortDescending: ": activer pour trier la colonne par ordre décroissant"
    }
};
function TableSelect(element, index, className) {
    if (typeof className === 'undefined') className = 'active';
    $(element).find('tbody tr').removeClass(className);
    $(element).find('tbody tr[data-index="' + index + '"]').addClass(className);

}
function TableInitFilter(element, limit, fromCol) {
    //console.log(element);
    TableInit(element, {
        "language": dataTableFR,
        "aaSorting": [],
        "fnDrawCallback": function (settings) {
            $(settings.nTable).find(".tooltips").tooltip({ html: true });
        },
        "aLengthMenu": [
            [20, 50, 100, -1],
            [20, 50, 100, "All"] // change per page values here
        ],
        // set the initial value
        "iDisplayLength": 20,
        "sPaginationType": "bootstrap",
        initComplete: function (settings) {
            var api = new $.fn.dataTable.Api(settings);
            TableInitFilters($(settings.nTable).dataTable(), limit, fromCol);
        }
    });
    $(element).find("thead tr").first().find("th").click(function (e) {
        e.stopPropagation();
        var index = $(this).index();
        $(this).parent().next().find("th:eq(" + index + ")").click();
    });
}
function TableInitFilters(element, limit, fromCol) {
    if (!limit) {
        limit = 10;
    }
    if (!fromCol) {
        fromCol = 0;
    }

    for (var i = fromCol; i < element._('tr').columns()[0].length; i++) {

        var column = element._('tr').columns(i);
        var filter = $('<select class="selectbox form-control" data-id="' + i + '"><option value=""></option></select>');
        var inputType = "select";
        var options = [];
        $.each(element._('tr', { "filter": "applied" }).columns(i).data().unique()[0].sort(), function (d, j) {
            var value = $.trim($(j).text());
            if (value != '' && options.indexOf(value) === -1) {
                options.push(value);
            }
            if (options.length > limit) {
                return false;
            }
        });
        if (options.length > 0 && options.length <= limit) {
            options.sort(function (a, b) {
                if (a < b) { return -1; }
                if (a > b) { return 1; }
                return 0;
            })
            $.each(options, function (i, value) {
                filter.append('<option value="' + value + '">' + value + '</option>');
            });
        } else {
            filter = $('<input class="form-control" data-id="' + i + '" type="text"/>');
            inputType = "input";
        }
        filter.appendTo($(column.header()).empty()).on((inputType == 'input' ? 'keyup' : 'change'), function (e) {
            e.stopPropagation();
            e.preventDefault();
            var success = false;
            try {
                var val = $.trim($(this).val());
                //console.log(val);
                if (val && val != "") {
                    var isRegex = false;
                    if (inputType == 'select') {
                        val = "^" + val + "$";
                        isRegex = true;
                    }
                    element._('tr').columns($(this).data('id')).search(val, isRegex).draw();
                    $(this).parent().find(".select2-search-choice-close").show();
                    success = true;
                }
            } catch (e) {

            }
            if (!success) {
                element._('tr').columns($(this).data('id')).search('').draw();
                $(this).parent().find(".select2-search-choice-close").hide();
            }
            //TableInitFilters(element);
        }).on('click', function (e) {
            e.stopPropagation();
        });
        if (inputType == 'select' && options.length <= limit) {
            filter.select2({
                allowClear: true,
                dropdownAutoWidth: true
            });
            filter.parent().find(".select2-search-choice-close").click(function (e) {
                e.stopPropagation();
            });
            filter.parent().find(".select2-search-choice-close").hide();
        }

    }

}
function GetFromQueryString() {
    var queryString = window.location.search;
    var pairs = queryString.slice(1).split('&');
    var params = {};
    for (let i = 0; i < pairs.length; i++) {
        var [key, value] = pairs[i].split('=');
        if (key) {
            if (!value.includes(',')) {
                params[key] = decodeURIComponent(value.replace(/\+/g, " ")).replace(/[^\w\s-]/gi, '');
            } else {
                params[key] = value.split(',').map(val => decodeURIComponent(val.replace(/\+/g, " ")).replace(/[^\w\s-]/gi, ''));
            }
        }
    }
    return params;
}
function SetFromQueryString(params) {
    const pairs = [];
    for (let key in params) {
        var value = params[key];
        let str;
        if (Array.isArray(value)) {
            str = value.join(',');
        } else {
            str = value;
        }
        pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(str));
    }
    const queryString = pairs.join('&');
    window.history.pushState({}, '', `${window.location.pathname}?${queryString}`);
}
var SelectPopulateCount = 0;
var SelectPopulateData = {};
var SelectPopulateAjax = {};
function isFunctionA(object) {
    return typeof object === "function";
}
var formatState = function (result) { return $("<b>" + result.text + "</b>") }
var formatSelection = function (selection) { return $("<b>" + selection.text + "</b>") }

function textFormat(state) {
    if (!state.id) return state.text; // optgroup

    return state.text;
}

function matcherResult(term, text, opt) {
    var normalizedText = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return text.toUpperCase().indexOf(term.toUpperCase()) >= 0 || opt.parent("optgroup").attr("label").toUpperCase().indexOf(term.toUpperCase()) >= 0 || normalizedText.toUpperCase().indexOf(term.toUpperCase()) >= 0
}
function RemoveFromSelectPopulateAjaxHolder(url, data) {
    var identifier = url + (data ? JSON.stringify(data) : "");
    delete SelectPopulateAjax[identifier];
}

function SelectPopulate(element, url, data, selectedVal, funct, nocache) {
    //console.log(element);
    var select2 = $(element);
    if (select2.length == 0) return;
    var stopLoad = true;
    var identifier = url + (data ? JSON.stringify(data) : "");
    if (SelectPopulateAjax && SelectPopulateAjax[identifier]) {
        // call this method recursivly every 100ms and wait for response to be loaded
        if (SelectPopulateAjax[identifier].loading === true) {
            setTimeout(function () {
                SelectPopulate(element, url, data, selectedVal, funct);
                return;
            }, 100);
            return;
        }
        // data is already loaded here - apply selectPopulate logic on element
        else if (SelectPopulateAjax[identifier].response) {
            var response = SelectPopulateAjax[identifier].response;
            if (nocache) {
                SelectPopulateAjax[identifier] = {};
            }
            if (response.error) {
                showError(response.error);
            } else {
                if (!SelectPopulateData[element]) {
                    SelectPopulateData[element] = {};
                }
                var lastGroup = false;
                var lastGroupId = false;
                select2.empty();
                var settings = select2.attr('data-settings');
                var defaultValue = select2.attr('data-value');
                if (!defaultValue && settings && settings != "") {
                    defaultValue = select2.attr('data-settings') ? SoProdUserSettings.Get("userDashboard", select2.attr('data-settings')) : false;
                }

                $.each(response.data, function () {
                    if (!lastGroup || lastGroupId != this[0]) {
                        lastGroupId = this[0];
                        if (lastGroup) {
                            select2.append(lastGroup);
                        }
                        lastGroup = $("<optgroup />");
                        lastGroup.attr('label', lastGroupId);
                    }

                    var textSelect = this[2];
                    var showAdditionalText = response.showAdditionalText ? true : false;
                    if (this[3] && showAdditionalText) {
                        var elementAdd = ' ' + this[3];
                        textSelect = textSelect + elementAdd;
                    }
                    var elementOpt = $("<option />").val(this[1]).text(textSelect);

                    /*  if (defaultValue && elementOpt.val() == defaultValue) {
                          elementOpt.attr('checked', 'checked');
                      }*/
                    lastGroup.append(elementOpt);
                    SelectPopulateData[element][this[1]] = this;
                });
                if (lastGroup) {
                    select2.append(lastGroup);
                }

                var isMultiple = select2.attr('multiple') !== undefined || select2.hasClass('select2CBme');
                if (!isMultiple) {
                    select2.append("<option value=''></option>");
                }

                if (!isMultiple) {
                    select2.show();
                    select2.select2('destroy').select2({
                        allowClear: selectedVal != -3,
                        placeholder: select2.attr('data-placeholder'),
                        formatResult: textFormat,
                        templateSelection: textFormat,
                        formatSelection: function (selected, total) {
                            return selected.text;
                            //return selected.text.indexOf('<span') >= 0 ? selected.text.substring(selected.text.indexOf('\'>') + 2, selected.text.indexOf('</span>'))  : selected.text;
                        }
                    });

                    if (select2.data('select2') && select2.data('select2').opts)
                        select2.data('select2').opts.matcher = matcherResult;

                    if (select2.attr('data-minimuminputlength')) {
                        var minimuminputlength = select2.attr('data-minimuminputlength');
                        select2.data('select2').opts.minimumInputLength = minimuminputlength;
                        select2.data('select2').opts.formatInputTooShort = function () {
                            return "Veuillez entrer " + minimuminputlength + " caractères ou plus";
                        };
                    }
                }
                else {
                    select2.removeAttr('multiple');
                    if (!select2.hasClass('select2CBme')) select2.addClass('select2CBme');

                    var options = {
                        formatSelection: function (selected, total) {
                            return selected.map((x, i) => i == selected.length - 1 ? x.text : x.text + ', ');
                        },
                        allowClear: selectedVal != -3,
                        placeholder: select2.attr('data-placeholder'),
                        formatResult: textFormat,
                        templateSelection: textFormat
                    };

                    //if (select2.data('select2') && select2.data('select2').opts)
                    //    select2.data('select2').opts.matcher = matcherResult;

                    //if (select2.attr('data-minimuminputlength')) {
                    //    console.log('minInput set');
                    //    var minimuminputlength = select2.attr('data-minimuminputlength');
                    //    options.minimumInputLength = minimuminputlength;
                    //    options.formatInputTooShort = function () {
                    //        return "Veuillez entrer " + minimuminputlength + " caractères ou plus";
                    //    };
                    //}

                    //console.log('init select multi ');
                    select2.show();
                    select2.select2('destroy').select2MultiCheckboxes(options);
                }

                if (selectedVal == -2 && response.data && response.data.length == 1) {
                    if (!select2.attr("data-select") || select2.attr("data-select") != "false") {
                        var val = response.data[0][1];
                        select2.select2('val', val).change();
                        //select2.change();
                    }
                } else if (selectedVal == -3) {
                    var val = response.data[0][1];
                    select2.select2('val', val).change();
                    //select2.change();
                } else if (defaultValue) {
                    stopLoad = false;
                    setTimeout(function () {
                        select2.select2('val', defaultValue).change();
                        if (select2.attr('data-loading'))
                            select2.removeAttr('data-loading');
                    }, 1000);
                } else if (selectedVal && selectedVal != -2 && !isNaN(selectedVal)) {
                    select2.select2('val', selectedVal).change();
                } else if (selectedVal != -2 && Array.isArray(selectedVal) && isMultiple) {
                    select2.select2('val', selectedVal).change();
                } else {
                    select2.select2('val', isMultiple ? [] : '').change();
                }

                //select2.change(function () {
                //    var element = $("#s2id_" + $(this).attr('id'));
                //    element.find(".select2-chosen").each(function () {
                //        $(this).html($(this).text());
                //    });
                //});

                SelectPopulateCount++;
                //if (blockui != "") {
                //    Metronic.unblockUI(blockui);
                //}
                if (isFunctionA(funct)) {
                    funct(response);
                }
            }

            if (stopLoad && select2.attr('data-loading'))
                select2.removeAttr('data-loading');

            if (select2.attr('data-cache') == 0) {
                SelectPopulateAjax[identifier] = false;
            }
            return;
        }
    }

    //var loading = select2.attr('data-loading', true);
    var blockui = select2.attr('data-blockui');
    if (blockui != "") {
        Metronic.blockUI({
            target: blockui,
            overlayColor: 'none',
            centerY: true,
            animate: true
        });
    }

    select2.empty();

    SelectPopulateAjax[identifier] = { loading: true };
    SelectPopulateData[element] = {};
    $.ajax({
        method: "POST",
        url: SoProdRootDir + url,
        data: data
    }).success(function (response) {
        // load data to global holder
        if (!SelectPopulateAjax[identifier] || !SelectPopulateAjax[identifier].response) {
            SelectPopulateAjax[identifier] = { response: response, syncDate: new Date(), loading: false };
        }

        SelectPopulate(element, url, data, selectedVal, funct, nocache);

        if (blockui != "")
            Metronic.unblockUI(blockui);
    }).error(function (response) {
        // apply trys on request error ?? (by identifier ofc)
        SelectPopulateAjax[identifier] = { response: {}, syncDate: new Date(), loading: false };
        //SelectPopulateAjax[identifier] = { loading: false };
        SelectPopulate(element, url, data, selectedVal, funct);

        if (blockui != "")
            Metronic.unblockUI(blockui);
    });

    return;
}

function SelectPopulateWithChilds(element, url, data, selectedVal, calback) {
    //console.log(element);
    var select2 = $(element);
    if (select2.length == 0) return;
    SelectPopulateAjax[element] = {};
    var loading = select2.attr('data-loading', true);
    var blockui = select2.attr('data-blockui');
    if (blockui != "") {

        Metronic.blockUI({
            target: blockui,
            overlayColor: 'none',
            centerY: true,
            animate: true
        });
    }
    select2.empty();
    $.ajax({
        method: "POST",
        url: SoProdRootDir + url,
        data: data
    }).success(function (response) {
        if (response.error) {
            showError(response.error);
        } else {

            select2.show();
            select2.select2('destroy').select2({
                allowClear: true,
                data: response
            });
            var defaultValue = select2.attr('data-value');
            if ((selectedVal == -2 || !selectedVal) && defaultValue) {
                select2.select2('val', defaultValue);
                select2.change();
            } else if (selectedVal == -2 && response.data && response.data.length == 1) {
                select2.select2('val', response.data[0][1]);
                select2.change();
                //} else if (selectedVal == -2 && !response.data  && response && response.length == 1) {
                //    select2.select2('val', response[0].id);
                //    select2.change();
            } else if (selectedVal != -2 && !isNaN(selectedVal)) {
                select2.select2('val', selectedVal).change();
            }
            if (blockui != "") {
                Metronic.unblockUI(blockui);
            }
            if (isFunctionA(calback)) {
                calback();
            }
        }
        if (select2.attr('data-loading'))
            select2.removeAttr('data-loading');
    }).error(function (response) {
        if (select2.attr('data-loading'))
            select2.removeAttr('data-loading');
    });
}

function SelectPopulateCB(element, url, data, selectedVal, funct) {
    $(element).attr('multiple', 'multiple');
    SelectPopulate(element, url, data, selectedVal, funct);
    return;
}

function InitSelectCB(element, selectedVal) {
    if (!element) return;

    element.removeAttr('multiple');
    if (!element.hasClass('select2CBme')) element.addClass('select2CBme');

    element.show();
    element.select2('destroy').select2MultiCheckboxes({
        formatSelection: function (selected, total) {
            return selected.map((x, i) => i == selected.length - 1 ? x.text : x.text + ', ');
        },
        allowClear: selectedVal != -3,
        placeholder: element.attr('data-placeholder'),
        formatResult: textFormat,
        templateSelection: textFormat,
    });
}

$(function () {

    jQuery.fn.dataTableExt.oApi.fnSetFilteringDelay = function (oSettings, iDelay) {
        var _that = this;

        if (iDelay === undefined) {
            iDelay = 250;
        }

        this.each(function (i) {
            $.fn.dataTableExt.iApiIndex = i;
            var
                oTimerId = null,
                sPreviousSearch = null,
                anControl = $('input', _that.fnSettings().aanFeatures.f);

            anControl.unbind('keyup search input').bind('keyup search input', function () {

                if (sPreviousSearch === null || sPreviousSearch != anControl.val()) {
                    window.clearTimeout(oTimerId);
                    sPreviousSearch = anControl.val();
                    oTimerId = window.setTimeout(function () {
                        $.fn.dataTableExt.iApiIndex = i;
                        _that.fnFilter(anControl.val());
                    }, iDelay);
                }
            });

            return this;
        });
        return this;
    };
    setTimeout(function () {
        $("input[autocomplete='off']").attr('autocomplete', 'new-password');
    });

    /* ----------------------- PORTLET SCROLL ACTIONS ------------------------- */
    $('body').on('click', '.portlet-expand-action .show-all', function (e) {
        var portletBody = $(this).parent().parent().find('.portlet-body');
        portletBody.removeClass('scrollable-content');
        $(this).hide();
        $(this).parent().find('.show-less').show();
        $(window).scrollTop(portletBody.offset().top);
        //$(window).scrollTop(portletBody.offset().top + portletBody.position().top - 90);
    });
    $('body').on('click', '.portlet-expand-action .show-less', function (e) {
        var portletBody = $(this).parent().parent().find('.portlet-body');
        portletBody.addClass('scrollable-content');
        $(this).hide();
        $(this).parent().find('.show-all').show();
        fixPortletScrollable($(this).parent().parent().find('.portlet-body'));
        $(window).scrollTop(portletBody.offset().top - 90);
    });
    $(".portlet-expand-action .btn").on({
        mouseenter: function () {
            $(this).removeClass('grey-cascade');
            $(this).addClass('btn-info');
        },
        mouseleave: function () {
            $(this).removeClass('btn-info');
            $(this).addClass('grey-cascade');
        }
    });
});

// elem must be portlet-body
function fixPortletScrollable(elem) {
    if (elem) {
        if (elem.hasClass('scrollable-content')) {
            var maxheight = parseInt(elem.css('max-height').replace('px', ''));
            var height = elem.height();
            if (height < (maxheight - 20)) {
                elem.removeClass('scrollable-content');
                elem.parent().parent().find('.portlet-expand-action').hide();
                return;
            }

            if ($(elem).attr('data-scroll-to') && $(elem).attr('data-scroll-to') == 'top')
                $(elem).animate({ scrollTop: 0 }, 250);
            else
                $(elem).animate({ scrollTop: $(elem).children().height() }, 250);
        }
    }
}
function fixAllPortletScrollable() {
    $('.portlet-body.scrollable-action').each(function (i, item) {
        fixPortletScrollable($(this));
    });
}

function TableInit(element, settings, onlyTable) {
    if (!settings || settings === undefined) {
        settings = {
            "language": dataTableFR,
            "aaSorting": [],
            "aLengthMenu": [
                [5, 10, 20, -1],
                [5, 10, 20, "All"] // change per page values here
            ],
            // set the initial value
            "iDisplayLength": 20,
            "sPaginationType": "bootstrap",
        }
    }

    if (onlyTable) {
        settings.searching = false;
        settings.paging = false;
        settings.info = false;
        settings.iDisplayLength = -1;
    }

    if (settings.ajax) {
        settings.initComplete = function () {
            //console.log('inited. ' + element);
            var oTimerId = null;
            var sPreviousSearch = null;

            $(element).parent().parent().find('.dataTables_filter input').unbind('.DT').bind('keyup.DT', function (e) {
                var value = this.value;
                if (sPreviousSearch === null || sPreviousSearch != value) {
                    //console.log('event');
                    sPreviousSearch = value;
                    window.clearTimeout(oTimerId);

                    oTimerId = setTimeout(function () {
                        //tables[element].search(value).draw();
                        tables[element].fnFilter(value);
                    }, 800);
                }
            });
        }
    }
    var api = $(element).dataTable(settings);

    tables[element] = api;

    $(element + ' .group-checkable').change(function () {
        var set = jQuery(this).attr("data-set");
        var checked = jQuery(this).is(":checked");
        jQuery(set).each(function () {
            if (checked) {
                $(this).attr("checked", true);
                $(this).parents('tr').addClass("active");
            } else {
                $(this).attr("checked", false);
                $(this).parents('tr').removeClass("active");
            }
        });
        jQuery.uniform.update(set);
    });

    $(element).on('change', 'tbody tr .checkboxes', function () {
        $(this).parents('tr').toggleClass("active");
    });

    $(element + '_wrapper .dataTables_filter input').addClass("form-control input-medium input-inline"); // modify table search input
    $(element + '_wrapper .dataTables_length select').addClass("form-control input-xsmall input-inline"); // modify table per page dropdown
    /* setTimeout(function () {
         var width = $(element).find("tbody tr:first-child td:last-child div").width();
         if (!isNaN(width)) {
             $(element).find("thead th:last-child").css('width', width + 'px');
         }
     }, 1000);*/
}
function ValidateForm(element, rules, messages) {
    $(element).validate({
        errorElement: 'span', //default input error message container
        errorClass: 'help-block', // default input error message class
        focusInvalid: false, // do not focus the last invalid input
        ignore: "",  // validate all fields including form hidden input
        rules: rules,

        invalidHandler: function (event, validator) { //display error alert on form submit              
            /*   success2.hide();
               error2.show();
               Metronic.scrollTo(error2, -200);*/
        },

        errorPlacement: function (error, element) { // render error placement for each input type
            var icon = $(element).closest('.form-group').find('.validationError').text(error.text()).show();

        },

        highlight: function (element) { // hightlight error inputs
            $(element)
                .closest('.form-group').removeClass("has-success").addClass('has-error'); // set error class to the control group   
        },

        unhighlight: function (element) { // revert the change done by hightlight
            $(element)
                .closest('.form-group').removeClass("has-error");
            $(element).closest('.form-group').find('.validationError').hide();
        },

        success: function (label, element) {
            $(element).parent().parent().find('.validationError').hide();
            // var icon = $(element).parent('.input-icon').children('i');
            $(element).closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
            // icon.removeClass("fa-warning").addClass("fa-check");*/
        },
        messages: messages,
        submitHandler: function (form) {
            /* success2.show();
             error2.hide();*/
        }
    });
}
function showWarning(title, message) {
    toastr["warning"](message, title)
}
function showSuccess(title, message) {
    toastr["success"](message, title)
}
function showError(title, message) {
    toastr["error"](message, title)
}
function showMessage(title, message, settings) {
    toastr["info"](message, title, settings)
}
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}
function getParameterByName(name) {
    const queryString = window.location.search;
    const regex = new RegExp(`[?&]${name}=([^&#]*)`);
    const results = regex.exec(queryString);
    if (results) {
        const value = decodeURIComponent(results[1].replace(/\+/g, " "));
        return value.replace(/[^\w\s]/gi, '');
    }
    return "";
}
var actionModalTimeout = false;
function startAction(text, title, type, timeout) {
    if (actionModalTimeout) {
        clearTimeout(actionModalTimeout);
    }
    $("#serverAction .actionText").html(text);
    if (!title) {
        title = "";
    }
    $("#serverAction .actionTitle").html(title);
    if (!type) {
        type = "success";
    }
    $("#serverAction .progress-bar").removeClass("progress-bar-success");
    $("#serverAction .progress-bar").removeClass("progress-bar-info");
    $("#serverAction .progress-bar").removeClass("progress-bar-warning");
    $("#serverAction .progress-bar").removeClass("progress-bar-danger");
    $("#serverAction .progress-bar").addClass("progress-bar-" + type);
    $("#serverAction").show();
    if (timeout) {
        if (actionModalTimeout) {
            clearTimeout(actionModalTimeout);
        }
        actionModalTimeout = setTimeout(stopAction, timeout);
    }
}
function stopAction() {
    if (actionModalTimeout) {
        clearTimeout(actionModalTimeout);
    }
    $("#serverAction").hide();
}

function startAlert(text, title, type) {
    $("#serverAlert .actionText").html(text);
    if (!title) {
        title = "";
    }
    $("#serverAction .actionTitle").html(title);
    if (!type) {
        type = "danger";
    }
    $("#serverAlert .progress-bar").removeClass("progress-bar-success");
    $("#serverAlert .progress-bar").removeClass("progress-bar-info");
    $("#serverAlert .progress-bar").removeClass("progress-bar-warning");
    $("#serverAlert .progress-bar").removeClass("progress-bar-danger");
    $("#serverAlert .progress-bar").addClass("progress-bar-" + type);
    $("#serverAlert").show();
}
function stopAlert() {
    $("#serverAlert").hide();
}
bootbox.setDefaults({
    locale: "fr"
});
function GetUserTooltips() {
    $(".userTooltip").tooltip(
        {
            html: true,
            trigger: "manual",
            container: 'body'
        }
    ).on(
        {
            mouseenter:
                function () {
                    $(".tooltip").remove();
                    var $el = $(this);
                    if ($el.data("fetched") === undefined) {
                        $el.data("fetched", true);
                        $el.attr("data-original-title", "<img src='/assets/metronic/admin/layout/img/loading2.gif'/>").tooltip("show");
                        $.ajax({
                            method: "GET",
                            url: "/User/aGetUserTooltip/" + $el.attr('data-index')
                        }).success(function (response) {
                            if (response && !response.error && response.tooltip) {
                                $el.attr("data-original-title", response.tooltip);
                                setTimeout(function () {
                                    $el.tooltip("show");
                                }, 10);
                            }
                        });
                    } else {
                        $(this).tooltip("show");
                    }
                },
            mouseleave:
                function () {
                    $(this).tooltip("hide");
                }
        }
    );
}
function disableAdminButtons() {
    $(".page-content input,.page-content select").each(function () {
        // $(this).attr('disabled','disabled');
        $(this).attr('readonly', 'readonly');
        $(this).attr('data-editable', '0');
        if ($($(this).attr('data-tagged')).hasClass("countriesTelephone")) {
            $("select" + $(this).attr('data-tagged')).select2('disable');
        }
        $(this).parent().parent().find('.input-group-btn').remove();
    });

    $('.page-content input,.page-content select').unbind();
    $(".page-content button").remove();
    $(".page-content .actions a i.fa-plus").parent().remove();
    $(".admin-action").attr('disabled', '');
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


//--------------------------------------------------------------------
//------------------- Timezone methods -------------------------------
//--------------------------------------------------------------------
function getTimezoneData(recordId, date, callback) {
    $.ajax({
        method: "POST",
        url: "/Data/aGetRecordTimezoneData",
        data: {
            recordId: recordId,
            date: date
        }
    }).success(function (response) {
        if (callback)
            callback(response);

    }).error(function (error) {
        if (callback)
            callback();
    });
}

function getTimezoneDataByToken(tokenId, token, date, callback, url) {
    $.ajax({
        method: "POST",
        url: url ? url : "/Booking/aGetTokenTimezoneData",
        data: {
            tokenId: tokenId,
            token: token,
            date: date
        }
    }).success(function (response) {
        if (callback)
            callback(response);

    }).error(function (error) {
        if (callback)
            callback();
    });
}

function LeadingZeros(number, length) {
    var str = '' + number;
    while (str.length < length) { str = '0' + str; }
    return str;
}
function TimeToHuman(time, clock) {
    var hour = parseInt(time / 3600000),
        min = parseInt((time / 10 % 360000) / 6000),
        sec = parseInt(time / 10 % 360000 / 100) - (min * 60);
    if (!clock) {
        if (hour > 0) {
            return hour + "h" + (min > 0 ? min + "m" : "") + (sec > 0 ? sec + "s" : "");
        } else if (min > 0) {
            return (min > 0 ? min + "m" : "") + (sec > 0 ? sec + "s" : "");
        } else {
            return (sec > 0 ? sec + "s" : "");
        }
    }
    return LeadingZeros(hour, 2) + ":" + (min > 0 ? LeadingZeros(min, 2) : "00") + ":" + LeadingZeros(sec, 2);
}
function PopulateAgendaDayWithTimezoneData(elemId, timezoneLabel, offsetHours) {
    if (offsetHours == 0) return;
    if (elemId && elemId.indexOf('#') < 0) elemId = '#' + elemId;
    $(elemId + ' .fc-toolbar .fc-left .client-timezone-label').remove();
    // remove <br> and second line
    timezoneLabel = timezoneLabel.indexOf('<br') > 0 ? timezoneLabel.substring(0, timezoneLabel.indexOf('<br')) : timezoneLabel;
    $(elemId + ' .fc-toolbar .fc-left').append('<p class="client-timezone-label">' + timezoneLabel + '<span style="color:black !important"><b> / </b> Paris Time</span></p>');
    var list = $(elemId + ' .fc-time-grid .fc-slats table tbody tr');
    list.each(function () {
        if (offsetHours != 0 && !$(this).hasClass('fc-minor')) {
            $(this).find('td:eq(0) .client-hour').remove();
            var hour = parseInt($(this).find('td:eq(0) span').text());
            var ParisTime = $('<b> / </b><span>' + LeadingZeros(parseInt(hour), 2) + "h" + '</span>');
            var LocalTime = $('<span class="client-hour tooltips" data-container="body" data-original-title="' + timezoneLabel + '">' + LeadingZeros(parseInt(hour + offsetHours), 2) + 'h</span>');
            $(this).find('td:eq(0)').html("").append(ParisTime).append(LocalTime);
        }
    });
    $('.client-hour.tooltips').tooltip();
}

$.dashboardGroupEntityNames = function (id, type) {
    $.ajax({
        method: "POST",
        url: "/Data/aGetDashboardGroupEntityNames/",
        data: {
            dashboardGroupId: id,
            type: type
        }
    }).success(function (response) {

        if (!response.data) {
            showError(response.error); s
        } else {
            var text = "";
            $.each(response.data, function () {
                text = text.concat("<b>" + this.name + "</b><br>");
                $.each(this.entityNames, function () {
                    text = text.concat("<p>- " + this.name + "</p>");
                });
                text = text.concat("<br>");
            });
            bootbox.alert(text);
        }
    });

};

$.EntityNamesById = function (entityIds, type) {
    $.ajax({
        method: "POST",
        url: "/Data/aGetEntityNamesById/",
        data: {
            entityIds: entityIds,
            type: type
        }
    }).success(function (response) {

        if (!response.data) {
            showError(response.error); s
        } else {

            var text = "";
            text = text.concat("<b>" + response.data.name + "</b><br>");
            $.each(response.data.entities, function () {
                text = text.concat("<br>- " + this.EntityName + " <b>(" + this.FlowName + ")</b>");
            });
            bootbox.alert(text);
        }
    });

};



$(function () {

    var originalGetSelect = $.valHooks.select.get;
    $.valHooks.select.get = function (a) {
        if (jQuery(a).hasClass('select2CBme')) {
            return jQuery(a).select2('val');
        }
        return originalGetSelect.call(this, a);
    }

    var originalSetSelect = $.valHooks.select.set;
    $.valHooks.select.set = function (a, b) {
        if (jQuery(a).hasClass('select2CBme')) {
            if (!Array.isArray(b)) {
                return jQuery(a).select2('val', [b]);
            }
            return jQuery(a).select2('val', b);
        }
        return originalSetSelect.call(this, a, b);
    }
});

function htmlDecode(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}
$(function () {
    $(document).ajaxSuccess(function (event, xhr, settings, data) {
        if (!data.success && data.login) {
            // save current page as redirect (in js var URL/Redirect)
            var redirect = window.location.pathname + window.location.search;
            window.location.href = '/Public/Login/?redirect=' + redirect;
        }
    });

    $('.soprod-modal-close').on('click', function (e) {
        e.preventDefault();
        var modal = $(this).closest('.soprod-modal');
        if ($(modal).length > 0)
            $(modal).hide();
    });
});

function CopyToClipboard(elem) {
    if (elem) {
        elem.focus();
        elem.select();
        try {
            var successful = document.execCommand('copy');
            if (successful) {
                showSuccess('Texte copié');
            }
            else {
                showWarning('Impossible de copier du texte');
            }
        } catch (err) {
            showWarning('Impossible de copier du texte');
        }
    }
}

String.prototype.pick = function (min, max) {
    var n, chars = '';

    if (typeof max === 'undefined') {
        n = min;
    } else {
        n = min + Math.floor(Math.random() * (max - min + 1));
    }

    for (var i = 0; i < n; i++) {
        chars += this.charAt(Math.floor(Math.random() * this.length));
    }

    return chars;
};
String.prototype.shuffle = function () {
    var array = this.split('');
    var tmp, current, top = array.length;

    if (top) while (--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array.join('');
};
function GenerateRandomPassword(length) {
    if (!length) length = 9;

    //var specials = '!@@#$%^&*()_+{}:"<>?\|[];\',./`~';
    var specials = '!@@#$%^&*_+?.';
    var lowercase = 'abcdefghijklmnopqrstuvwxyz';
    var uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var numbers = '0123456789';

    var password = '';
    password += specials.pick(1);
    password += uppercase.pick(1);
    password += lowercase.pick(1);
    password += numbers.pick((length - 3) / 2);
    password += uppercase.pick((length - 3) / 2);
    password = password.shuffle();

    return password;
}
function InitCustomRadios(){
    $('.radio-wrapper .radio-item').unbind('click');
    $('.radio-wrapper .radio-item').on('click', function () {
        $(this).closest('.radio-wrapper').find('.radio-item').removeAttr('checked');
        $(this).closest('.radio-wrapper').find('.radio-item').removeClass('active');
        $(this).attr('checked', '');
        $(this).addClass('active');
    });
}