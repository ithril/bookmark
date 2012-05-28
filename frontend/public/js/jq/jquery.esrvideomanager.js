/**
 * @file
 *
 *  ESR Video Manager
 *
 *  Handles embedding Videos into tinyMCE
 *
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 12-05-06
 * Time: 8:56 AM
 * To change this template use File | Settings | File Templates.
 */


(function($) {

    $.esrvideomanager = function(element, options) {
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
            var title = "Add a Video";

            var html = '<form class="wysiwyg popupform" id="wysiwyg-addVideo"><fieldset>' +
                '<div class="form-row"><label class="form-row-key">Preview:<img id="loading_image" src="/imgs/sys/ajax-loader.gif" class="loading" style="display:none;"/></label><div class="form-row-value videoembed"></div></div>' +
                '<div class="form-row"><label for="name">Url:</label><div class="form-row-value"><input type="text" name="videoUrl" value=""/>' +
                '</div></div>' +
                '<div class="form-row"><label for="name">Title:</label><div class="form-row-value"><input type="text" name="videoTitle" value=""/></div></div>' +
                '<div class="form-row"><label for="name">Description:</label><div class="form-row-value"><textarea name="videoDescription" ></textarea>' +
                '<input type="hidden" id="videoEmbed_data" />' +
                '<input type="hidden" id="vidThumb" />' +
                '</div></div>' +
                '<div class="form-row form-row-last"><label for="name"></label><div class="form-row-value"><button type="submit" id="addVideo" class="button"><span>Insert Video</span></button> ' +
            '<input type="reset" value="Cancel" class="cancel-post"/></div></div></fieldset></form>';

            $dlg = $("<div></div>");
            $dlg.attr('id', 'videoPopup')
                .html(html)
                .appendTo($element);

            $("#addVideo").click (function(e) {
                e.preventDefault();
                processInsert();
            });

            $("input[name='videoUrl']").bind("change", function() {
                $("#loading_image").show();
                var url = $('input[name="videoUrl"]').val();
                if (url == null ) return false;

                var embedly = embedly_enpoint(url);
                $.getJSON(
                    embedly,
                    function(data) {
                        if (data.error_code == 400 ||data.error_code == 404
                            || data.html == null || data.html==="undefined"
                            ) {
                            alert ("Invalid URL");
                            $('input[name="videoUrl"]').focus();
                            $("#loading_image").hide();
                            return false;
                        }

                        var titleField = $('input[name="videoTitle"]');
                        var descriptionField = $('textarea[name="videoDescription"]');

                        if (titleField.val() == '')  titleField.val(data.title);
                        if (descriptionField.text() == '')  descriptionField.text(data.title);
                        $('input[id="vidThumb"]').val(data.thumbnail_url);

                        // resize the video for the preview Window
                        var vidEmbed = data.html;
                        var wPatt = /width="([0-9]+)/i;
                        var hPatt = /height="([0-9]+)/i;

                        var vidW = wPatt.exec(vidEmbed);
                        var vidH = hPatt.exec(vidEmbed);

                        if (vidW && vidH) {
                            if (vidW[1] && vidH[1]) {
                                var w = vidW[1];
                                var h = vidH[1];
                                var ratio = w/h;

                                var newW = 240 ;
                                var newH = newW / ratio;

                                vidEmbed = vidEmbed.replace(wPatt, 'width="' + newW);
                                vidEmbed = vidEmbed.replace(hPatt, 'height="' + newH);
                            }
                        }
                        var dataText = JSON.stringify(data);
                        $("#videoEmbed_data").val(dataText);
                        $("div.videoembed").html(vidEmbed);
                        $("#loading_image").hide();
                    }
                );

            })

            $(".cancel-post").click (function(e) {
                e.preventDefault();
                if (callback) callback();
            });

            $("#videoPopup").dialog({
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
                closeDialog();
            });
        }


        var closeDialog = function() {
            $("#videoPopup").dialog('close');
            if (callback) callback();
        }

        var processInsert = function() {
            var video,
                url = $("input[name='videoUrl']").val(),
                thumb = $("input[id='vidThumb']").val(),
                title = $("input[name='videoTitle']").val(),
                description = $("textarea[name='videoDescription']").text(),
                data = $("input[id='videoEmbed_data']").val(),
                baseUrl;

            var c = new ESRContent();
            c.setTitle(title);
            c.setBody(description);
            c.setUrl(thumb);
            c.setCType('QuickVideo');
            c.setData( createVideo(new Object(), data));

            c.post( function () {
                if (c.valid()) {
                    insertObject('cid_'+ c.getId(), 'Video', c.getTitle(), c.getBody(), c.getUrl(), c.getData(), false);
                    closeDialog();
                    return false;
                } else {
                    alert("could not add video. Please try again");
                    return false;
                }
            });
        }

        plugin.init();


    }

    $.fn.esrvideomanager = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('esrvideomanager')) {
                var plugin = new $.esrvideomanager(this, options);
                $(this).data('esrvideomanager', plugin);
            }
        });
    }
})(jQuery);
