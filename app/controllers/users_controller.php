<?php 
/**
 * Users Controller
 *
 * All users related functions
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

class UsersController extends AppController
{
	var $uses = array('User');
	
	var $layout = 'ajax';
	
	function beforeFilter()
	{
			parent::beforeFilter();
			$this->Auth->allow('populate', 'is_logged_in');
			Configure::write('debug', 0);
	}
	
	/**
	 * Perform a login
	 * 
	 * @return none
	 */
	function login()
	{
		//$this->layout = 'ajax';
		Configure::write('debug', 0);
		$username = $this->postValue('username');
		$password = $this->postValue('password');
		
		$data['User']['username'] = $username;
		$data['User']['password'] = $password;
		
		$data = $this->Auth->hashPasswords($data);

		if ($this->Auth->login($data))
			$this->set('success', 1);
		else	
			$this->set('success', 0);
	}
	
	/**
	 * Logout
	 * 
	 * @return none
	 */
	function logout()
	{
		$this->Auth->logout();		
	}
	
	/**
	 * Check if the user is logged in
	 * 
	 * @return none
	 */
	function is_logged_in()
	{
		$user = $this->Auth->user();
		if (!empty($user))
			$this->set('success', 1);
		else
			$this->set('success', 0);	
	}
	
	/**
	 * Retrieve all users
	 * 
	 * @return none
	 */
	function get_users()
	{
		Configure::write('debug', 0);
		
		$users = $this->User->find('all');
		$this->set('users', $users);	
	}
	
	/**
	 * Retrieve data of a user

	 * @param $userId
	 * @return none
	 */
	function get_data($userId = null)
	{
		if (empty($userId) || (!$this->is_admin()))
			$userId = $this->userId;
		
		$user = $this->User->findById($userId);
		$this->set('user', $user);
	}
	
	/**
	 * Save data of a user
	 * 
	 * @return none
	 */
	function save_data()
	{
		Configure::write('debug', 2);	
		$action		= $this->postValue('action');	
		$username	= $this->postValue('username');
		$userId 	= $this->postValue('userId');
		$firstname 	= $this->postValue('firstname');
		$lastname  	= $this->postValue('lastname');
		$password	= $this->postValue('password');

		// check if the user is admin when changing another user id than actual logged in
		if (!$this->is_admin())
		{	
			if ($this->userId != $userId)
				return;
		}
		
		
		if ($action == 'add')
			$userId = null;
		else
		{
			if (empty($userId))
				$userId = $this->userId;
		}

		$data = array(	'id'		=> $userId,
					  	'firstname'	=> $firstname,
						'lastname'	=> $lastname
					);

		if ($action == 'add')
			$data['username'] = $username;
								
		if (!empty($password))
			$data['password'] = $this->Auth->password($password);
			
		pr($data);
		$this->User->save($data, false);
	}

	/**
	 * Delete a user
	 * 
	 * @return none
	 */
	function delete()
	{
		$userId = $this->postValue('userId');

		// check if the user is admin when deletin user
		if (!$this->is_admin())
			return;

		// check if a admin wants to delete himself, which is not allowed by now
		if ($userId == $this->userId)
			return;
		
		$this->User->delete($userId);
	}
}
?>
