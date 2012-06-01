/*
Tries to open URL in already existing tab matching given pattern. If it doesn't
exist, opens URL in new tab.

Based on original snippet from MDN, I have added the ability to match
URL pattern, instead of just exact check:
https://developer.mozilla.org/en/Code_snippets/Tabbed_browser#Reusing_tabs
*/

function reuseTab (url, pattern) {

    // this doesn't make sense, if there's no URL to open
    if (url) {
    
        // if no pattern is provided, use exact match on URL
        var pattern = pattern || url;
        
        // we will need these objects to iterate through all windows and tabs
        // while searching for correct tab
        var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
        var browserEnumerator = windowMediator.getEnumerator("navigator:browser");
        
        var foundTarget = false;
        
        // go through all opened windows...
        while (!foundTarget && browserEnumerator.hasMoreElements()) {
        
            // ...then go through all tabs in that window
            var win = browserEnumerator.getNext();
            var tabs = win.gBrowser;
            for (var i = 0, j = tabs.browsers.length; i < j; i++) {
            
                // get URL of tab
                var tab = tabs.getBrowserAtIndex(i);
                var currentUrl = tab.currentURI.spec;
                
                // check if pattern matches URL of tab
                if (currentUrl.match(pattern)) {
                
                    // activate found tab
                    tabs.selectedTab = tabs.tabContainer.childNodes[i];
                    
                    // making tab in inactive window doesn't move focus to that
                    // window, we have to do it manually
                    win.focus();
                    
                    // open URL in currently active tab
                    openUILinkIn(url, 'current');
                    
                    foundTarget = true;
                    break;
                }
                
            }
        }
        
        // so, we didn't find any suitable tab to reuse... moving on
        if (!foundTarget) {
            
            // is there currently any window opened? if so, open new tab in it
            var currentWindow = ch.windowMediator.getMostRecentWindow('navigator:browser');
            if (currentWindow) {
                currentWindow.delayedOpenTab(url, null, null, null, null);
            }
            
            // if there is no window, open URL in new window
            // (hey, it could really happen! this is Firefox!!!)
            else {
                window.open(url);
            }
        }
        
    }
    
}

// will look for an open tab with content from http://www.mydomain.com/
reuseTab('http://www.mydomain.com/');

// same as above, but the URL to open is too specific, so more generic
// match has to be specified
reuseTab('http://www.mydomain.com/some/subpage/', 'http://www.mydomain.com/');

// same as above, but handy when working with content on subdomains
// you have to use regular expression, if you want to use wildcard
reuseTab('http://sub.mydomain.com/some/subpage/', new RegExp('http:\/\/.*\.mydomain\.com'));

