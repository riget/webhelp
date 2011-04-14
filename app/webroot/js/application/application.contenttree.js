/**
 * Content tree panel
 * 
 * Displays the content tree (directory) on the left side 
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

ContentTree = function(){
    ContentTree.superclass.constructor.call(this, {
        dataUrl: 'content/tree',
        border: false,
        title: 'Inhalt',
        autoScroll: true,
        rootVisible: false,
        enableDrag: true,
        enableDD: true,
        tbar: [{
			// New button
            id: 'topButtonNew',
            iconCls: 'new',
            tooltip: 'Neu',
            scope: this,
            handler: this.onNewClicked
        
        }, {
            xtype: 'tbseparator',
            id: 'topBarSeparator1'
        }, {
			// Expand all button
            iconCls: 'expand-all',
            tooltip: 'Expand all',
            scope: this,
            handler: function(){
                this.root.expand(true);
            }
        }, ' ', {
			// Collapse all button
            iconCls: 'collapse-all',
            tooltip: 'Collapse all',
            scope: this,
            handler: function(){
                this.root.collapse(true);
            }
        }]
    });
    
    this.loginStateChanged();
    
    var root = new Ext.tree.AsyncTreeNode({
        text: '[ Hauptebene ]',
        draggable: true,
        id: '0'
    });
    
    this.setRootNode(root);
    root.expand();
    
    this.root = root;
    
	// connect the events
	
	// user has clicked on a content title
    this.on('click', this.contentSelect);
    
    this.on('contextmenu', this.onContextMenu, this);
    
    this.on('beforemovenode', this.onBeforeMoveNode, this);
    
    this.on('startdrag', function(tree, node, event){
        this.oldPosition = node.parentNode.indexOf(node);
        this.oldNextSibling = node.nextSibling;
    });
    
    this.on('movenode', function(tree, node, oldParent, newParent, position){
        // moving a node can need one of the two ajax action: reparent or reorder
		if (oldParent == newParent) {
            url = 'content/reorder';
            params = {
                'node': node.id,
                'delta': (position - this.oldPosition)
            };
        }
        else {
            url = 'content/reparent';
            params = {
                'node': node.id,
                'parent': newParent.id,
                'position': position
            };
        }
        
        this.disable();
        
		// perform the ajax call saving the node move in the database
        Ext.Ajax.request({
            url: url,
            params: params,
            success: function(response, request){
                if (response.responseText.charAt(0) != 1) {
                    request.failure();
                }
                else {
                    this.enable();
                }
            },
            scope: this,
            failure: function(){
                this.suspendEvents();
                oldParent.appendChild(node);
                if (this.oldNextSibling) {
                    oldParent.insertBefore(node, this.oldNextSibling);
                }
                this.resumeEvents();
                this.enable();
				if (!Application.loggedIn)
				    Ext.MessageBox.alert('Fehler', 'Sie m�ssen eingeloggt sein, um diese Operation durchzuführen!');
				else
                	Ext.MessageBox.alert('Fehler', 'Verschieben nicht m�glich!');
            }
        })
        
    }, this);
}

Ext.extend(ContentTree, Ext.tree.TreePanel, {
    selectedId: 0,
    oldPosition: null,
    oldNextSibling: null,
    
    contentSelect: function(node, e){
        this.selectedId = node.id;
        
        this.fireEvent('contentSelect', node.id);
    },
    
    onContextMenu: function(node, e){
        if (Application.loggedIn) {
            this.nodeSelected = node;
            if (!this.menu) { // create context menu on first right click
                this.menu = new Ext.menu.Menu({
                    id: 'contentTreeContextMenu',
                    items: [{
                        id: 'newContent',
                        iconCls: 'new',
                        text: 'Neu',
                        scope: this,
                        handler: this.onNewClicked
                    }, {
                        id: 'editTitle',
                        iconCls: 'edit',
                        text: 'Edit',
                        scope: this,
                        handler: this.onEditClicked
                    }, {
                        id: 'deleteContent',
                        iconCls: 'delete',
                        text: 'L&ouml;schen',
                        scope: this,
                        handler: this.onDeleteClicked
                    }]
                });
                
                //this.menu.on('hide', this.onContextHide, this);
            }
            if (this.selectedId == 0) {
                Ext.getCmp('editTitle').hide();
                Ext.getCmp('deleteContent').hide();
            }
            else {
                Ext.getCmp('editTitle').show();
                Ext.getCmp('deleteContent').show();
            }
            this.menu.showAt(e.getXY());
            
        }
    },
    
    onBeforeMoveNode: function(tree, node, oldParent, newParent, index){
        return Application.loggedIn;
    },
    
    onDeleteClicked: function(btn){
        if (this.selectedId == 0) 
            return;
        
        node = this.getNodeById(this.selectedId);
        Ext.MessageBox.confirm('Bitte best&auml;tigen:', 'Seite "' + node.text + '" wirklich l&ouml;schen?', function(btn){
            if (btn == 'yes') {
                parentNode = node.parentNode;
                
                Ext.Ajax.request({
                    url: 'content/deleteContent',
                    params: {
                        id: this.selectedId
                    },
                    success: function(response){
                        if (parentNode.parentNode == null) {
                            var newNode = parentNode;
                            contentTree.getLoader().load(parentNode, this.hasLoaded, this);
                        }
                        else {
                            var newNode = parentNode.parentNode;
                            contentTree.getLoader().load(parentNode.parentNode, this.hasLoaded, this);
                        }
                        this.fireEvent('contentSelect', 0);
                    },
                    scope: this
                });
            }
        }, this)
    },
    
    hasLoaded: function(node){
        if (node.firstChild) 
            this.selectNode(node.firstChild.id, true);
        else 
            this.selectNode(node.id, true);
    },
    
    onNewClicked: function(btn){
        if (!this.editWin) {
            this.editWin = new EditTitleWindow();
        }
        
        this.editWin.purgeListeners();
        this.editWin.on('saveClicked', this.addContent, this);
        
        this.editWin.contentTitle.setValue('');
        this.editWin.selectNode(this.selectedId);
        this.editWin.setType('add');
        this.editWin.show(btn);
    },
    
    addContent: function(attrs){
        //alert(attrs.title + ' '  + attrs.parentId);
        Ext.Ajax.request({
            url: 'content/addContent',
            params: {
                parentId: attrs.parentId,
                title: attrs.title
            },
            success: function(response){
                if (attrs.parentId > 0) {
                    node = this.getNodeById(attrs.parentId);
                    contentTree.getLoader().load(node.parentNode, this.hasLoaded, this);
                    //this.selectNode(response.responseText);
                }
                else {
                    contentTree.getLoader().load(this.root);
                }
            },
            //failure: this.onFailed,
            scope: this
        });
    },
    
    onEditClicked: function(btn){
        if (!this.editWin) {
            this.editWin = new EditTitleWindow();
        }
        
        this.editWin.purgeListeners();
        this.editWin.on('saveClicked', this.changeTitle, this);
        
        this.editWin.contentTitle.setValue(this.nodeSelected.text);
        this.editWin.contentId = this.selectedId;
        this.editWin.selectNode(this.nodeSelected.parentNode.id);
        this.editWin.setType('edit');
        this.editWin.show(btn);
    },
    
    changeTitle: function(attrs){
        //alert('id: ' + attrs.title);
        Ext.Ajax.request({
            url: 'content/saveTitle',
            params: {
                id: attrs.id,
                title: attrs.title,
                parentId: attrs.parentId
            },
            success: function(response, options){
                contentTree.getLoader().load(this.root, function(node){
                    this.selectNode(attrs.id);
                }, this);
                //node = this.getNodeById(options.params.id);
                //node.setText(options.params.title);				
            },
            failure: this.onFailed,
            scope: this
        });
    },
    
    onFailed: function(){
        Ext.MessageBox.alert('Fehler', 'Ein Fehler ist aufgetreten!');
    },
    
    selectNode: function(id, expandNode){
        node = contentTree.getNodeById(id);
        
        if (expandNode === undefined) 
            expandNode = false;
        
        if (!node) {
            // path not opened yet: retrive path from database
            Ext.Ajax.request({
                url: 'content/getpath',
                params: {
                    id: id
                },
                success: function(result, request){
                    path = result.responseText;
                    contentTree.openPath(path, expandNode);
                },
                scope: this
            })
        }
        else {
            path = node.getPath();
            contentTree.openPath(path, expandNode);
        }
    },
    
    openPath: function(path, expandNode){
        contentTree.selectPath(path, null, function(bSuccess, oSelNode){
            if ((bSuccess) && (expandNode)) 
                oSelNode.expand();
        });
    },
    
    loginStateChanged: function(){
        if (Application.loggedIn) {
            Ext.getCmp('topButtonNew').show();
			Ext.getCmp('topBarSeparator1').show();
        }
        else {
            Ext.getCmp('topButtonNew').hide();
			Ext.getCmp('topBarSeparator1').hide();			
        }
    }
    
});

Ext.reg('contentTree', ContentTree);
