/**
 * Index Tree Panel
 * 
 * Index panel on the left side where the keywords are shown
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

IndexTree = function() {
	IndexTree.superclass.constructor.call(this, {
		dataUrl: 'content/indextree',
		border: false,
		title: 'Index',
		autoScroll: true,
		rootVisible: false,
		lines: false,
		hideLabel: true
	});
	
	var root = new Ext.tree.AsyncTreeNode({
		text: 'Inhalt',
		draggable: false,
		id: '0'
	});
	
	this.setRootNode(root);
	
	this.on('beforeshow', this.beforeShow);
	
	this.on('click', this.indexSelect);
	
}

Ext.extend(IndexTree, Ext.tree.TreePanel, {
	
	indexSelect: function(node, e) {
        if(!this.win){
            this.win = new SelectPageWindow();
			this.win.on('contentSelected', this.contentSelected, this)
        }
		this.win.loadStore(node.id);
        this.win.show();
	},
	
	contentSelected: function(contentId) {
		this.fireEvent('contentSelect', contentId);
	},

	beforeShow: function(comp) {
		if (!this.root.isExpanded())
			this.root.expand();
		else
			this.root.reload();
	},
	
	selectNode: function(id) {
	},
	
	openPath: function(path) {
		this.selectPath(path);		
	}
	
});