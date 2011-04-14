<?php

class AppController extends Controller {
    
	var $uses		= array('Setting', 'User');
	
	var $helpers 	= array('Javascript', 'Html', 'Paginator', 'Jsx', 'Ext');
    
    var $components	= array('Auth');
      
  	var $userId;
  	
  	var $authUser;
    
    function beforeFilter()
    {
		Security::setHash("md5");
    	
    	$this->authUser = $this->Auth->user();
    	
    	if (!empty($this->authUser))
    		$this->userId = $this->authUser['User']['id'];
    	else
    		$this->userId = null;    	
    }
    
    function is_admin()
    {
    	$user = $this->User->findById($this->userId);
    	
    	if (!empty($user))
    		return $user['User']['is_admin'];
    	else
    		return false;
    }
    
    function beforeRender()
    {
    	Configure::write('debug', 0);
    	$pageTitle = $this->Setting->readValue('pageTitle');
    	$this->pageTitle = $pageTitle;	
    }
    
    function postValue($name)
    {
    	if (isset($this->params['form'][$name]))
    		return $this->params['form'][$name];
    	else
    		return ''; 
    }
    
    function postValues()
    {
    	return $this->params['form'];
    }
    

}

?>