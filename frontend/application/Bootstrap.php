<?php

class Bootstrap extends Zend_Application_Bootstrap_Bootstrap
{
	protected function _initAutoload()
	{
	    $autoloader = new Zend_Application_Module_Autoloader(array(
	        'namespace' => 'Application',
	        'basePath'  => APPLICATION_PATH,
	    ));

	    Zend_Controller_Action_HelperBroker::addPath(
	        APPLICATION_PATH . '/controllers/helpers', 
	        'Application_Controller_Helper_');
	
	    return $autoloader;
	}
	
	protected function _initLogger()
	{
	    $writer = new Zend_Log_Writer_Stream('../log/apperrors.log');
	    $loggerApp = new Zend_Log($writer);
	    Zend_Registry::set('loggerErrors', $loggerApp);
	    
	    $writer2 = new Zend_Log_Writer_Stream('../log/controller.log');
	    $loggerContr = new Zend_Log($writer2);
	    Zend_Registry::set('loggerContr', $loggerContr);
	    
	    $writer3 = new Zend_Log_Writer_Stream('../log/getrequest.log');
	    $loggerGet = new Zend_Log($writer3);
	    Zend_Registry::set('loggerGet', $loggerGet);
	    
	    $writer4 = new Zend_Log_Writer_Stream('../log/postrequest.log');
	    $loggerPost = new Zend_Log($writer4);
	    Zend_Registry::set('loggerPost', $loggerPost);
	    
	   	$writer5 = new Zend_Log_Writer_Stream('../log/putrequest.log');
	    $loggerPut = new Zend_Log($writer5);
	    Zend_Registry::set('loggerPut', $loggerPut);
	    
	    $writer6 = new Zend_Log_Writer_Stream('../log/deleterequest.log');
	    $loggerDel = new Zend_Log($writer6);
	    Zend_Registry::set('loggerDel', $loggerDel);
	    
	    Zend_Registry::set('minify', 0);
        Zend_Registry::set('version', '1.00.001'); // used for flushing the JS/CSS caches
	    
	    // may be log all actions like this in one place
	    // $this->element->getAction(); 
	}
	
	protected function _initAuth()
	{
		if(isset($_COOKIE['token']) && $_COOKIE['expires'] >= time())
		{
			Zend_Registry::set('token', $_COOKIE['token']);
			Zend_Registry::set('uid', $_COOKIE['uid']);
			Zend_Registry::set('logged', 1);		
		}
		else
		{
			Zend_Registry::set('logged', 0);
			Zend_Registry::set('uid', NULL);
			Zend_Registry::set('token', NULL);
			
			// delete all cookies					
			//setcookie("username", "", time()-3600,"/");
			setcookie("uid","", time()-3600, "/"); 
			setcookie("token","", time()-3600, "/");
			setcookie("expires","", time()-3600, "/");
		}	
	}
	
	public function _initRoutes() 
	{ 
		
		$frontController = Zend_Controller_Front::getInstance(); 
		$router = $frontController->getRouter();
		
		// Adding a route for search (with a search term)
		$route = new Zend_Controller_Router_Route ( 'search/:asin/',
		array('controller' => 'Search', 'action' => 'index', 'asin'	=> null)
		);
		
		// Assigning a unique name to the Route
		$router->addRoute('search-asin', $route);
		
		// Adding a route for search (with a search term)
		$route = new Zend_Controller_Router_Route ( '',
		array('controller' => 'Index', 'action' => 'index')
		);
		
		// Assigning a unique name to the Route
		$router->addRoute('home', $route);
		
	}

}

