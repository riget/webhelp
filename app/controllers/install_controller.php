<?php 
/** 
 * Install Controller
 *
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

uses('model' . DS . 'connection_manager');

class InstallController extends Controller
{
	var $uses = array('Install');
	
	function beforeFilter()
	{
		CONFIGURE::write('debug', 0);
		$this->layout = 'install';
		
        if (!file_exists(TMP . 'not_yet_installed.txt')) {
            echo 'Application already installed.';
            exit();
        }	
	}
	
	
	function index()
	{
		$checkdirs = array(	TMP,
							APP . 'webroot' . DS . 'uploaded',
							APP . 'config' . DS . 'dbsettings.php');
							
		$errors = array();
									
		foreach ($checkdirs as $dir)
		{ 
			if (!is_writable($dir))
				array_push($errors, true);
			else
				array_push($errors, false);
		}
		
		$this->set('checkdirs', $checkdirs);
		$this->set('errors', $errors);
			
	}
	
	function database()
	{	
		if (!empty($this->data))
		{
			define('DB_HOST', 		$this->data['host']);
			define('DB_USER', 		$this->data['user']);
			define('DB_PASSWORD',	$this->data['password']);
			define('DB_DATABASE',	$this->data['database']);
			
	        $db = ConnectionManager::getDataSource('default');
	
	        if(!$db->isConnected()) {
	            $this->set('error', 'Konnte keine Datenbank-Verbindung herstellen. Bitte überprüfen Sie die Daten!');	   
	        }
			else
			{
				$fp = fopen(CONFIGS . 'dbsettings.php', 'w');
				fputs($fp, "<?php\n");
				fputs($fp, "define('DB_HOST', 		'" . $this->data['host'] . "');\n");
				fputs($fp, "define('DB_USER', 		'" . $this->data['user'] . "');\n");
				fputs($fp, "define('DB_PASSWORD', 	'" . $this->data['password'] . "');\n");
				fputs($fp, "define('DB_DATABASE', 	'" . $this->data['database'] . "');");
				
				fclose($fp);
				
				if ($this->data['create_tables'])
				{
					$this->__executeSQLScript($db, CONFIGS . 'sql' . DS . 'install' . DS . 'tables.sql');
					$this->__executeSQLScript($db, CONFIGS . 'sql' . DS . 'install' . DS . 'data.sql');
				}
				
				
		        $this->redirect('/install/user');
			}		   
		}
		else
		{
			//unlink(CONFIGS . 'dbsettings.php');
			$fp = fopen(CONFIGS . 'dbsettings.php', 'w');
			fputs($fp, '');
			fclose($fp);			
		}
	
	}
	
	function user()
	{
		if (!empty($this->data))
		{
			$user = trim($this->data['user']);
			$password = trim($this->data['password']);
			
			if (($user == '') || ($password == ''))
			{
	            $this->set('error', 'Bitte geben Sie Username und Passwort des Administrators an!');
	            return;	   
			}
			
			if (strlen($password) < 6)
			{
				$this->set('error', 'Das Pa&suml;wort mu&suml; mindestens 6 Zeichen lang sein!');
	            return;	   
			}
			
	        $db = ConnectionManager::getDataSource('default');			
			$db->query('insert into users(username, password, is_admin) values(\'' . $user . '\', \'' . md5($password) . '\', 1);');
			
			$this->redirect('/install/finished');
		}	
	}
	
	function finished()
	{

	}
	
    function __executeSQLScript($db, $fileName) {
        $statements = file_get_contents($fileName);
        $statements = explode(";\n", $statements);

        foreach ($statements as $statement) {
            if (trim($statement) != '') {
                $db->query($statement);
            }
        }
    }
	
	
}
?>