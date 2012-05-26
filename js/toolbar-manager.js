var ToolbarManager = {

	// adds toolbar item from palette or move it from another toolbar
	addItem : function (itemId, toolbarId) {
		if (itemId) {
		
			// remove the item if it already exists in any other toolbar,
			// just to be sure
			ToolbarManager.removeItem(itemid);
			
			// if no toolbar ID is provided, use default Firefox toolbar
			var toolbarId = toolbarId || 'nav-bar';
			var toolbar = document.getElementById(toolbarId);
			
			if (toolbar) {
				toolbar.insertItem(itemId);
				ToolbarManager.setCurrentset(toolbarId);
			}
			
		}
	},
	
	// remove toolbar item, return it to the palette
	removeItem : function (itemId) {
	
		// check if item already exists in the document,
		// otherwise there's no point in removing it
		var item = document.getElementById(itemId);
		if (item) {
			
			var toolbar = item.parentNode;
			
			// remove the item from toolbar's currentset
			var set = toolbar.getAttribute('currentset');
			set = set.replace(new RegExp('(^|,)' + itemId + '(,|$)'), ',');
			set = set.replace(new RegExp('(^,)|(,$)'), '');
			ToolbarManager.setCurrentset(set);
			
		}
	},
	
	// if new set is prvided, this replaces the current set with new one
	// otherwise it just takes care of persisting the data after the change
	setCurrentset : function (toolbarId, set) {
	
		var toolbar = document.getElementById(toolbarId);
		if (toolbar) {
			
			var set = set || toolbar.currentSet;
			
			// this makes visible changes to the document
			toolbar.currentSet = set;
			
			// calling this without previous line would work, but there would
			// be no visible change in the document until after the restart
			toolbar.setAttribute('currentset', set);
			document.persist(toolbarId, 'currentset');
			
		}
	},
	
	// this just resets the toolbar content to default set
	resetCurrentset : function (toolbarId) {
		var toolbar = document.getElementById(toolbarId);
		if (toolbar) {
			var defaultset = toolbar.getAttribute('defaultset');
			ToolbarManager.setCurrentset(toolbarId, defaultset);
		}
	}

}

// add myItem to the default toolbar (nav-bar)
ToolbarManager.addItem('myItem');

// move myItem from default toolbar to custom toolbar
ToolbarManager.addItem('myItem', 'myToolbar');

// remove myItem from UI, return it to the toolbar items palette
ToolbarManager.removeItem('myItem');