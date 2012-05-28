<?php
class Application_Model_FormLogin extends Zend_Form 
{
	public function __construct($options = null) 
	{
		parent::__construct($options); 
		$this->setName('login');
		$this->setMethod('post'); 
		$this->setAction('');
		
		$username = new Zend_Form_Element_Text('username');
		
		//@TODO: set this to max length 
		$username->setAttrib('size', 18)
				 ->removeDecorator('label')
				 ->removeDecorator('htmlTag')
				 ->setAttrib('placeholder', 'Username');
		
			
		$username->setRequired(true);
		
		$pswd = new Zend_Form_Element_Password('pswd');
		$pswd->setAttrib('size', 20);
		$pswd->setRequired(true)
			 ->removeDecorator('label') 
		     ->removeDecorator('htmlTag')
			 ->setAttrib('placeholder', 'Password');
		
// 		$submit = new Zend_Form_Element_Submit('submit'); 
// 		$submit->setLabel('Login'); 
// 		$submit->removeDecorator('DtDdWrapper');
		
		$this->setDecorators( array( array('ViewScript', 
			array('viewScript' => '_form_login.phtml')))); 

		$this->addElements(array($username, $pswd));
	}
}