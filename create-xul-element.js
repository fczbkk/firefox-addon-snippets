// The trick here is to use XUL NameSpace.
// Classic document.createElement will not work (at least not properly) in XUL document.
function createXulElement (tagName, attributes) {
		var XUL_NS = 'http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul';
		var attributes = attributes || {};
		var element = document.createElementNS(XUL_NS, tagName);
		for (attribute in attributes) {
				element.setAttribute(attribute, attributes[attribute]);
		}
		return element;
}

createXulElement('box');
// <box />

createXulElement('menuitem', {
		'class' : 'menuitem-iconic',
		'label' : 'Click here',
		'image' : 'chrome://myAddon/icons/alert.png'
});
// <menuitem class="menuitem-iconic" label="Click here" image="chrome://myAddon/icons/alert.png" />