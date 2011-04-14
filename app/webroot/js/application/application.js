/**
 * Main Application
 * 
 * Creates the main layout and connects the different parts together
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */


Ext.BLANK_IMAGE_URL = './img/s.gif';
Ext.ns('Application');

// global variable saving the login state
Application.loggedIn = false;

Ext.onReady(function(){

    // first check login state
    checkLoginState(function(success){
        Application.loggedIn = success;
        Ext.QuickTips.init();
        
        // Left sided contents 
        contentTree = new ContentTree();
        indexTree = new IndexTree();
        searchPanel = new Application.SearchPanel();
        
        // Main content panel
        mainPanel = new MainPanel();
        
        ajaxShowSpinner();
        
        new Ext.Viewport({
            layout: 'border',
            items: [{
                id: 'global.pageTitle',
                region: 'north',
                height: 20,
                border: false,
                title: '&nbsp;',
                margins: '0 0 5 0'
            }, {
                region: 'west',
                collapsible: true,
                split: true,
                title: 'Navigation',
                width: 240,
                xtype: 'tabpanel',
                activeTab: 0,
                items: [contentTree, indexTree, searchPanel]
            }, mainPanel]
        });
        
        // connect the content selection events with the main panel
        contentTree.on('contentSelect', function(id){
            mainPanel.getContent(id, false);
        });
        
        indexTree.on('contentSelect', function(id){
            mainPanel.getContent(id, true);
        });
        
        searchPanel.on('contentSelect', function(id){
            mainPanel.getContent(id, true);
        });
        
        // when a login state changes, some buttons are not available on contentTree panel 
        // if not logged in
        mainPanel.on('loginStateChanged', function(){
            contentTree.loginStateChanged();
        });
        
        mainPanel.on('settingsChanged', function(){
            readPageTitle();
        }, this);
        
        readPageTitle();
       
    }, this);
    
});

function readPageTitle(){
    Ext.Ajax.request({
        url: 'settings/read_value/pageTitle',
        scope: this,
        success: function(result, request){
            data = Ext.util.JSON.decode(result.responseText);
            title = data.value;
            if (title == '') 
                title = '&nbsp;';
			
            Ext.getCmp('global.pageTitle').setTitle(title);
            document.title = title;
        }
    })
}

/**
 * Show the spinner div. Has to be named "loading"
 */
function showSpinner(){
    var loading = Ext.get("loading");
    if (loading != null) 
        loading.show();
}

/**
 * Hide the spinner div
 */
function hideSpinner(){
    var loading = Ext.get("loading");
    if (loading != null) 
        loading.hide();
}

/**
 * Set the ajax events to automatically show spinner on every ajax load
 */
function ajaxShowSpinner(){
    Ext.Ajax.on('beforerequest', this.showSpinner, this);
    Ext.Ajax.on('requestcomplete', this.hideSpinner, this);
    Ext.Ajax.on('requestexception', this.hideSpinner, this);
}

/**
 * Check the login state of the current user by calling a server side action
 *
 * @param {Object} functionSuccess
 * @param {Object} scope
 */
function checkLoginState(functionSuccess, scope){
    Ext.Ajax.purgeListeners();
    
    Ext.Ajax.request({
        url: 'users/is_logged_in',
        success: function(result, request){
            result = Ext.util.JSON.decode(result.responseText);
            success = result.success;
            functionSuccess.call(scope, success);
            if (success) {
            }
        },
        beforeRequest: null,
        requestComplete: null
    });
    
    ajaxShowSpinner();
}

function ajaxfilemanager(field_name, url, type, win) {
			var ajaxfilemanagerurl = "./tinymce/jscripts/tiny_mce/plugins/ajaxfilemanager/ajaxfilemanager.php";
			switch (type) {
				case "image":
					ajaxfilemanagerurl += "?type=img";
					break;
				case "media":
					ajaxfilemanagerurl += "?type=media";
					break;
				case "flash": 
					ajaxfilemanagerurl += "?type=media";
					break;
				case "file":
					ajaxfilemanagerurl += "?type=files";
					break;
				default:
					return false;
			}
			var fileBrowserWindow = new Array();
			fileBrowserWindow["file"] = ajaxfilemanagerurl;
			fileBrowserWindow["title"] = "Ajax File Manager";
			fileBrowserWindow["width"] = "782";
			fileBrowserWindow["height"] = "440";
			fileBrowserWindow["close_previous"] = "no";
			Ext.getCmp('editor').ed.windowManager.open(fileBrowserWindow, {
			  window : win,
			  input : field_name,
			  resizable : "yes",
			  inline : "yes"
			  //editor_id : tinyMCE.getWindowArg("editor_id")
			});
			
			return false;
}



