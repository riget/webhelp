/*Ext.override(Ext.form.ComboBox, {
	beforeBlur: function() {
		var val = this.getRawValue();
		if (this.forceSelection) {
			if (val.length > 0 && val != this.emptyText) {
				this.el.dom.value = this.lastSelectionText === undefined ? '': this.lastSelectionText;
				this.applyEmptyText();
			} else {
				this.clearValue();
			}
		} else {
			var rec = this.findRecord(this.displayField, val); 
			if (rec) {
				val = rec.get(this.valueField || this.displayField);
			}
			this.setValue(val);
		}
	}
});
*/

Ext.override(Ext.Panel, {

   // private
	onResize : function(w, h, rw, rh){
		if(Ext.isDefined(w) || Ext.isDefined(h)){
			if(!this.collapsed){
				// First, set the the Panel's body width.
				// If we have auto-widthed it, get the resulting full offset width so we can size the Toolbars to match
				// The Toolbars must not buffer this resize operation because we need to know their heights.

				if(Ext.isNumber(w)){
					this.body.setWidth(w = this.adjustBodyWidth(w - this.getFrameWidth()));
				} else if (w == 'auto') {
					w = this.body.setWidth('auto').dom.offsetWidth;
				} else {
					w = this.body.dom.offsetWidth;
				}

				if(this.tbar){
					this.tbar.setWidth(w);
					if(this.topToolbar){
						this.topToolbar.setSize(w);
					}
				}
				if(this.bbar){
					this.bbar.setWidth(w);
					if(this.bottomToolbar){
						this.bottomToolbar.setSize(w);
						// The bbar does not move on resize without this.
						if (Ext.isIE) {
							this.bbar.setStyle('position', 'static');
							this.bbar.setStyle('position', '');
						}
					}
				}
				if(this.footer){
					this.footer.setWidth(w);
					if(this.fbar){
						this.fbar.setSize(Ext.isIE ? (w - this.footer.getFrameWidth('lr')) : 'auto');
					}
				}

				// At this point, the Toolbars must be layed out for getFrameHeight to find a result.
				if(Ext.isNumber(h)){
					h = Math.max(0, this.adjustBodyHeight(h - this.getFrameHeight()));
					this.body.setHeight(h);
				}else if(h == 'auto'){
					this.body.setHeight(h);
				}

				if(this.disabled && this.el._mask){
					this.el._mask.setSize(this.el.dom.clientWidth, this.el.getHeight());
				}
			}else{
				this.queuedBodySize = {width: w, height: h};
				if(!this.queuedExpand && this.allowQueuedExpand !== false){
					this.queuedExpand = true;
					this.on('expand', function(){
						delete this.queuedExpand;
						this.onResize(this.queuedBodySize.width, this.queuedBodySize.height);
					}, this, {single:true});
				}
			}
			this.onBodyResize(w, h);
		}
		this.syncShadow();
		Ext.Panel.superclass.onResize.call(this, w, h, rw, rh);
	}
});

Ext.override(Ext.grid.GridPanel, {
	hideTbar: function() {
		if (this.tbar) {
			this.tbar.setVisibilityMode(Ext.Element.DISPLAY);
			this.tbar.setVisible(false);
			this.syncSize();
			if (this.ownerCt) {
				this.ownerCt.doLayout();
			}
		}
	},
	showTbar: function() {
		if (this.tbar) {
			this.tbar.setVisibilityMode(Ext.Element.DISPLAY);
			this.tbar.setVisible(true);
			this.syncSize();
			if (this.ownerCt) {
				this.ownerCt.doLayout();
			}
		}
	}
});