<?php 
/**
 * Settings Controller
 *
 * Read and write settings values
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

class SettingsController extends AppController
{
	var $uses = array('Setting');
	
	var $layout = 'ajax';
	
	function beforeFilter()
	{
		parent::beforeFilter();
		
	 	$this->Auth->allow(	'read_value');
	}	
	
	/**
	 * Read all settings
	 * 
	 * @return none
	 */
	function read_settings()
	{
		Configure::write('debug', 0);		
		
		$settings = $this->Setting->find('all');
		$this->set('settings', $settings);
		
	}
	
	/**
	 * Read a specific settings value
	 * 
	 * @param $name
	 * @return none
	 */
	function read_value($name)
	{
		Configure::write('debug', 0);
		$value = $this->Setting->readValue($name);
		$this->set('value', $value);				
	}
	
	/**
	 * Save a settings value
	 * 
	 * @return none
	 */
	function save_value()
	{
		Configure::write('debug', 0);
		
		$name 	= $this->postValue('name');
		$value 	= $this->postValue('value');
		
		$this->Setting->saveValue($name, $value);		
	}
		
}

?>