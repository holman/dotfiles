# Sublime JS2Coffee
A quick way to convert an existing JS file (or an unsaved buffer with Javascript in it) to Coffeescript from Sublime Text.


## Installation

* Install [Package Control](http://wbond.net/sublime_packages/package_control)
OR
* clone this repo to your Packages directory

* Install node, npm
* `npm install -g js2coffee coffee-script`
* `cmd-shift-p` Package Control: Install Package -> JS2Coffee


## Usage
 
* `cmd-shift-p` JS2Coffee: 

![image](http://f.cl.ly/items/3B1l2H2K0U3r2U1E0f0U/test.js%20%E2%80%94%20sublime-js2coffee-1.jpg)

* OR

* Bind a key to `js_coffee` (e.g. in <Packages>/User/Default (OSX).sublime-keymap) (**Note: there is no keyboard shortcut set by default out of courtesy**):
`{ "keys": ["ctrl+shift+j"], "command": "js_coffee"}`

![image](http://f.cl.ly/items/3P3z0Z0r2K1C3c2V1r3a/untitled%20%E2%80%94%20sublime-js2coffee-2.jpg)

## Troubleshooting

If `js2coffee` outputs an error message it will show up in Sublime Text's console. There is not always useful context information in these messages, so YMMV.
