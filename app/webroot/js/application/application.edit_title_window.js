/**
 * Edit Title Window
 * 
 * Window where to edit or add a title
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

EditTitleWindow = function(){
    
	// Tree
	this.tree = new Ext.tree.TreePanel({
        dataUrl: 'content/tree',
        border: false,
        title: '&Uuml;bergeordneter Titel',
        autoScroll: true,
        rootVisible: true,
        enableDrag: true,
		height: 400,
		autoScroll: true,
		ddScroll: true
    });
 
    this.root = new Ext.tree.AsyncTreeNode({
        text: '[ Hauptebene ]',
        draggable: true,
        id: '0'
    });
    this.tree.setRootNode(this.root);
    //this.root.expand();
	this.tree.on('click', this.onTreeClicked, this);	
 
 	// Form   
    this.contentTitle = new Ext.form.TextField({
        fieldLabel: 'Title',
        width: 360,
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'url',
        mode: 'local'
    });
    
    this.form = new Ext.FormPanel({
        labelAlign: 'top',
        items: this.contentTitle,
        border: false,
        bodyStyle: 'background:transparent;padding:10px;'
    });
    
	// Constructor
    EditTitleWindow.superclass.constructor.call(this, {
        title: '',
        id: 'newContentWindow',
        autoHeight: true,
        width: 400,
        resizable: false,
        plain: true,
        modal: true,
        y: 100,
        autoScroll: true,
        closeAction: 'hide',
        items: [this.tree, this.form],
        buttons: [{
            text: 'Save!',
            handler: this.onSave,
            scope: this
        }, {
            text: 'Cancel',
            handler: this.hide.createDelegate(this, [])
        }],
    });
}

Ext.extend(EditTitleWindow, Ext.Window, {
	selectedId: 	0,
	contentId:		0,
	
	onSave: function() {
		this.fireEvent('saveClicked', {
			title:  this.contentTitle.getValue(),
			parentId: this.selectedId,
			id: this.contentId
		});
		this.hide();
	},
	
	setType: function(type) {
		if (type == 'edit')
			this.setTitle('Titel &auml;ndern');
		if (type == 'add')
			this.setTitle('Neuen Inhalt hinzuf&uuml;gen');
	},
	
	onTreeClicked: function(node){
		this.selectedId = node.id;
	},
	
	selectNode: function(id) {
		this.selectedId = id;
		this.tree.getLoader().load(this.root, this.hasLoaded, this);
	},
	
	hasLoaded: function(node)
	{
		node = this.tree.getNodeById(this.selectedId);
		if (!node) 
		{
			// path not opened yet: retrive path from database
			Ext.Ajax.request({
				url: 'content/getpath',
				params: { id: this.selectedId},
				scope: this,
				success: function(result, request){
					path = result.responseText;
					this.openPath(path);
				}
			})		
		}
		else {
			path = node.getPath();
		    this.openPath(path);			
		}
	},
	
	openPath: function(path) {
		this.tree.selectPath(path);	
	}	
	
});
