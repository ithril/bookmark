/**
 * @file
 *
 *  ESR Link Manager
 *
 *  Handles embedding hyperlinks into tinyMCE
 *
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 12-05-06
 * Time: 8:56 AM
 * To change this template use File | Settings | File Templates.
 */


(function($) {

    $.esrlinkmanager = function(element, options) {
        var defaults = {
            title: 'not set',
            callback:''
        };

        var plugin = this;
        plugin.settings = {};

        var $element = $(element),
            element = element;

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            title = plugin.settings.title;
            callback = plugin.settings.callback;

            $element.click(function() {
                makeForm();
            });
        }

        var makeForm = function() {
            var title = "Add a hyperlink";

            var html = '<form class="wysiwyg popupform" id="wysiwyg-addVideo"><fieldset><div>' +
                '<p>Add a link to your post</p>' +
                '<br/></div>' +
                '<div class="form-row"><label for="urlToAdd">url</label><div class="form-row-value"><input type="text" id="urlToAdd" ></div></div>' +
                '<div class="form-row"><label for="prettyName">pretty name (optional)</label><div class="form-row-value"><input type="text" id="prettyName" ></div></div>' +
                '<div class="form-row form-row-last"><label form="name"></label>' +
                '   <div class="form-row-value"><button id="addUrl" value="doSubmit" class="button" type="submit"><span>Submit</span></button>' +
                '   <input type="reset" value="Cancel" class="cancel-post"/></div></div>' +
                '</fieldset></form>' +
                '<div id="result"></div> ' ;


            $dlg = $("<div></div>");
            $dlg.attr('id', 'linkPopup')
                .html(html)
                .appendTo($element);

            $("#addUrl").click (function(e) {
                parseUrl();
            });

            $("#linkPopup").dialog({
                autoOpen:true,
                title:title,
                resizable:false,
                modal:true,
                width: 450,
                show: {effect: 'drop', direction: 'up'},
                hide: {effect: 'drop', direction: 'down'}
            });

            $(".ui-dialog-titlebar-close").click(function(e) {
                e.preventDefault();
                if (callback) callback();
                return false;
            });

            $(".cancel-post").click (function(e) {
                e.preventDefault();
                closeDialog();
                return false;
            });
        }


        var closeDialog = function() {
            $("#linkPopup").dialog('close');
            if (callback) callback();
            return false;
        }

        var parseUrl = function() {
            var url = $("#urlToAdd").val();
            var prettyName = $("#prettyName").val();
            if (prettyName == '') prettyName = url;
            if (url== '')  {
                $("#result").html("You need to enter a link first");
            } else if (url.indexOf( window.location.hostname ) >-1 ) { // esr link
                var link = url.replace('http://' + window.location.hostname + '/', '');
                link = link.replace(window.location.hostname + '/', ''); // just in case it was added without the http://
                if (link.indexOf('c/') > -1 ) {
                   // it's content
                    var c = link.split("/")[1];
                    var content = new ESRContent();
                    content.load(c, function() {
                        insertObject(content.getId(), content.getCType(), content.getTitle(),content.getBodyText(), content.getUrl(), content.getData(), true);
                        closeDialog();
                        return false;
                    });
                } else {
                    link = '<a href="'+url+'" class="external">' + prettyName + '</a>';
                    $("#wysiwygEditor").tinymce().execCommand('mceInsertContent',false, link); // add the original url
                    closeDialog();
                }

            } else {
                var link = '<a href="'+url+'" class="external">' + prettyName + '</a>';
                $("#wysiwygEditor").tinymce().execCommand('mceInsertContent',false, link);
                closeDialog();
            }
        }

        plugin.init();


    }

    $.fn.esrlinkmanager = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('esrlinkmanager')) {
                var plugin = new $.esrlinkmanager(this, options);
                $(this).data('esrlinkmanager', plugin);
            }
        });
    }
})(jQuery);
