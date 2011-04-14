/**
 * Main panel
 * 
 * The panel where the content is displayed and the arrow buttons are
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */


MainPanel = function(){

    var data = [];
    
    // define content panel
    this.contentPanel = new Ext.Panel({
        id: 'contentpanel',
        autoheight: true,
        border: false,
        region: 'center',
        autoScroll: true,
        baseCls: 'contentBody'
    });
    
    // define form fields
    this.contentField = new Ext.ux.TinyMCE({
        fieldLabel: "Rich text",
        hideLabel: true,
        anchor: "100% -50",
        tinymceSettings: {
            theme: "advanced",
            elements: "ajaxfilemanager",
            plugins: "pagebreak,style,layer,table,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,media,searchreplace,print,contextmenu,paste,directionality,noneditable,visualchars,nonbreaking,xhtmlxtras,template",
            theme_advanced_buttons1: "bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,styleselect,formatselect,fontselect,fontsizeselect",
            theme_advanced_buttons2: "cut,copy,paste,pastetext,pasteword,|,search,replace,|,bullist,numlist,|,outdent,indent,blockquote,|,undo,redo,|,link,unlink,anchor,image,cleanup,help,code,|,insertdate,inserttime,preview,|,forecolor,backcolor",
            theme_advanced_buttons3: "tablecontrols,|,hr,removeformat,visualaid,|,sub,sup,|,charmap,emotions,iespell,media,advhr,|,print,|,ltr,rtl,|",
            //theme_advanced_buttons4: "insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,template,pagebreak",
            theme_advanced_buttons4: "styleprops,|,cite,abbr,acronym,del,ins,attribs,|,visualchars,nonbreaking,pagebreak",
            theme_advanced_toolbar_location: "top",
            theme_advanced_toolbar_align: "left",
            theme_advanced_statusbar_location: "bottom",
            theme_advanced_resizing: true,
            file_browser_callback: "ajaxfilemanager",
            extended_valid_elements: "a[name|href|target|title|onclick],img[class|src|border=0|alt|title|hspace|vspace|width|height|align|onmouseover|onmouseout|name|style],hr[class|width|size|noshade],font[face|size|color|style],span[class|align|style]",
            template_external_list_url: "example_template_list.js",
            content_css: "/webhelp/css/content.css",
            body_class: "contentBody"
        },
        id: 'editor',
        width: '90%',
        //flex: 1,
        name: 'Content'
    });
    
    
    this.keywordsField = new Ext.form.TextField({
        fieldLabel: 'Keywords',
        name: 'keywords',
        //plugins: [Ext.ux.FieldLabeler],
        width: '95%',
        id: 'keywordsField',
        hideLabel: false,
        autoScroll: false
    });
    
    // define form
    this.form = new Ext.form.FormPanel({
        hidden: true,
        /*layout: {
         type: 'vbox',
         align: 'stretch' // Child items are stretched to full width
         },*/
        layout: 'form',
        forceLayout: true,
        labelWidth: 85,
        border: false,
        items: [this.contentField, this.keywordsField],
        buttons: [{
            text: 'Save',
            iconCls: 'save',
            scope: this,
            handler: this.saveClicked
        }, {
            text: 'Cancel',
            scope: this,
            handler: this.cancelClicked
        }]
    });
    
    this.form.on('resize', function(el, adjWidth, adjHeight, rawWidth, rawHeight){
        //alert('resized: ' + adjWidth + 'x' + adjHeight + ', ' + rawWidth + 'x' + rawHeight);
        //this.contentField.setWidth({width: adjWidth - 100});
    }, this);
    
    MainPanel.superclass.constructor.call(this, {
        region: 'center',
        autoScroll: true,
        draggable: false,
        
        tbar: [{
            id: 'editButton',
            text: 'Edit',
            hidden: true,
            tooltip: {
                title: 'Edit',
                text: 'Edit Content'
            },
            iconCls: 'edit',
            scope: this,
            handler: function(){
                this.contentPanel.hide();
                Ext.getCmp('editButton').hide();
                Ext.getCmp('linkButton').show();
                
                this.contentField.setValue(this.contentPanel.body.dom.innerHTML);
                this.keywordsField.setValue(self.data.Content.keywords);
                
                //this.form.setWidth(this.form.getWidth());
                //this.form.setWidth(this.form.getWidth() + 1);	
                this.form.show();
                
            }
        }, {
            id: 'linkButton',
            text: 'Internen Link einf&uuml;gen',
            iconCls: 'add_link',
            scope: this,
            hidden: true,
            handler: this.showTreeselectWindow
        }, '->', {
            id: 'settingsButton',
            iconCls: 'settings',
            text: 'Einstellungen',
            handler: this.showSettingsWindow,
            scope: this
        }, {
            id: 'loginButton',
            iconCls: 'login',
            text: 'Login',
            handler: this.showLogin,
            scope: this
        }, {
            id: 'logoutButton',
            text: 'Logout',
            iconCls: 'logout',
            handler: this.logout,
            scope: this,
            hidden: true
        }],
        
        buttonAlign: 'center',
        fbar: [{
            id: 'fbarLeft',
            text: ' ',
            minWidth: 200,
            hidden: false,
            iconCls: 'previous',
            disabled: true,
            iconAlign: 'left',
            handler: this.moveButtonClicked
        }, {
            id: 'fbarUp',
            text: ' ',
            minWidth: 200,
            hidden: false,
            disabled: true,
            iconCls: 'up',
            handler: this.moveButtonClicked
        }, {
            id: 'fbarRight',
            text: ' ',
            minWidth: 200,
            hidden: false,
            iconCls: 'next',
            disabled: true,
            handler: this.moveButtonClicked
        }],
        
        layout: 'fit',
        items: [this.form, this.contentPanel]
    });
    
    this.checkLoginState();
    
    /*contentField.on('render', function() {
     this.dropTarget2 = new Ext.dd.DropTarget(Ext.get('editor_parent'), {
     ddGroup: 'TreeDD',
     onDragOver: function(e, id) {
     alert('over');
     },
     notifyDrop:	function() {
     alert('dropped');
     return true;
     }
     });
     }, this);*/
};

