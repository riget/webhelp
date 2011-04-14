<?php 
	echo '[';
	foreach ($settings as $setting):
		echo '{' . $setting['name'] . ': "' . $setting['value'] . '"}';
	endforeach;
	echo ']';
?>