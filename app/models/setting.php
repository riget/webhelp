<?php 
/**
 * Settings Model
 *
 * Saves all settings
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

class Setting extends AppModel
{
	/**
	 * Read a settings value
	 * 
	 * @param $name
	 * @param $autoCreate
	 * @return string
	 */
	function readValue($name, $autoCreate = true)
	{
		$setting = $this->find(array('Setting.name' => $name));
		
		if (empty($setting) && ($autoCreate))
		{
			$data = array('name'	=> $name,
						  'value'	=> '');
			$this->save($data, false);
			return '';
		}
		else
			return $setting['Setting']['value'];
	}
	
	/**
	 * Saves a settings value
	 * 
	 * @param $name
	 * @param $value
	 * @return none
	 */
	function saveValue($name, $value)
	{
		$setting = $this->find(array('Setting.name' => $name));
		
		$data = array();
		if (!empty($setting))
			$data['id'] = $setting['Setting']['id'];
		
		$data['name'] 	= $name;
		$data['value'] 	= $value;
		
		$this->save($data, false);	
	}
	
}
?>