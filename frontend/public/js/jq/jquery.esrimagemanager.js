/**
 * @file
 *
 *  ESR Image Manager
 *
 *  Handles embedding Images into tinyMCE
 *
 * Created with JetBrains PhpStorm.
 * User: alex
 * Date: 12-05-06
 * Time: 8:56 AM
 * To change this template use File | Settings | File Templates.
 */


(function($) {

    $.esrimagemanager = function(element, options) {
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
            var title = "Add an Image";

            //var  html = '<form class="wysiwyg" id="wysiwyg-addImage">Click the field below to browse for and add an image or drop your image into this box<fieldset>' +
            //    '<input id="fileupload" type="file" name="files[]" />';

            var  html = '<form class="wysiwyg" id="wysiwyg-addImage"><fieldset>' +
            '<span class="btn btn-success fileinput-button ui-button ui-widget ui-state-default ui-corner-all ui-button-text-icon-primary" role="button" aria-disabled="false">' +
            '<span class="ui-button-icon-primary ui-icon ui-icon-plusthick"></span><span class="ui-button-text"><i class="icon-plus icon-white"></i><span>Add files...</span></span>' +
            '<input id="fileupload" type="file" name="files[]" multiple></span>';
            
            html+=  '<table class="table table-striped ten columns alpha clearfix">'
                    +    '<tbody class="files ten columns alpha" data-toggle="modal-gallery" data-target="#modal-gallery"></tbody></table>'
                    +    '<!-- The template to display files available for upload -->'
                    +           '<script id="template-upload" type="text/x-tmpl">'
                    +               '{% for (var i=0, file; file=o.files[i]; i++) { %}'
                    +                  '<tr class="template-upload fade">'
                    +                         '<td class="preview"><span class="fade"></span></td>'
                    +                         '<td class="title"><label>Title<input type="text" name="title[]" required></label><input type="hidden" value="QuickImage" name="ctype[]" ></label>'
                    //+                         '<td class="title"><label>Title'
                    //+						  '<input id="color" name="color" type="text" class="tooltip-north editfield color required notEdited" value="Enter image title" onfocus="removeEditLabel(\'color\',\'What color is the bike?\')">'
                    //+						  '<label for="color" generated="true" class="error" style="">This field is required.</label>'
                    //+						  '</label>'
                    +                         '    <div class="checkbox"><label>Reorient: <input type="checkbox" value="1" name="reorient[]" /></label></div>'
                    +                         '    <div class="checkbox"><label>Use Location: <input type="checkbox" value="1" name="uselocation[]" /></label></div>'
                    +                         '</td>'
                    +           '{% if (file.error) { %}'
                    +            '<td class="error" colspan="2"><span class="label label-important">{%=locale.fileupload.error%}</span> {%=locale.fileupload.errors[file.error] || file.error%}</td>'
                    +           '{% } else if (o.files.valid && !i) { %}'
                    //+      '<td>'
                    //+        ' '
                    +              ' <!--</td>--><td class="start">{% if (!o.options.autoUpload) { %}'
                    +         '<div class="btnControl start"><button class="btn-primary">'
                    +         ' <span>{%=locale.fileupload.start%}</span>'
                    +            '</button></div>'
                    +       '{% } %}'
                    +     '{% if (!i) { %}'
                    +         ' <div class="btnControl cancel"><button class="btn-warning">'
                    +       ' <span>{%=locale.fileupload.cancel%}</span>'
                    +      ' </button></div>'
                    + ' {% } %}' +
                    '<div class="progress progress-success progress-striped active"><div class="bar" style="width:0%;"></div></div></td>'
                    + ' {% } else { %}'
                    +  '  <td></td>'
                    +    ' {% } %}'
                    +        '       </tr>'
                    + '{% } %}'
                    + '  </script>';
            + '<div class="form-row form-row-last"><label for="name"></label><div class="form-row-value"><button type="submit" class="button"><span>Insert Image</span></button> ' +
            + '<input type="reset" value="Cancel" class="cancel-post"/></div></div></fieldset></form>';

            $dlg = $("<div></div>");
            $dlg.attr('id', 'imagePopup')
                .html(html)
                .appendTo($element);

            bindUpload();

            $(".cancel-post").click (function(e) {
                e.preventDefault();
                closeDialog();
            });

            $("#imagePopup").dialog({
                autoOpen:true,
                title:title,
                resizable:false,
                modal:true,
                width: 600,
                show: {effect: 'drop', direction: 'up'},
                hide: {effect: 'drop', direction: 'down'}
            });

            $(".ui-dialog-titlebar-close").click(function(e) {
                e.preventDefault();
                if (callback) callback();
            });
        }


        var closeDialog = function() {
            $("#imagePopup").dialog('close');
            if (callback) callback();
        }

        var bindUpload = function() {
            var path = service_endpoint('/story/0');
            $('#wysiwyg-addImage').fileupload({
                type: 'Post',
                url: path,
                uploadTemplateId: 'template-upload',
                downloadTemplateId: false,
                multipart: true,
                maxFileSize: 5000000,
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i//

            }).bind('fileuploaddone', function (e, data) {
                if ( data && data.result && data.result.id && data.result.id > 0)
                    insertObject( data.result.id, data.result.ctype, data.result.title, "", data.result.data.thumbImg, data.result.data, true);
            }).bind('fileuploadsubmit', function (e, data) {
                var inputs = data.context.find(':input');
                var token = document.createElement('input');
                token.setAttribute("name", "token[]");
                token.setAttribute("type", "hidden");
                token.setAttribute( "value" ,getCookie('token'));
                inputs.push ( token);
                if (inputs.filter('[required][value=""]').first().focus().length)
                    return false;
                data.formData = inputs.serializeArray();
            });
        }

        plugin.init();


    }

    $.fn.esrimagemanager = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('esrimagemanager')) {
                var plugin = new $.esrimagemanager(this, options);
                $(this).data('esrimagemanager', plugin);
            }
        });
    }
})(jQuery);

