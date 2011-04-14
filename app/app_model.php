<?php 

class AppModel extends Model {
	
    var $actsAs = array('Containable');
    
    /*function children($parent)
    {
    	$children = $this->getChildren($parent, true);
    	
    	$i = 0;
    	foreach ($children as $child)
    	{
    		$childcount = $this->getChildCount($child[$this->name]['id'], true);
    		
    		if ($childcount > 0)
    			$children[$i][$this->name]['hasChildren'] = true;
    		else
    			$children[$i][$this->name]['hasChildren'] = false;
    			
    		$i++;
    	}
    	
    	return $children;	
    }*/
    
    
    function getChildren($parent)
    {
    	$children = $this->children($parent, true);
    	
    	$i = 0;
    	foreach ($children as $child)
    	{
    		$childcount = $this->childcount($child[$this->name]['id'], true);
    		
    		if ($childcount > 0)
    			$children[$i][$this->name]['hasChildren'] = true;
    		else
    			$children[$i][$this->name]['hasChildren'] = false;
    			
    		$i++;
    	}
    	
    	return $children;	
    }
}

?>