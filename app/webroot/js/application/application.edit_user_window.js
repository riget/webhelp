/**
 * Edit User Window
 * 
 * Window to edit the user data 
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

Ext.ns('Application');

Application.EditUserWindow = function(){

    Application.EditUserWindow.superclass.constructor.call(this, {
        title: 'Benutzer',
        width: 350,
        height: 400,
        y: 60,
        closeAction: 'hide',
        modal: true,
        items: {
            xtype: 'form',
            bodyStyle: 'padding:10px; background-color: transparent;',
            border: true,
            height: 400,
            labelAlign: 'top',
            autoScroll: false,
            border: false,
            items: [{
                id: 'editUserUsername',
                fieldLabel: 'Username',
                bodyStyle: 'background-color: transparent;',
                width: '95%',
                xtype: 'textfield'
            }, {
                id: 'editUserFirstname',
                fieldLabel: 'Vorname',
                bodyStyle: 'background-color: transparent;',
                width: '95%',
                xtype: 'textfield'
            }, {
                id: 'editUserLastname',
                fieldLabel: 'Nachname',
                bodyStyle: 'background-color: transparent;',
                width: '95%',
                xtype: 'textfield'
            }, {
                id: 'editUsercbChangePassword',
                boxLabel: 'Passwort &auml;ndern',
                bodyStyle: 'background-color: transparent;',
                width: '95%',
                xtype: 'checkbox',
                handler: this.cbPasswordClicked
            }, {
                id: 'editUserPassword1',
                fieldLabel: 'Neues Passwort',
                bodyStyle: 'background-color: transparent;',
                width: '95%',
                xtype: 'textfield',
                inputType: 'password',
                disabled: true
            }, {
                id: 'editUserPassword2',
                fieldLabel: 'Passwort wiederholen',
                bodyStyle: 'background-color: transparent;',
                width: '95%',
                xtype: 'textfield',
                inputType: 'password',
                disabled: true
            }]
        },
        buttons: [{
            text: 'Speichern',
            scope: this,
            handler: this.onSaveClicked
        }, {
            text: 'Cancel',
            handler: this.hide.createDelegate(this, [])
        }]
    });
}

Ext.extend(Application.EditUserWindow, Ext.Window, {
	userId: 0,
	type: '',
	
    cbPasswordClicked: function(){
        var checked = Ext.getCmp('editUsercbChangePassword').getValue();
        
        if (checked) {
            Ext.getCmp('editUserPassword1').enable();
            Ext.getCmp('editUserPassword2').enable();
        }
        else {
            Ext.getCmp('editUserPassword1').disable();
            Ext.getCmp('editUserPassword2').disable();
        }
    },
    
    setType: function(type){
		this.type = type;
        Ext.getCmp('editUserPassword1').setValue('');
        Ext.getCmp('editUserPassword2').setValue('');
		
        if (type == 'add') {
			this.userId = null;
			Ext.getCmp('editUsercbChangePassword').hide();
			Ext.getCmp('editUsercbChangePassword').setValue(true);
            Ext.getCmp('editUserUsername').show();
			
			
            this.setTitle('Benutzer hinzuf&uuml;gen');
            Ext.getCmp('editUserUsername').setValue('');
            Ext.getCmp('editUserFirstname').setValue('');
            Ext.getCmp('editUserLastname').setValue('');
        }
        else {
			Ext.getCmp('editUsercbChangePassword').show();
            Ext.getCmp('editUserUsername').hide();			
			Ext.getCmp('editUsercbChangePassword').setValue(false);

            this.setTitle('Benutzer &auml;ndern');
        }
		
		this.cbPasswordClicked();
    },
    
    loadUserData: function(userId){
		this.userId = userId;
		
        // read User data
        Ext.Ajax.request({
            url: 'users/get_data/' + userId,
            scope: this,
            success: function(result, request){
                data = Ext.util.JSON.decode(result.responseText);
                Ext.getCmp('editUserUsername').setValue('Username: <b>' + data.User.username + '</b>');
                Ext.getCmp('editUserFirstname').setValue(data.User.firstname);
                Ext.getCmp('editUserLastname').setValue(data.User.lastname);
            }
            
        });
    },
    
    onSaveClicked: function(){
        // check if password should be changed
        if (Ext.getCmp('editUsercbChangePassword').getValue()) {
            password1 = Ext.getCmp('editUserPassword1').getValue();
            password2 = Ext.getCmp('editUserPassword2').getValue();
            
            if (password1.trim() == '') {
                Ext.MessageBox.alert('Fehler', 'Passwort darf nicht leer sein!');
                return;
            }
            if (password1 != password2) {
                Ext.MessageBox.alert('Fehler', 'Passw&ouml;rter m&uuml;ssen &uuml;bereinstimmen!');
                return;
            }
			
			if (password1.length < 6) {
				Ext.MessageBox.alert('Fehler', 'Passwort muss mindestens aus 6 Zeichen bestehen!');
                return;
			}
        }
		
		var username = Ext.getCmp('editUserUsername').getValue();
		
		if (username.length < 6)
		{
				Ext.MessageBox.alert('Fehler', 'Benutzername muss mindestens aus 6 Zeichen bestehen!');
                return;
		}		
		
        var params = {
			userId: this.userId,
            firstname: Ext.getCmp('editUserFirstname').getValue(),
            lastname: Ext.getCmp('editUserLastname').getValue()
        };
		
		if (this.userId == null) {
			params.action = 'add';
			params.username = username;
		}
        
        if (Ext.getCmp('editUsercbChangePassword').getValue()) 
            params.password = Ext.getCmp('editUserPassword1').getValue();
        
        Ext.Ajax.request({
            url: 'users/save_data',
            params: params,
            scope: this,
            success: function(result, request){
                this.hide();				
				this.fireEvent('saved');
            }
        });
        
    }
});
