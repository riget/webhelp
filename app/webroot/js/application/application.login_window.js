/**
 * Login Window
 * 
 * @package		Webhelp
 * @author      Huber Stefan <huber@xsolutions>
 * @copyright   Copyright (c) 2010, Huber Stefan
 * @version     v1.0 Beta   
 * @license		http://www.opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPLv3)
 * @filesource
 */

LoginWindow = function()
{
    this.usernameField = new Ext.form.TextField({
        id: 'username',
        fieldLabel: 'Username',
        width: 250,
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'url',
        mode: 'local'
    });

    this.passwordField = new Ext.form.TextField({
        id: 'password',
        fieldLabel: 'Password',
        width: 250,
        validationEvent: false,
        validateOnBlur: false,
        msgTarget: 'under',
        triggerAction: 'all',
        displayField: 'url',
        mode: 'local',
		inputType: 'password',
		enableKeyEvents: true
    });
	
	this.passwordField.on('specialkey', function(field, e){
		if (e.getKey() == e.ENTER) {
			this.onLogin();
		}
	}, this);
	
    this.form = new Ext.FormPanel({
        labelAlign:'top',
        items: [
			this.usernameField,
			this.passwordField
		],
        border: false,
        bodyStyle:'background:transparent;padding:10px;'
    });
		
	LoginWindow.superclass.constructor.call(this, {
	        title: 'Login',
	        id: 'login-window',
	        width: 300,
	        resizable: false,
	        plain:true,
	        modal: true,
	        y: 100,
	        autoScroll: true,
        	closeAction: 'hide',
			buttons:[{
	            text: 'Login',
	            handler: this.onLogin,
	            scope: this
	        },{
	            text: 'Cancel',
	            handler: this.hide.createDelegate(this, [])
	        }],
			items: this.form
	});		

}

Ext.extend(LoginWindow, Ext.Window,{
	show: function(){
        LoginWindow.superclass.show.apply(this, arguments);
		this.usernameField.setValue('');
		this.passwordField.setValue('');
		
		// set focus on username field with a little delay (see http://cnxforum.com/showthread.php?t=226)
		this.usernameField.focus.defer(500, this.usernameField);
    },
	
	onLogin: function() {

		Ext.Ajax.request({
				url: 'users/login',
				scope: this,
				params: { username: this.usernameField.getValue(),
						  password: this.passwordField.getValue()
						},
				success: function(result, request){
							result = Ext.util.JSON.decode(result.responseText);
							success = result.success;
							if (success) {
								Application.loggedIn = true;
								this.hide();
							}
							else {
								Ext.MessageBox.alert('Fehler', 'Falscher Username oder Passwort!');
								this.passwordField.setValue('');
							}
						},
				failure: function() {
						alert('not ok');
						}
				});											
	}
});
