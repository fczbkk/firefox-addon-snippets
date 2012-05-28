/*
DON'T customize browser's user agent. Any reason for doing it is not worth
the problems you will drive into later (e.g. when browser upgrades to newer
version).
*/

var UaManager = {

	component : Components.classes['@mozilla.org/preferences-service;1']
		.getService(Components.interfaces.nsIPrefService),
		
	prefName : 'general.useragent.override',

	// returns current UA, doesn't matter if it is customized or default
	get : function () {
		return UaManager.isCustom()
			? UaManager.component.getCharPref(UaManager.prefName)
			: window.navigator.userAgent;
	},
	
	// uses provided string as a new UA
	set : function (userAgent) {
		UaManager.component.setCharPref(UaManager.prefName, userAgent);
	},
	
	// just remove the customized UA to reset it
	reset : function () {
		if (UaManager.isCustom()) {
			UaManager.component.clearUserPref(UaManager.prefName);
		}
	},
	
	// utility function, returns true if UA is customized
	isCustom : function () {
		return UaManager.component.prefHasUserValue(UaManager.prefName);
	}
}

// if you want to modify default UA (e.g. append something to it), use this
UaManager.set(window.navigator.userAgent + ' customized');