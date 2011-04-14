/**
 * Search panel
 * 
 * Displays the search panel on the left side
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */


Ext.ns('Application');

Application.SearchPanel = function(){

    // Form   
    this.searchTerm = new Ext.form.TextField({
        anchor: '100%',
        hideLabel: true,
        triggerAction: 'all',
		enableKeyEvents: true
    });
	
	this.searchTerm.on('specialkey', function(field, e){
		if (e.getKey() == e.ENTER) {
			this.onSearchClicked();
		}
	}, this);	
    
    this.cbSearchTitleOnly = new Ext.form.Checkbox({
        boxLabel: 'Suche nur im Titel'
    });
    
    this.form = new Ext.FormPanel({
        baseCls: 'x-plain',
        hideLabels: true,
        items: [this.searchTerm, this.cbSearchTitleOnly],
        border: false,
        bodyStyle: 'padding-top:10px; padding-left: 10px; padding-right: 10px',
        buttons: [{
            text: 'Suchen',
            handler: this.onSearchClicked,
            scope: this
        }]
    });
    
    // Store
    this.store = new Ext.data.JsonStore({
        url: 'content/search',
        root: 'contents',
        fields: ['id', 'text']
    });
    
    // Listbox
    this.listbox = new Ext.ux.ListBox({
        border: false,
        bodyStyle: 'padding-left: 10px; padding-right: 10px;',
        multiSelect: false,
        store: this.store
    });
    
    this.listbox.on('itemSelected', this.contentSelected, this);
    
    Application.SearchPanel.superclass.constructor.call(this, {
        title: 'Suchen',
        items: [this.form, this.listbox],
        autoScroll: true
    });
}

Ext.extend(Application.SearchPanel, Ext.Panel, {

    onSearchClicked: function(){
        this.store.load({
            params: {
                searchTerm: this.searchTerm.getValue(),
                titleOnly: this.cbSearchTitleOnly.getValue()
            }
        });
    },
    
    contentSelected: function(id, text){
        this.fireEvent('contentSelect', id);
    }
})