Ext.extend(MainPanel, Ext.Panel, {
    contentId: 0,
    
    getContent: function(id, selectNode){
        this.contentId = id;
        
        if (selectNode === undefined) 
            selectNode = true;
        
        
        btnNext = Ext.getCmp('fbarRight');
        btnPrev = Ext.getCmp('fbarLeft');
        btnParent = Ext.getCmp('fbarUp');
        
        Ext.Ajax.request({
            url: 'content/read',
            params: {
                id: id
            },
            scope: this,
            success: function(result, request){
                data = Ext.util.JSON.decode(result.responseText);

                if ((data.Content.text === undefined) || (typeof(data.Content.text) != "string")) {
                    this.contentPanel.body.dom.innerHTML = '';
                    this.contentId = 0;
                }
                else {
                    this.contentPanel.body.dom.innerHTML = data.Content.text;
                    this.contentField.setValue(data.Content.text);
                    this.keywordsField.setValue(data.Content.keywords);
                }
                
                // Next
                if (data.Content.nextNode) {
                    btnNext.setDisabled(false);
                    btnNext.setText(data.Content.nextNode.Content.title);
                }
                else {
                    btnNext.setText(" ");
                    btnNext.setDisabled(true);
                }
                
                // Previous
                if (data.Content.prevNode) {
                    btnPrev.setDisabled(false);
                    btnPrev.setText(data.Content.prevNode.Content.title);
                }
                else {
                    btnPrev.setText(" ");
                    btnPrev.setDisabled(true);
                }
                
                // up
                if (data.Content.parentNode) {
                    btnParent.setDisabled(false);
                    btnParent.setText(data.Content.parentNode.Content.title);
                }
                else {
                    btnParent.setText(" ");
                    btnParent.setDisabled(true);
                }
                
                // check login state
                this.checkLoginState();
                
                if ((selectNode) && (this.contentId > 0)) 
                    contentTree.selectNode(id);
                
            }
        });
    },
    
    moveButtonClicked: function(button){
        switch (button.id) {
            case 'fbarUp':
                id = data.Content.parentNode.Content.id;
                break;
            case 'fbarRight':
                id = data.Content.nextNode.Content.id;
                break;
            case 'fbarLeft':
                id = data.Content.prevNode.Content.id;
                break;
        }
        mainPanel.getContent(id);
        //contentTree.selectNode(id);
    },
    
    saveClicked: function(){
        this.contentPanel.show();
        this.form.hide();
        
        contentValue = this.contentField.getValue();
        Ext.Ajax.request({
            url: 'content/save',
            scope: this,
            success: function(result, request){
                this.checkLoginState();
                Ext.getCmp('linkButton').hide();
                this.contentPanel.body.dom.innerHTML = this.contentField.getValue();
                data.Content.keywords = this.keywordsField.getValue();
            },
            failure: function(){
                Ext.Msg.alert('Error', 'Saving the data was not possibly!');
                this.checkLoginState();
            },
            params: {
                text: contentValue,
                id: this.contentId,
                keywords: this.keywordsField.getValue()
            }
        });
        
    },
    
    cancelClicked: function(){
        this.form.hide();
        this.contentPanel.show();
        Ext.getCmp('editButton').show();
        Ext.getCmp('linkButton').hide();
    },
    
    showLogin: function(btn, event){
        if (!this.win) {
            this.win = new LoginWindow();
            this.win.on('beforeHide', function(){
                this.checkLoginState();
                this.fireEvent('loginStateChanged');
            }, this);
        }
        this.win.show(btn);
    },
    
    checkLoginState: function(){
    
        if (Application.loggedIn) {
            Ext.getCmp('logoutButton').show();
            Ext.getCmp('loginButton').hide();
            Ext.getCmp('settingsButton').show();
            if ((this.contentId > 0) && (!this.form.isVisible())) 
                Ext.getCmp('editButton').show();
            else 
                Ext.getCmp('editButton').hide();
        }
        else {
            Ext.getCmp('editButton').hide();
            Ext.getCmp('logoutButton').hide();
            Ext.getCmp('loginButton').show();
            Ext.getCmp('settingsButton').hide();
            Ext.getCmp('linkButton').hide();
            this.contentPanel.show();
            this.form.hide();
        }
    },
    
    logout: function(){
        Ext.Ajax.request({
            url: 'users/logout',
            scope: this,
            success: function(result, request){
                Application.loggedIn = false;
                this.fireEvent('loginStateChanged');
                this.checkLoginState();
            }
        });
    },
    
    doLogin: function(attrs){
        alert(attrs.username + ' ' + attrs.password);
    },
    
    showTreeselectWindow: function(btn, event){
        if (!this.treeselectWin) {
            this.treeselectWin = new TreeselectWindow();
            this.treeselectWin.on('nodeSelected', function(id, text){
                Ext.getCmp('editor').insertValue('<a href="#" onclick="mainPanel.getContent(' + id + ');">' + text + '</a>')
            });
        }
        else {
            this.treeselectWin.reloadTree();
        }
        this.treeselectWin.show(btn);
    },
    
    showSettingsWindow: function(btn, event){
        if (!this.settingsWin) {
            this.settingsWin = new Application.settingsWindow();
            this.settingsWin.on('settingsChanged', function(){
                this.fireEvent('settingsChanged');
            }, this);
        }
        this.settingsWin.show();
    }
    
});

Ext.reg('mainPanel', MainPanel);
