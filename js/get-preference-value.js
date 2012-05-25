/*
When working with preferences in Firefox Addons, you need to call various
methods, depending on the type of preference: boolean, string, integer.
With this function, you can forget about value types, when you just want to
get the damn value!
*/

function getPreferenceValue(pref) {
	var component = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
	var prefType = component.getPrefType(pref);
	var value = null;
	switch (prefType) {
		case component.PREF_BOOL:
			value = component.getBoolPref(pref);
			break;
		case component.PREF_STRING:
			value = component.getCharPref(pref);
			break;
		case component.PREF_INT:
			value = component.getIntPref(pref);
			break;
		case component.PREF_INVALID:
		default:
			break;
	}
	return value;
}