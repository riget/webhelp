/**
 * Settings Window
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

Ext.ns('Application');

Application.settingsWindow = function(){

    var proxy = new Ext.data.HttpProxy({
        url: 'users/get_users'
    });
    
    var reader = new Ext.data.JsonReader({
        idProperty: 'id',
        successProperty: 'success',
        root: 'data'
    }, [{
        name: 'id'
    }, {
        name: 'username'
    }, {
        name: 'firstname'
    }, {
        name: 'lastname'
    }, {
        name: 'is_admin'
    }]);
    
    
    this.usersGrid = new Ext.grid.GridPanel({
        //autoHeight: true,
        height: 305,
        columns: [{
            id: 'username',
            dataIndex: 'username',
            header: 'Username',
            width: 100
        }, {
            dataIndex: 'firstname',
            header: 'Vorname',
            width: 100
        }, {
            dataIndex: 'lastname',
            header: 'Nachname',
            width: 100
        }, {
            dataIndex: 'is_admin',
            header: 'Admin?',
            width: 70
        }],
        store: new Ext.data.Store({
            id: 'id',
            restful: true,
            proxy: proxy,
            reader: reader
        }),
        tbar: [{
            text: 'Hinzuf&uuml;gen',
            iconCls: 'add',
            handler: this.onUserAdd,
            scope: this
        }, {
            text: 'Bearbeiten',
            iconCls: 'edit',
            handler: this.onUserEdit,
            scope: this
        }, {
            text: 'L&ouml;schen',
            iconCls: 'remove',
            handler: this.onUserRemove,
            scope: this
        }]
    });
    
    
    this.commonSettings = new Ext.Panel({
        title: 'Allgemein',
        id: 'settingsTabpanelCommon',
        hidden: true,
        defaults: {
            autoHeight: true
        },
        autoScroll: false,
        items: [{
            xtype: 'form',
            bodyStyle: 'padding:10px; background-color: transparent;',
            border: true,
            height: 400,
            labelAlign: 'top',
            autoScroll: false,
            border: false,
            items: [{
                id: 'pageTitle',
                fieldLabel: 'Seiten-Titel',
                bodyStyle: 'background-color: transparent;',
                width: '95%',
                xtype: 'textfield'
            }]
        }]
    });
    
    this.usersSettings = new Ext.Panel({
        title: 'Benutzer',
        id: 'settingsTabpanelUsers',
        hidden: true,
        autoScroll: true,
        bodyStyle: 'background-color: white;',
        items: [this.usersGrid]
    });
    
    Application.settingsWindow.superclass.constructor.call(this, {
        title: 'Einstellungen',
        width: 400,
        height: 400,
        resizable: true,
        plain: false,
        modal: true,
        y: 100,
        autoScroll: false,
        closeAction: 'hide',
        
        items: [{
            xtype: 'tabpanel',
            id: 'settingsTabpanel',
            border: false,
            activeTab: 0,
            autoScroll: false,
            defaults: {
                bodyStyle: 'background-color: transparent;'
            },
            bodyStyle: 'background-color: transparent;',
            items: [{
                title: 'Pers&ouml;nl. Daten',
                items: {
                    xtype: 'form',
                    bodyStyle: 'padding:10px; background-color: transparent;',
                    border: true,
                    height: 400,
                    labelAlign: 'top',
                    autoScroll: false,
                    border: false,
                    items: [{
                        id: 'settingsUsername',
                        hideLabel: true,
                        bodyStyle: 'background-color: transparent;',
                        width: '95%',
                        xtype: 'displayfield'
                    }, {
                        id: 'settingsFirstname',
                        fieldLabel: 'Vorname',
                        bodyStyle: 'background-color: transparent;',
                        width: '95%',
                        xtype: 'textfield'
                    }, {
                        id: 'settingsLastname',
                        fieldLabel: 'Nachname',
                        bodyStyle: 'background-color: transparent;',
                        width: '95%',
                        xtype: 'textfield'
                    }]
                }
            }, {
                title: 'Passwort',
                id: 'settingsTabpanelPassword',
                items: {
                    xtype: 'form',
                    bodyStyle: 'padding:10px; background-color: transparent;',
                    border: true,
                    height: 400,
                    labelAlign: 'top',
                    autoScroll: false,
                    border: false,
                    items: [{
                        id: 'cbChangePassword',
                        hideLabel: true,
                        boxLabel: 'Passwort &auml;ndern',
                        bodyStyle: 'background-color: transparent;',
                        width: '95%',
                        xtype: 'checkbox',
                        handler: this.cbPasswordClicked
                    }, {
                        id: 'settingsPassword1',
                        fieldLabel: 'Neues Passwort',
                        bodyStyle: 'background-color: transparent;',
                        width: '95%',
                        xtype: 'textfield',
                        inputType: 'password',
                        disabled: true
                    }, {
                        id: 'settingsPassword2',
                        fieldLabel: 'Passwort wiederholen',
                        bodyStyle: 'background-color: transparent;',
                        width: '95%',
                        xtype: 'textfield',
                        inputType: 'password',
                        disabled: true
                    }]
                }
            }]
        }],
        buttons: [{
            text: 'Speichern',
            scope: this,
            handler: this.onSaveClicked
        }, {
            text: 'Cancel',
            handler: this.hide.createDelegate(this, [])
        }]
    
    });
    
    this.on('show', this.onShow);
    
}

Ext.extend(Application.settingsWindow, Ext.Window, {
    isAdmin: false,
    
    onShow: function(comp){
        if (comp === undefined) 
            return;
        
        var storeData = [];
        
        Ext.getCmp('settingsPassword1').setValue('');
        Ext.getCmp('settingsPassword2').setValue('');
        Ext.getCmp('cbChangePassword').setValue(false);
        this.cbPasswordClicked();
        
        // read User data
        Ext.Ajax.request({
            url: 'users/get_data',
            scope: this,
            success: function(result, request){
                data = Ext.util.JSON.decode(result.responseText);
                Ext.getCmp('settingsUsername').setValue('Username: <b>' + data.User.username + '</b>');
                Ext.getCmp('settingsFirstname').setValue(data.User.firstname);
                Ext.getCmp('settingsLastname').setValue(data.User.lastname);
                
                if (data.User.is_admin == 1) {
                    this.isAdmin = true;
                    
                    Ext.getCmp('settingsTabpanel').insert(0, this.commonSettings);
                    Ext.getCmp('settingsTabpanel').add(this.usersSettings);
                    
                    this.usersGrid.store.load();
                    
                    // read Settings
                    Ext.Ajax.request({
                        url: 'settings/read_value/pageTitle',
                        scope: this,
                        success: function(result, request){
                            data = Ext.util.JSON.decode(result.responseText);
                            Ext.getCmp('pageTitle').setValue(data.value);
                        }
                    });
                }
                else {
                    this.isAdmin = false;
                    
                    Ext.getCmp('settingsTabpanel').hideTabStripItem(this.commonSettings);
                    Ext.getCmp('settingsTabpanel').hideTabStripItem(this.usersSettings);
                }
                
                Ext.getCmp('settingsTabpanel').setActiveTab(0);
            }
        });
    },
    
    onSaveClicked: function(){
        // check if password should be changed
        if (Ext.getCmp('cbChangePassword').getValue()) {
            password1 = Ext.getCmp('settingsPassword1').getValue();
            password2 = Ext.getCmp('settingsPassword2').getValue();
            
            if (password1.trim() == '') {
                Ext.getCmp('settingsTabpanel').setActiveTab('settingsTabpanelPassword');
                Ext.MessageBox.alert('Fehler', 'Passwort darf nicht leer sein!');
                return;
            }
            if (password1 != password2) {
                Ext.getCmp('settingsTabpanel').setActiveTab('settingsTabpanelPassword');
                Ext.MessageBox.alert('Fehler', 'Passw&ouml;rter m&uuml;ssen &uuml;bereinstimmen!');
                return;
            }
        }
        
        if (this.isAdmin) {
            Ext.Ajax.request({
                url: 'settings/save_value',
                params: {
                    name: 'pageTitle',
                    value: Ext.getCmp('pageTitle').getValue()
                },
                scope: this,
                success: function(result, request){
                    this.fireEvent('settingsChanged');
                    this.hide();
                }
            });
        }
        
        
        var params = {
            firstname: Ext.getCmp('settingsFirstname').getValue(),
            lastname: Ext.getCmp('settingsLastname').getValue()
        };
        
        if (Ext.getCmp('cbChangePassword').getValue()) 
            params.password = Ext.getCmp('settingsPassword1').getValue();
        
        Ext.Ajax.request({
            url: 'users/save_data',
            params: params,
            scope: this,
            success: function(result, request){
                this.hide();
            }
        });
    },
    
    cbPasswordClicked: function(){
        var checked = Ext.getCmp('cbChangePassword').getValue();
        
        if (checked) {
            Ext.getCmp('settingsPassword1').enable();
            Ext.getCmp('settingsPassword2').enable();
        }
        else {
            Ext.getCmp('settingsPassword1').disable();
            Ext.getCmp('settingsPassword2').disable();
        }
    },
    
    onUserAdd: function(btn, event){
        if (!this.editUserWin) {
            this.editUserWin = new Application.EditUserWindow();
            this.editUserWin.on('saved', this.reloadUsers, this);
        }
        this.editUserWin.setType('add');
        this.editUserWin.show();
    },
    
    onUserEdit: function(btn, event){
        if (!this.editUserWin) {
            this.editUserWin = new Application.EditUserWindow();
            this.editUserWin.on('saved', this.reloadUsers, this);
        }
        this.editUserWin.setType('edit');
        var sel = this.usersGrid.getSelectionModel().getSelected();
        
        if (sel === undefined) {
            Ext.MessageBox.alert('Fehler', 'Bitte w&auml;hlen Sie einen Benutzer aus!');
            return;
        }
        this.editUserWin.loadUserData(sel.get('id'));
        this.editUserWin.show();
    },
    
	onUserRemove: function(btn, event) {
		var sel = this.usersGrid.getSelectionModel().getSelected();
        
        if (sel === undefined) {
            Ext.MessageBox.alert('Fehler', 'Bitte w&auml;hlen Sie einen Benutzer aus!');
            return;
        }
		
		if (sel.get('is_admin') == 1) {
			Ext.MessageBox.alert('Fehler', 'Administrator kann nicht gel&ouml;scht werden!');
            return;
		}
		
	    Ext.MessageBox.confirm('Bitte best&auml;tigen:', 'Benutzer ' + sel.get('username') + ' wirklich l&ouml;schen?', function(btn){
	    	if (btn == 'yes') {
				Ext.Ajax.request({
					url: 'users/delete',
					params: {
						userId: sel.get('id')
					},
					scope: this,
					success: function(result, request){
						this.reloadUsers();
					}
				});
			}	
		}, this);
	},
	
    reloadUsers: function(){
        this.usersGrid.store.load();
    }
});
