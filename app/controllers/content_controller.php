<?php 
/**
 * Content Controller
 *
 * All content related functions
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

class ContentController extends AppController
{
	var $uses = array(	'Content', 
						'Keyword',
						'ContentKeyword');
	
	var $layout = 'ajax';
	
	function beforeFilter()
	{
		parent::beforeFilter();
		
	 	$this->Auth->allow(	'index', 
	 						'read', 
	 						'tree', 
	 						'indextree', 
	 						'getpath', 
	 						'keyword_contents',
	 						'search');
	}
	
	/**
	 * Read content data by id
	 * 
	 * @param $id
	 * @return unknown_type
	 */
	function read($id = null)
	{
		Configure::write('debug', 0);
		
		if (empty($id))
			$id = $this->postValue('id');
			
		$content = $this->Content->findById($id);

		// if no text was saved before (null), convert it to an empty string
		// therefore the frontend doesnt treat it as 'not found'
		if ((!empty($content)) && (empty($content['Content']['text'])))
			$content['Content']['text'] = '';
				
		$content['Content']['nextNode']   = $this->Content->getNextNode($content);
		$content['Content']['prevNode']   = $this->Content->getPrevNode($content);
		$content['Content']['parentNode'] = $this->Content->getparentnode($id);
		
		$this->set('content', $content);
	}
	
	/**
	 * Get children of a node 
	 * Retrieves the data the Ext.tree-Object needs to build up a tree view
	 * 
	 * @param $id
	 * @return unknown_type
	 */
	function tree($id = null)
	{
		Configure::write('debug', 0);

		if (empty($id))
		{
			$id = $this->params['form']['node'];
			if ($id == '')
				$id = 0;
		}
		
		$content = $this->Content->getChildren($id, true);

		$this->set('id', $id);
		$this->set('content', $content);
	}
	
	/**
	 * Get all all keywords
	 * The Ext.tree-object has been used also to display the keywords, despite this is not a real tree or a tree only with one level
	 * 
	 * @return unknown_type
	 */
	function indextree()
	{
		Configure::write('debug', 0);
		
		$this->ContentKeyword->contain(array('Keyword'));
		$this->set('keywords', $this->ContentKeyword->find('all', 
										array('group'	=> 'ContentKeyword.keyword_id',
											  'order' 	=> 'Keyword.text')));
	}
	
	/**
	 * Retrieve path to a node
	 * 
	 * @param $id
	 * @return none
	 */
	function getpath($id = null)
	{
		Configure::write('debug', 0);
		
		if (empty($id))
			$id = $this->postValue('id');		
		
		$path = $this->Content->getPath($id);
		$this->set('path', $path);
	}
	
	/**
	 * Get contents for a keyword
	 * 
	 * @par integer $keywordId
	 * @return void
	 */
	function keyword_contents($keywordId = null)
	{
		Configure::write('debug', 0);
		$keywordId = $this->postValue('keywordId');
		
		$contents = $this->ContentKeyword->find('all',
									array('conditions'	=> array(
												'keyword_id'		=> $keywordId),
										  'order'		=> 'Content.title'));
		
		$this->set('contents', $contents);								
	}
	
	/**
	 * Perform a search in the content
	 * @@TODO: search in a text-only field, which should be created on every save and not in the html-content, because now we also find non-visible html tags... 
	 * 
	 * @return unknown_type
	 */
	function search()
	{
		Configure::write('debug', 0);
		
		$searchTerm = $this->postValue('searchTerm');
		$titleOnly  = $this->postValue('titleOnly');

		if ($titleOnly == 'true') {
			$conditions = 'MATCH(Content.title) 
                    						AGAINST(\'' . $searchTerm . '\' IN BOOLEAN MODE)';
		} else {
			$conditions = 'MATCH(Content.title, Content.text) 
                    						AGAINST(\'' . $searchTerm . '\' IN BOOLEAN MODE)';			
		}
		
		$contents = $this->Content->find('all',
									array('conditions'	=> $conditions,
										  'order'		=> 'Content.title'));
		
		$this->set('contents', $contents);			
		
	}
	
	/**
	 * Populate with dummy data
	 * 
	 * @return none
	 */
	function populate()
	{
		//$this->Content->populate();
	}
	
	/**
	 * Save content data
	 * 
	 * @return none
	 */
	function save()
	{
		//Configure::write('debug', 0);
		$data   	= $this->postValues();
		$contentId 	= $data['id']; 
		
		$this->Content->create(array('id' 		=> $data['id'], 
									 'text' 	=> $data['text'],
									 'keywords' => $data['keywords']));
		
		$keywords = explode(' ', $data['keywords']);
		
		$this->ContentKeyword->deleteAll( array(
									 'content_id'	=> $contentId));
		
		foreach ($keywords as $keyword)
		{
			$keyword = trim($keyword);
			
			if ($keyword == '')
				continue;
				
			$this->Keyword->id = null;
			if ($this->Keyword->save(array('text'	=> $keyword)))
				$keywordId = $this->Keyword->getInsertID();
			else
			{
				$keywordData = $this->Keyword->find(array('text'	=> $keyword));
				$keywordId = $keywordData['Keyword']['id'];
			}
			
			$this->ContentKeyword->id = null;
			$this->ContentKeyword->save(array(
											'content_id'	=> $contentId,
											'keyword_id'	=> $keywordId));
		}
		$this->Content->save();
	}
	
	/**
	 * Save content title
	 * 
	 * @return none
	 */
	function saveTitle()
	{
		//Configure::write('debug', 0);

		$parentId = $this->postValue('parentId');
		if ($parentId == 0)
			$parentId = null;

		$data = array(	'id'	 		=> $this->postValue('id'),
						'title' 		=> $this->postValue('title'));
					
		if ($parentId != $this->postValue('id'))
			$data['parent_id'] = $parentId;
			
		$this->Content->create($data);
		$this->Content->save();		
	}

	/** 
	 * Add a new content 
	 * 
	 * @return none
	 */
	function addContent()
	{
		Configure::write('debug', 0);
				
		$parentId = $this->postValue('parentId');
		if ($parentId == 0)
			$parentId = null;
			
		$this->Content->create(array('parent_id'	=> $parentId,
									 'title'		=> $this->postValue('title')));
		$this->Content->save();
		$this->set('id', $this->Content->getInsertID());
	}
	
	/**
	 * Delete a content
	 * 
	 * @return none
	 */
	function deleteContent()
	{
		$id = $this->postValue('id');

		$this->Content->removeFromTree($id, true);
		$this->ContentKeyword->deleteAll(array('content_id'	=> $id));
	}
	
	/**
	 * Reorder the nodes after drag and drop if the node was only moved up or down under the same parent
	 * 
	 * @return none
	 */
	function reorder() {
		$node 	= intval($this->postValue('node'));
		$delta 	= intval($this->postValue('delta'));
		
		if ($delta > 0) {
			$this->Content->movedown($node, abs($delta));
		} elseif ($delta < 0) {
			$this->Content->moveup($node, abs($delta));
		}
		
		exit('1');
	}
	
	/**
	 * Reparent the nodes after a drag and drop if the node was moved under a new parent
	 * 
	 * @return none
	 */
	function reparent() {
		$node 		= intval($this->postValue('node'));
		$parent		= intval($this->postValue('parent'));
		$position	= intval($this->postValue('position'));
		
		$this->Content->id = $node;
		$this->Content->saveField('parent_id', $parent);
		
		if ($position == 0) {
			$this->Content->moveup($node, true);
		} else {
			$count = $this->Content->childcount($parent, true);
			$delta = $count - $position - 1;
			if ($delta > 0) {
				$this->Content->moveup($node, $delta);
			}
		}
		
		exit('1');
	}
}
?>