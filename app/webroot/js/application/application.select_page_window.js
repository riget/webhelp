/**
 * Select Page Window
 * 
 * Window to select a page when a index word is selected on the index tree panel
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

SelectPageWindow = function()
{
	var contentId;
	
	this.store = new Ext.data.JsonStore({
		url: 'content/keyword_contents',
		root: 'contents',
		fields: [
			'id', 'text'
		]
	});
	
    /*this.pageSelect = new Ext.list.ListView({
     	hideLabel: true,
		hideHeaders: true,
		multiSelect: false,
        width: 300,
		height: 200,
		columns: [{
			dataIndex: 'title'
		}],
        store: this.store
    });*/
	
	this.pageSelect = new Ext.ux.ListBox({
		store: this.store
	});

	this.pageSelect.on('itemSelected', this.pageSelected, this);
		
	SelectPageWindow.superclass.constructor.call(this, {
	        title: 'Select Page',
	        id: 'selectPageWindow',
	        width: 350,
			height: 350,
	        resizable: true,
	        modal: true,
	        y: 100,
	        autoScroll: true,
        	closeAction: 'hide',
			items: this.pageSelect,
			layout: 'fit'

	});	
		
}

Ext.extend(SelectPageWindow, Ext.Window,{
	store: null,
	pageSelect: null,
	
	show: function(){
        SelectPageWindow.superclass.show.apply(this, arguments);
    },
	
	loadStore: function(keywordId)
	{
		this.store.load({
			params: {
				keywordId: keywordId
			}
		});		
	},
	
	pageSelected: function(id, text) {
		//selected = el.getRecord(node).data;
		this.fireEvent('contentSelected', id);
		this.hide();
	}
});
