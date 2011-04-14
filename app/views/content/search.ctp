<?php 
$data = array();

foreach ($contents as $content)
{
	$data[] = array(
			'id'	=> $content['Content']['id'],
			'text'  => $content['Content']['title']
	);
}

echo $javascript->object(array("contents" => $data));