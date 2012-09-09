LiveReload for Sublime Text 2
=========

A web browser page reloading plugin for the [Sublime Text 2](http://sublimetext.com "Sublime Text 2") editor. 

Installing
-----

Install with [Sublime Package Control](http://wbond.net/sublime_packages/package_control "Sublime Package Control"), search for LiveReload and install.


Browser extensions
-----
You can use both major LiveReload versions. For old one you can find instructions bellow, for new ones please visit [New browser extensions](http://help.livereload.com/kb/general-use/browser-extensions "New browser extensions") or try [self loading version](http://help.livereload.com/kb/general-use/using-livereload-without-browser-extensions "self loading version").


### [Google Chrome extension](https://chrome.google.com/extensions/detail/jnihajbhpnppcggbcgedagnkighmdlei)

![](https://github.com/mockko/livereload/raw/master/docs/images/chrome-install-prompt.png)

Click “Install”. Actually, LiveReload does not access your browser history. The warning is misleading.

![](https://github.com/mockko/livereload/raw/master/docs/images/chrome-button.png)

If you want to use it with local files, be sure to enable “Allow access to file URLs” checkbox in Tools > Extensions > LiveReload after installation.

### Safari extension

For now it only works with self loading version:

    <script>document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1"></' + 'script>')</script>


### [Firefox 4 extension](https://addons.mozilla.org/firefox/addon/livereload/)

![](http://static-cdn.addons.mozilla.net/img/uploads/previews/full/63/63478.png?modified=1317506904)


## Usage

Now, if you are using Safari, right-click the page you want to be livereload'ed and choose “Enable LiveReload”:

![](https://github.com/mockko/livereload/raw/master/docs/images/safari-context-menu.png)

If you are using Chrome, just click the toolbar button (it will turn green to indicate that LiveReload is active).

----

You can also use the Preferences menu to change port, version and type of reloading(full, js,css).