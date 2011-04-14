<?php 
/**
 * ContentKeyword Model
 *
 * Connects content with keywords
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

class ContentKeyword extends AppModel {
	var $useTable 	= 'content_keyword';

	var $belongsTo 	= array('Content' 	=> array(
								'className'		=> 'Content',
								'foreignKey'	=> 'content_id'),
							'Keyword'	=> array(
								'className'		=> 'Keyword',
								'foreignKey'	=> 'keyword_id'));

}

?>