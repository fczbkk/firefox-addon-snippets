// TODO documentation and comments

PreferenceObserver = function (callback, branch) {

	this.callback = callback || function () {};
	
	var component = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefService);
	if (branch) {component = component.getBranch(branch);}
	this.component = component;
	
	this.register = function () {
		this.component.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.component.addObserver('', this, false);
	};
	
	this.unregister = function () {
		try {
			this.component.removeObserver('', this);
		} catch (err) {}
	};
	
	this.observe = function (subject, topic, data) {
		this.callback(data);
	};
	
	this.register();
	window.addEventListener('unload', this.unregister.bind(this));
	
}

var myTest = new PreferenceObserver(
	function (data) {
		alert(data);
	},
	'extensions.myAddon'
);