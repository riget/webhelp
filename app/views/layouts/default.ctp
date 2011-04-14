<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<?php echo $html->charset(); ?>
	<title>
		<?php echo $title_for_layout; ?>
	</title>
	<?php
		echo $html->meta('icon');

        // Main css
        echo $html->css("main.css");
                
        //Load ExtJS CSS files
        echo $html->css("extjs/ext-all.css");
        
        echo $html->css("ext.ux.htmleditor.plugins.css");
     
        // Content css
        echo $html->css("content.css");
                
        //Load ExtJS JS files        
		echo $javascript->link('ext-3.3.0/adapter/ext/ext-base.js');
        echo $javascript->link('ext-3.3.0/ext-all.js');
		echo $javascript->link('ext-3.3.0/ux/FieldLabeler.js');
		echo $javascript->link('ext-3.3.0/ux/FieldReplicator.js');   	
		echo $javascript->link('ext-3.3.0/ux/MultiSelect.js');
		echo $javascript->link('ext-3.3.0/ux/ItemSelector.js');
        
        echo $javascript->link('Ext.ux.HtmlEditor.Plugins-0.2-all.js');
        echo $javascript->link('/tinymce/jscripts/tiny_mce/tiny_mce.js');
        echo $javascript->link('ext.ux.TinyMCE/Ext.ux.TinyMCE.js');
         
        // Ext ux extensions
        echo $jsx->includePackage('ux');  
                
        // Application package  
        echo $jsx->includePackage('application');        
  
	?>
</head>
<body>
		<!-- Loading wheel -->
	    <div id="loading">
	        <div class="loadingBg">
	            <div class="loadingText">Loading ...</div>
	        </div>
	    </div>
	    
	    <!-- Main content -->
	    <div id="content">
			<?php echo $content_for_layout; ?>

		</div>
	<?php echo $cakeDebug; ?>
</body>
</html>
