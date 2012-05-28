<?php

// Prints a titlebox suitable for the create page

class Zend_View_Helper_Scripts extends Zend_View_Helper_Abstract {

	public function Scripts($layout = 'base') 	{
	
		if(Zend_Registry::get('minify') == 1) {
		    $v = Zend_Registry::get('version');
            ob_start();

            Zend_View_Helper_Scripts::CommonExternalJS(); // Cannot be MINified
            echo '
                <link rel="stylesheet" type="text/css" href="/lib/min/g=css&v=' . $v.'" />
                <script type="text/javascript" src="/lib/min/g=js&v=' . $v.'" ></script>';
       } else {
            ob_start();
            
            // @TODO: change above if condition - add settings
            if ($layout == 'base') {
            
            	Zend_View_Helper_Scripts::BaseCss();
            	Zend_View_Helper_Scripts::CommonExternalJS();
            	Zend_View_Helper_Scripts::BaseJS();
            }
	    }

        return ob_get_clean();
    }

    protected function CommonExternalJS() {

        echo '<!--common JS-->
            <!--<script src="http://code.jquery.com/jquery-1.7.1.min.js"></script> -->
            <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
            <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.18/jquery-ui.min.js"></script>
            <script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=xa-4f638a1e6dabde18"></script>
            <script type="text/javascript" src="http://cdn.jquerytools.org/1.2.6/all/jquery.tools.min.js"></script>
            <script type="text/javascript" src="http://scripts.embed.ly/jquery.embedly.min.js"></script>
            <!-- end common js-->';
    }

    protected function BaseJS() {
        echo '<!-- base JS -->
            <script type="text/javascript" src="/js/jquery.thumbnailScroller.js"></script>
            <script type="text/javascript" src="/js/json2.js"></script>
            <script type="text/javascript" src="/js/jq/jquery.cuteTime.js"></script>
            <script type="text/javascript" src="/js/jq/jquery.scroll-top.js"></script>
            <script type="text/javascript" src="/js/jq/jquery.scrollTo.js"></script>
            <script type="text/javascript" src="/js/jq/jquery.lionbars.0.3.js"></script>
            <script type="text/javascript" src="/js/jq/jquery.ui.stars.js"></script>
            <script type="text/javascript" src="js/storejs/source/store.js" type="text/javascript"></script>
            <script type="text/javascript" src="js/localstore.js" type="text/javascript"></script>

			<!--
			<script type="text/javascript" src="/js/jq/curvycorners.src.js"></script>
			<script type="text/javascript" src="/js/jq/curvycorners.js"></script>
			-->
            <!-- end base JS -->';
    }


    protected function BaseCss() {
        echo '<!-- base CSS -->
        	<link rel="stylesheet" type="text/css" href="/css/base.css" />
            <link rel="stylesheet" type="text/css" href="/css/template.css" />
            <link rel="stylesheet" type="text/css" href="/css/skeleton.css" />
            <link rel="stylesheet" type="text/css" href="/css/jq/jquery-ui-1.8.18.custom.css" />
            <link rel="stylesheet" type="text/css" href="/css/jq/jquery.thumbnailScroller.css" />
            <link rel="stylesheet" type="text/css" href="/css/jq/jquery.ui.stars.css" />
            <link rel="stylesheet" type="text/css" href="/css/jq/jquery.lionbars.css" />
            <link rel="stylesheet" href="/css/blitzer/style.css" type="text/css" />
            <!-- end base CSS-->';

    }
}
