
Ext.ux.ListBox = function(config){
    if (config.id !== undefined) 
        this.id = config.id;
    
	if (config.store !== undefined)
		this.store = config.store;
	else
		this.store = new Ext.data.ArrayStore({
            storeId: 'id',
            idIndex: 0,
            fields: ['id', 'text'],
            data: []
        });
		
	var multiSelect = true;
	if (config.multiSelect !== undefined)
		multiSelect = config.multiSelect;
	
		
    this.listView = new Ext.list.ListView({
        hideLabel: true,
        hideHeaders: true,
        multiSelect: multiSelect,
        columns: [{
            header: 'text',
            dataIndex: 'text'
        }],
        store: this.store
    });
	
	this.listView.on('click', this.onClick, this);
    
    Ext.ux.ListBox.superclass.constructor.call(this, {
        border: true,
        width: 'auto',
        height: 'auto',
        layout: 'fit',
        items: [this.listView]
    });
    
    Ext.apply(this, config);
}

Ext.extend(Ext.ux.ListBox, Ext.Panel, {
    addItem: function(id, text){
        this.listView.store.add(new Ext.data.Record({
            id: id,
            text: text
        }));
    },
    
    removeSelectedItems: function(){
        selected = this.listView.getSelectedIndexes();
        selected.sort();
        
        for (var i = 0; i < selected.length; i++) {
            this.listView.store.removeAt(selected[i] - i);
        }
    },
	
	removeAll: function() {
		this.listView.store.removeAll();
	},
	
	getItemsAsArray: function() {
        var data = [];
        var i = 0;
        groups = this.listView.store.data.items;
        for (i = 0; i < groups.length; i++) {
            data[i] = {
                id: groups[i].data.id,
                name: groups[i].data.text
            };
        }	
		return data;	
	},

	onClick: function(el, index, node, event) {
		selected = el.getRecord(node).data;		
		this.fireEvent('itemSelected', selected.id, selected.text);
	}

    
});

Ext.reg('listbox', Ext.ux.ListBox);
