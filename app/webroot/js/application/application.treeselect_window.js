/**
 * Treeselect Window
 * 
 * Window to select a page in the content tree (used for inserting an internal link in the text edited)
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

TreeselectWindow = function(){
    this.tree = new Ext.tree.TreePanel({
        dataUrl: 'content/tree',
        border: false,
        title: 'Inhalt',
        autoScroll: true,
        rootVisible: false,
        enableDrag: true,
        height: 400,
        autoScroll: true,
        ddScroll: true
		
    });
    
    this.root = new Ext.tree.AsyncTreeNode({
        text: 'Inhalt',
        draggable: true,
        id: '0'
    });
    
    this.tree.setRootNode(this.root);
    //this.root.expand();
    
    
    TreeselectWindow.superclass.constructor.call(this, {
        title: 'Select Page',
        id: 'treeselectWindow',
        autoHeight: true,
        width: 350,
        height: 450,
        resizable: true,
        plain: true,
        modal: true,
        y: 100,
        autoScroll: true,
        closeAction: 'hide',
        items: this.tree,
        buttons: [{
            text: 'Link einfuegen',
            id: 'btnInsert',
            disabled: true,
            handler: this.onInsertClicked,
            scope: this
        }, {
            text: 'Abbrechen',
            handler: function() { this.hide(); },
            scope: this
        }]
    
    });
    
    this.tree.on('click', this.onTreeClicked, this);
}

Ext.extend(TreeselectWindow, Ext.Window, {
    selectedId: 0,
    selectedText: '',
    
    onTreeClicked: function(node){
        this.selectedId = node.id;
        this.selectedText = node.text;
        Ext.getCmp('btnInsert').enable();
    },
    
    onInsertClicked: function(){
        this.fireEvent('nodeSelected', this.selectedId, this.selectedText);
        this.hide();
    },
	
	reloadTree: function() {
 		this.tree.getLoader().load(this.root, function(node) {}, this);		
	}
    
});
