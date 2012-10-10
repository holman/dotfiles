Sublime Text 2 MarkDown preview
===============================

A simple ST2 plugin to help you preview your markdown files quickly in you web browser.

You can use builtin [python-markdown2][0] parser (default) or use the [github markdown API][5] for the conversion (edit your settings to select it).

If you have the ST2 LiveReload plugin, your browser will autorefresh the display when you save your file :)

NOTE: If you choose the GitHub API for conversion, your code will be sent through https to github for live conversion. You'll have Github flavored markdown and syntax highlighting for free.

## Installation :

 - you should use [sublime package manager][3]
 - use `cmd+shift+P` then `Package Control: Install Package`
 - look for `MarkdownPreview` and install it.

## Usage :

 - use `cmd+shift+P` then `MarkdownPreview` to launch a preview
 - or bind some key in your user key binding, using a line like this one:
   `{ "keys": ["alt+m"], "command": "markdown_preview", "args": {"target": "browser"} },`
 - once converted a first time, the output HTML will be updated on each file save (with LiveReload plugin)

## Uses :

 - [python-markdown2][0] for markdown parsing **OR** the GitHub markdown API.
 - [clownfart markown.css][1] for markdown styling


## Licence :

The code is available at github [https://github.com/revolunet/sublimetext-markdown-preview][2] under MIT licence : [http://revolunet.mit-license.org][4]

 [0]: https://github.com/trentm/python-markdown2
 [1]: https://github.com/clownfart/Markdown-CSS
 [2]: https://github.com/revolunet/sublimetext-markdown-preview
 [3]: http://wbond.net/sublime_packages/package_control
 [4]: http://revolunet.mit-license.org
 [5]: http://developer.github.com/v3/markdown
