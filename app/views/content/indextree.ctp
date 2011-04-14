<?php
	$data = array();
	foreach($keywords as $keyword):
			$data[] = array(
				"text"			=> $keyword['Keyword']['text'],
				"id"			=> $keyword['Keyword']['id'],
				"cls"			=> "folder",
				"iconCls"		=> 'no-icon',
				"hidden"		=> false,
				"expandable" 	=> false,
				"leaf"			=> true);				
	endforeach;

	echo $javascript->object($data);
?>