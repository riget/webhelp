<?php

class JsxHelper extends JavascriptHelper
{
	function includePackage($path)
	{
		$out = '';
		$filesPath = WWW_ROOT . 'js' . DS . $path;
		$dir = opendir($filesPath);
		
		while (false !== ($file = readdir($dir))) {
			$parts = explode('.', $file);
			if (is_array($parts) && count($parts) > 1) {
				$extension = end($parts);
				if ($extension == 'js')
				{
					$out.= "\n" . $this->link($path . '/' . $file);
				}
			}
		}
		$out .= "\n";
		return $out;
	}

    function serialize($data)
    {
        $data = $this->array_replace("\r", '', $data);
        $data = $this->array_replace("\n", '<br>', $data);
        
        $ret = serialize($data);        
        $ret = str_replace("'", '\\\'', $ret);
        return $ret;
    }

    function array_replace($from, $to, $array)
    {   
        $out = array();
        foreach ($array as $key => $val)
        {
            if (!is_array($val))
            {
                $out[$key] = str_replace($from, $to, $val);
            }
            else
            {
                $out[$key] = $this->array_replace($from, $to, $array[$key]);
            }
                  	
        }
        return $out;  
    }
}

?>
