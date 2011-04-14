<?php 
/**
 * Content Model
 *
 * Saves all content data
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

class Content extends AppModel {
	var $useTable 	= 'content';
	
	var $actsAs   	= array('Tree');
	

	/**
	 * Retrieves next node in the content tree
	 * 
	 * @param $data
	 * @return unknown_type
	 */
	function getNextNode($data)
	{		
		return $this->find('first', array(
					'conditions'	=> array($this->name . '.lft > ' . $data[$this->name]['lft']),
					'order'			=> $this->name . '.lft'));							  					
	}
	
	/**
	 * Retrieves previous node in the content tree
	 * 
	 * @param $data
	 * @return unknown_type
	 */
	function getPrevNode($data)
	{
		return $this->find('first', array(
					'conditions'	=> array($this->name . '.lft < ' . $data[$this->name]['lft']),
					'order'			=> $this->name . '.lft DESC'));		
	}
	
	
	/**
	 * Populate with some dummy data for testing
	 * 
	 * @return unknown_type
	 */
	function populate()
	{
    	$this->create(array('title' => 'Harry Potter'));
    	$this->save();
        
        $parent_id = $this->id;
        
        $this->create(array('parent_id' => $parent_id, 'title' => 'Ron Weasley'));
        $this->save();
        
        $this->create(array('parent_id' => $parent_id, 'title' => 'Hermione Granger'));
        $this->save();
        
        $this->create(array('parent_id' => $parent_id, 'title' => 'Adam Royle'));
        $this->save();
            
        $this->create(array('parent_id' => $this->id, 'title' => 'Lord Voldemort'));
        $this->save();
        
    	$this->create(array('title' => 'Albus Dumbledore'));
    	$this->save();
        
        $parent_id = $this->id;
        
        $this->create(array('parent_id' => $parent_id, 'title' => 'Professor McGonagall'));
        $this->save();
            
        $this->create(array('parent_id' => $this->id, 'title' => 'Professor Flitwick'));
        $this->save();
        
        $this->create(array('parent_id' => $parent_id, 'title' => 'Severus Snape'));
        $this->save();
        
        $this->create(array('parent_id' => $parent_id, 'title' => 'Hagrid'));
        $this->save();	
	}
}

?>