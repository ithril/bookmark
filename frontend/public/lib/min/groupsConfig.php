<?php
/**
 * Groups configuration for default Minify implementation
 * @package Minify
 */

/** 
 * You may wish to use the Minify URI Builder app to suggest
 * changes. http://yourdomain/min/builder/
 *
 * See http://code.google.com/p/minify/wiki/CustomSource for other ideas
 **/

return array(
    'js' => array(
        '//js//jquery.thumbnailScroller.js' ,
        '//js//json2.js' ,
        '//js//jq//jquery.cuteTime.js' ,
        '//js//tabs.js' ,
        '//js//esrAjax.js' ,
        '//js//utils.js' ,
        '//js//location.js' ,
        '//js//jq//gmap3.js',
        '//js//jq//jquery.esrlocation.js',
        '//js//esrContent.js',
        '//js//jq//jquery.scroll-top.js',
        '//js//jq//jquery.scrollTo.js',
        '//js//jq//jquery.ui.stars.js',
        '//js//jq//jquery.lionbars.0.3.js',
        '//js//showdown.js'//,
		//'//js//jq//curvycorners.src.js',
		//'//js//jq//curvycorners.js'
    ),

    'css' => array(
        '//css//template.css' ,
        '//css//skeleton.css' ,
        '//css//jq//jquery-ui-1.8.18.custom.css' ,
        '//css//jq//jquery.thumbnailScroller.css',
        '//css//jq//jquery.ui.stars.css',
        '//css//jq//jquery.lionbars.css'
    ),

    'jscreate' => array(
        '//js//jq//jquery-ui-timepicker-addon.js',
        '//js//jq//jquery.ui.slideraccess.js' ,
        '//js//jq//jquery.validate.js' ,
        '//js//jq//additional-methods.js' ,
        '//js//jq//jquery.fileupload.js' ,
        '//js//jq//tmpl.js' ,
        '//js//jq//jquery.fileupload-locale.js' ,
        '//js//jq//jquery.fileupload-load-image.js' ,
        '//js//jq//jquery.fileupload-ui.js' ,
        '//js//jq//jquery.fileupload-jui.js' ,
        '//js//jq//jquery.iframe-transport.js' ,
        '//js//create.js',
        '//js//tinymce//jquery.tinymce.js',
        '//js//jq//jquery.esrlinkmanager.js',
        '//js//jq//jquery.esrvideomanager.js',
        '//js//jq//jquery.esrimagemanager.js',
        '//js//esrEditor.js'


    ),

    'csscreate' => array(
        '//css//jq//jquery.fileupload-ui.css'
    )
);