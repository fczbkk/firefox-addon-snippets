// Check if user is currently in private mode.
function isPrivateMode() {
	var privateModeComponent = Components.classes["@mozilla.org/privatebrowsing;1"].getService(Components.interfaces.nsIPrivateBrowsingService);
	var result = privateModeComponent.privateBrowsingEnabled;
	return result;
}