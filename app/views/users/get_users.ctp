<?php 
$userData = array();
foreach ($users as $user):
	array_push($userData, $user['User']);	
endforeach;

$data = array(	'success' 	=> true,
				'message'	=> 'Loaded data',
				'data' 		=> $userData);
echo $ext->object($data);
?>