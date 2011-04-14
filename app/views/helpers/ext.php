<?php
/*
 * Helps to transfer the Cake database information to the ext framework
 * 
 * There are two ways to use it
 * 1. Load the Helper in the controller and use $ext->createExtConfigObject()
 * to generate a JSON configuration object that is digested by the CakePanel Javascript class
 * 2. If you want to use it from a static page, you have to tell it which Model and Controller
 * it should use, so ie $ext->createExtConfigObject(array(),"Article","articles")
 * 
 * @author	Florian Krause, http://cakext.mykita.com
 * @license http://www.opensource.org/licenses/mit-license.php The MIT License
 * @version	$Revision$
 * @modifiedby	$LastChangedBy$
 * @lastmodified	$Date$
 */

class ExtHelper extends AppHelper {
	/**
	 * @var array
	 */
	var $jsonReader = array();
	/**
	 * @var array
	 */
	var $columnModel = array();
	/**
	 * @var array
	 */
	var $formFields = array();
	/**
	 * @var Object
	 */
	var $model;
	/*
	 * @var string
	 */
	var $modelName;
	/**
	 * @var string
	 */
	var $controllerName;
	/**
	 * @var string
	 */
	var $pageTitle;
	
	/**
	 * Create an CakePanel config object. There are two ways to use it.
	 * 1. Load the Helper in the controller and use $ext->createExtConfigObject()
	 * to generate a JSON configuration object that is digested by the CakePanel Javascript class
	 * 2. If you want to use it from a static page, you have to tell it which Model and Controller
	 * it should use, so ie $ext->createExtConfigObject(array(),"Article","articles")
	 * @return String JSON config object
	 * @param Array $descriptions [optional] Override the column header, field displayed and form fields.
	 * If the passed value is an array, the first element is used as column header, the second one
	 * is the name of the database field displayed. You can also set pageTitle to set the panel's title
	 * @param String $model[optional] Model to work on
	 * @param String $controller[optional] Controller to work on
	 */			
    function createExtConfigObject($descriptions,$model = "",$controller = "",$remap = array())
    {			
		//if no model is present we load it from pass arguments
    	if (empty($this->params) && $model != "" && $controller != "") {
    		$this->params['models'][] = $model;
			$this->controllerName = $controller;
			$this->modelName = $model;
			App::import("Model",$this->modelName);
		} else {
			$this->controllerName = $this->params['controller'];
		}

        $this->model = new $this->params['models'][0];
		$this->modelName = $this->model->name;

		//which additional models does entry belong to
		$belongsToArray = array();
		foreach ($this->model->belongsTo as $key => $value) {
			$belongsToClass = new $value['className'];	
			$belongsToArray[$value['foreignKey']] = array('table'=>$belongsToClass->useTable,
														'model'=>$belongsToClass->name);				
		}
		//entries are habtm
		$hasManyArray = array();
		foreach ($this->model->hasAndBelongsToMany as $key => $value) {			
			$hasManyClass = new $value['className'];			
			$hasManyArray[$value['className']] = array('table'=>$hasManyClass->useTable,
										'model'=>$hasManyClass->name,'type'=>'habtm');			
		}
		//entries are hasMany
		foreach ($this->model->hasMany as $key => $value) {			
			$hasManyClass = new $value['className'];			
			$hasManyArray[$value['className']] = array('table'=>$hasManyClass->useTable,
										'model'=>$hasManyClass->name,'type'=>'hasmany');			
		}
		//here we start iterating the model
        foreach ($this->model->_schema as $key => $value) {
			//fill jsonReader fields ... we only need name and mapping
			$tempArray = array();
			$tempArray = array('name'=>$key,'mapping' => $this->model->name.'.'.$key);
			//if foreign key we change the mapping
			if (isset($belongsToArray[$key])) {
				//check if description for key is array, if so, remap 
				if (isset($descriptions[$key]) && is_array($descriptions[$key])) {
					$tempArray['mapping'] = $belongsToArray[$key]['model'].".".$descriptions[$key][1];
				} elseif (isset($this->model->$belongsToArray[$key]['model']->displayField)) {
                	$tempArray['mapping'] = $belongsToArray[$key]['model'].'.'.$this->model->$belongsToArray[$key]['model']->displayField;
        		} else {
					$tempArray['mapping'] = $belongsToArray[$key]['model'].".name";
				}				
			}			
			$this->jsonReader[] = $tempArray;
			unset($tempArray);
			
			//fill columnModel fields, some tweaking required				
			$tempArray['dataIndex'] = $key;
			if (isset($descriptions[$key])) {
				if (is_array($descriptions[$key])) {
					$tempArray['header'] = $descriptions[$key][0];
				} else {
					$tempArray['header'] = $descriptions[$key];
				}
			} else {
				$tempArray['header'] =  ucfirst($key);
			}
			
			if (isset($value['key']) && $value['key'] == "primary") {
				$tempArray['hidden'] = true;
			}
			//cant sort by text fields
			if ($value['type'] == 'text') {
				$tempArray['sortable'] = false;
				//cut off long text
				$tempArray['renderer'] = "function(value) {return Ext.util.Format.ellipsis(value,50)}";
			} else {
				$tempArray['sortable'] = true;
			}
			if ($value['type'] == 'boolean') {
				$tempArray['renderer'] = "Ext.ux.CakeHelper.renderCheckbox";
			}
			if ($value['type']== "datetime" || $value['type'] == "timestamp") {
				//date reformating perhaps
			}
			if ($value['type'] == "integer") {
				//anything to do with numbers?
			}
			$this->columnModel[] = $tempArray;			
			unset($tempArray);		
									
			//finally the form fields ... a lot of tweaking :)
			$tempArray['fieldLabel'] = isset($descriptions[$key])? $descriptions[$key]: ucfirst($key);
			$tempArray['name'] = "data[{$this->params['models'][0]}][{$key}]";

			if (isset($value['key']) && $value['key'] == "primary") {
				$tempArray['xtype'] = 'hidden';
			}
			//dont want to modify these
			if ($key == "modified" || $key == "created" || $key == "updated") {
				$tempArray['xtype'] = 'hidden';
				$tempArray['disabled'] = true;
			}			
			if ($value['type'] == "text") {
				$tempArray['xtype'] = 'textarea';
			}
			
			if ($value['type'] == "boolean") {
				$tempArray['xtype'] = "xcheckbox";
			}
			
			//more advanced stuff, check for belongsTo
			if (isset($belongsToArray[$key])) {
				$tempArray['fieldLabel'] = $belongsToArray[$key]['model'];
				$tempArray['name'] = "data[".$belongsToArray[$key]['model']."][{$key}]";
				$tempArray['xtype'] = "combo";
				$tempArray['mode'] = "local";
				$tempArray['store'] = "";
				$tempArray['selectOnFocus'] = true;
				$tempArray['displayField'] = 'text';
				$tempArray['valueField'] = 'value';
				$tempArray['comboStore'] = $belongsToArray[$key]['table'];
				$tempArray['triggerAction'] = "all";
				$tempArray['hiddenName'] = "data[".$this->modelName."][{$key}]";
				
			}	
			$this->formFields[] = $tempArray;
        }
		unset($tempArray);
		
		//fill in the hasMany and hasAndBelongsToMany fields, datastore name (in json reply)
		//must be the same as the associated model's database name. see /app/views/movies/js/index.json					
		foreach ($hasManyArray as $key => $value) {
			//first add the reader config
			$this->jsonReader[] = array('name'=>$value['table'],'mapping'=>$key);
			//then the column config. if description for key is array, only use the first one
			if (isset($descriptions[$key])) {
				if (is_array($descriptions[$key])) {
					$tempArray['header'] = $descriptions[$key][0];
				} else {
					$tempArray['header'] = $descriptions[$key];
				}
			} else {
				$tempArray['header'] =  ucfirst($key);
			}		
			
			$tempArray['sortable'] = false;
			$tempArray['dataIndex'] = $value['table'];
			$tempArray['renderer'] = "Ext.ux.CakeHelper.renderHasMany";
			//display selected field in habtm list
			if (isset($descriptions[$key]) && is_array($descriptions[$key])) {
				$tempArray['remap'] = $descriptions[$key][1];
			}
			$this->columnModel[] = $tempArray;
			unset($tempArray);
			//and the forms. We only use habtm since editing hasMany would involve
			//updating foreign tables. This is the same behaviour
			//as in the default Cake scaffolds
			if ($value['type'] == "habtm")
			{
				$tempArray['xtype']	= "multiselect";
				$tempArray['fieldLabel'] = $value['model'];
				$tempArray['name'] = "data[".$value['model']."][".$value['model']."]";
				$tempArray['store'] =  '';
				$tempArray['multiStore'] = $value['table'];
				$tempArray['valueField'] = "value";
				$tempArray['displayField'] = "text";
				$tempArray["allowBlank"]  = true;
				$tempArray["legend"] = "Hold Ctrl (PC)/Alt (Mac) to select multiple";									;
				$this->formFields[] = $tempArray;
				unset($tempArray);
			}
		}
		//set pagetitle, could also do that on the javascript object generated
        $this->pageTitle = isset($descriptions['pageTitle']) ? $descriptions['pageTitle'] : $this->modelName." Page";
        $output = "{
            controllerConfig: '{$this->controllerName}',
            jsonReaderFields: {$this->Object($this->jsonReader)},
			columnModelFields: {$this->Object($this->columnModel,
					array('stringKeys' => array('renderer'),'quoteKeys'=>false))},
			formFields: {$this->Object($this->formFields)},
			title: '{$this->pageTitle}',
			modelName: '{$this->model->name}'
             
        }";
		//empty vars so they dont interfere with next run
		$this->jsonReader = array();
		$this->columnModel = array();
		$this->formFields = array();
		unset($this->model);
		$this->modelName = "";
		$this->controllerName = "";
		$this->pageTitle = "";
		unset($this->params);
        return $output;    
            
    }
	// we use a custom Javascript Object (ie Array to JSON) method since
	// the Cake javascript helper can't handle quotes in functions passed via json
	// only thing that has changed a bit is the value method

	/**
	 * Generates a JavaScript object in JavaScript Object Notation (JSON)
	 * from an array
	 *
	 * @param array $data Data to be converted
	 * @param array $options Set of options: block, prefix, postfix, stringKeys, quoteKeys, q
	 * @param string $prefix DEPRECATED, use $options['prefix'] instead. Prepends the string to the returned data
	 * @param string $postfix DEPRECATED, use $options['postfix'] instead. Appends the string to the returned data
	 * @param array $stringKeys DEPRECATED, use $options['stringKeys'] instead. A list of array keys to be treated as a string
	 * @param boolean $quoteKeys DEPRECATED, use $options['quoteKeys'] instead. If false, treats $stringKey as a list of keys *not* to be quoted
	 * @param string $q DEPRECATED, use $options['q'] instead. The type of quote to use
	 * @return string A JSON code block
	 */
	function object($data = array(), $options = array(), $prefix = null, $postfix = null, $stringKeys = null, $quoteKeys = null, $q = null) {
		if (!empty($options) && !is_array($options)) {
			$options = array('block' => $options);
		} else if (empty($options)) {
			$options = array();
		}

		$defaultOptions = array(
			'block' => false, 'prefix' => '', 'postfix' => '',
			'stringKeys' => array(), 'quoteKeys' => true, 'q' => '"'
		);
		$options = array_merge($defaultOptions, $options, array_filter(compact(array_keys($defaultOptions))));

		if (is_object($data)) {
			$data = get_object_vars($data);
		}

		$out = $keys = array();
		$numeric = true;

		if (is_array($data)) {
			$keys = array_keys($data);
		}

		if (!empty($keys)) {
			$numeric = (array_values($keys) === array_keys(array_values($keys)));
		}

		foreach ($data as $key => $val) {
			if (is_array($val) || is_object($val)) {
				$val = $this->object($val, array_merge($options, array('block' => false)));
			} else {
				$quoteStrings = (
					!count($options['stringKeys']) ||
					($options['quoteKeys'] && in_array($key, $options['stringKeys'], true)) ||
					(!$options['quoteKeys'] && !in_array($key, $options['stringKeys'], true))
				);
				//check for renderer calls
				$val = ($key == "renderer") ? $this->value($val, $quoteStrings,false) :$this->value($val, $quoteStrings);
			}
			if (!$numeric) {
				$val = $options['q'] . $this->value($key, false) . $options['q'] . ':' . $val;
			}
			$out[] = $val;
		}

		if (!$numeric) {
			$rt = '{' . join(',', $out) . '}';
		} else {
			$rt = '[' . join(',', $out) . ']';
		}
		
		$rt = $options['prefix'] . $rt . $options['postfix'];

		if ($options['block']) {
			$rt = $this->codeBlock($rt, array_diff_key($options, $defaultOptions));
		}

		return $rt;
	}
	/**
	 * Converts a PHP-native variable of any type to a JSON-equivalent representation
	 *
	 * @param mixed $val A PHP variable to be converted to JSON
	 * @param boolean $quoteStrings If false, leaves string values unquoted
	 * @param boolean $escapeString If false the returned values are not escaped. Used for passed functions
	 * @return string a JavaScript-safe/JSON representation of $val
	 */
	function value($val, $quoteStrings = true,$escapeString = true) {
		switch (true) {
			case (is_array($val) || is_object($val)):
				$val = $this->object($val);
			break;
			case ($val === null):
				$val = 'null';
			break;
			case (is_bool($val)):
				$val = ife($val, 'true', 'false');
			break;
			case (is_int($val)):
				$val = $val;
			break;
			case (is_float($val)):
				$val = sprintf("%.11f", $val);
			break;
			default:
				$val = $escapeString ? $this->escapeString($val): $val;
				if ($quoteStrings) {
					$val = '"' . $val . '"';
				}
			break;
		}
		return $val;
	}
	/**
	 * Escape a string to be JavaScript friendly.
	 *
	 * List of escaped ellements:
	 *	+ "\r\n" => '\n'
	 *	+ "\r" => '\n'
	 *	+ "\n" => '\n'
	 *	+ '"' => '\"'
	 *	+ "'" => "\\'"
	 *
	 * @param  string $script String that needs to get escaped.
	 * @return string Escaped string.
	 */
	function escapeString($string) {
		$escape = array("\r\n" => '\n', "\r" => '\n', "\n" => '\n', '"' => '\"', "'" => "\\'");
		return str_replace(array_keys($escape), array_values($escape), $string);
	}		
		
}
?>