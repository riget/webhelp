<?php
	$data = array();
	foreach($content as $c):
			$data[] = array(
				"text"			=> $c['Content']['title'],
				"id"			=> $c['Content']['id'],
				"cls"			=> "folder",
				"hidden"		=> false,
				"draggable"		=> true,
				"allowDrag"		=> true,
				"allowDrop"		=> true,
				"allowChildren"	=> true,
				"isTarget"		=> true,
				//"iconCls"		=> ($c['Content']['hasChildren']) ? "": "x-tree-node-leaf",
				"expandable" 	=> $c['Content']['hasChildren'],
				"leaf"			=> !$c['Content']['hasChildren'],
				"href"			=> "#");				
	endforeach;

	echo $javascript->object($data);
?>