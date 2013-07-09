Sublime Text 2 MarkDown preview
===============================

A simple ST2 plugin to help you preview your markdown files quickly in you web browser.

You can use builtin [python-markdown2][0] parser (default) or use the [github markdown API][5] for the conversion (edit your settings to select it).

If you have the ST2 LiveReload plugin, your browser will autorefresh the display when you save your file :)

**NOTE:** If you choose the GitHub API for conversion (set parser: github in your settings), your code will be sent through https to github for live conversion. You'll have [Github flavored markdown][6], syntax highlighting and EMOJI support for free :heart: :octocat: :gift:

**LINUX users:** If you want to use GitHub API for conversion, you'll need to have a custom Python install that includes python-ssl as its not built in the Sublime Text 2 Linux package. see @dusteye comment : https://github.com/revolunet/sublimetext-markdown-preview/issues/27#issuecomment-11772098.

## Features :

 - Markdown conversion via builtin Markdown Parser ([python-markdown2][0]) or via Github API : just choose in your settings.
 - Browser preview auto reload on save if you have the [ST2 LiveReload plugin][7] installed.
 - Builtin parser : Support TOC, footnotes markdown extensions

## Installation :

 - you should use [sublime package manager][3]
 - use `cmd+shift+P` then `Package Control: Install Package`
 - look for `Markdown Preview` and install it.

## Usage :

 - use `cmd+shift+P` then `Markdown Preview` to launch a preview
 - or bind some key in your user key binding, using a line like this one:
   `{ "keys": ["alt+m"], "command": "markdown_preview", "args": {"target": "browser"} },`
 - once converted a first time, the output HTML will be updated on each file save (with LiveReload plugin)

## Uses :

 - [python-markdown2][0] for markdown parsing **OR** the GitHub markdown API.


## Licence :

The code is available at github [https://github.com/revolunet/sublimetext-markdown-preview][2] under MIT licence : [http://revolunet.mit-license.org][4]

 [0]: https://github.com/trentm/python-markdown2
 [2]: https://github.com/revolunet/sublimetext-markdown-preview
 [3]: http://wbond.net/sublime_packages/package_control
 [4]: http://revolunet.mit-license.org
 [5]: http://developer.github.com/v3/markdown
 [6]: http://github.github.com/github-flavored-markdown/
 [7]: https://github.com/dz0ny/LiveReload-sublimetext2
