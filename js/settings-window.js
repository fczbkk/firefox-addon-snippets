settingsWindow = {

	// stores list of all settings windows opened by this object for future reference
	list : [],
	
	// opens a new settings window, gives focus if it already exists
	open : function (url, id) {

		// provide default value for window name if empty
		var id = id || 'mySettingsWindow';

		// don't open new window if a window with the same name is already opened
		if ((settingsWindow.list[id] == null) || settingsWindow.list[id].closed) {
		
			// on Windows platform, settings windows have ok/cancel buttons
			// all other platforms apply preference changes instantly
			var instantApply = Application.prefs.get('browser.preferences.instantApply');
			
			// these are default features of all settings windows, regardless of platform
			var features = 'chrome,titlebar,toolbar,centerscreen,';
			
			// make settings window modal on Windows platform, don't show ok/cancel buttons anywhere else
			features += (instantApply.value) ? 'dialog=no' : 'modal';
			
			// finally, open the damn window and save the reference to it for later use
			ch.modalWindows[id] = window.openDialog(url, id, features);
			
		}

		// focus the window, doesn't matter if it is new or old
		ch.modalWindows[name].focus();

	}

}

// how to use it
settingsWindow.open('chrome://myAddon/settings.xul', 'myAddonSettings');