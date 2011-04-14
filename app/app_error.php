<?php
class AppError extends ErrorHandler {
	
	function error404()
	{
		$this->layout = 'error';
	} 
    
	public function missingController($params) {
		$this->layout = 'error';
		extract($params, EXTR_OVERWRITE);

		$controllerName = str_replace('Controller', '', $className);
		$this->controller->set(array(
			'controller' => $className,
			'controllerName' => $controllerName,
			'title' => __('Missing Controller', true)
		));
		
		$this->_outputMessage('missingController');		
	}
	
	function _outputMessage($template) {
		$this->controller->render($template, $this->layout);
		$this->controller->afterFilter();
		echo $this->controller->output;
	}	
	
}	
?>
