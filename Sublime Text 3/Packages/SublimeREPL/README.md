SublimeREPL for SublimeText2
============================

If you would like to donate to support SublimeREPL development, you can do so using [GitTip](https://www.gittip.com/wuub/) or [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=4DGEPH7QAVHH6&lc=GB&item_name=SublimeREPL&currency_code=USD&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted). Someone willing to take care of documentation would also be very welcome :-)


Features
--------

#### Common
 * Run an interpreter (REPL) inside SublimeText2 view/tab.
 * Per-language persistent REPL history.
 * Easily evaluate code in the running REPL
 * Replace your current build system, and use stdin in your programs.
 * Rich configuration with platform specific settings, project/file dependent environment variables and sane defaults.

#### Python
 * Launch python in local or remote(1) virtualenv.
 * Quickly run selected script or launch PDB.
 * Use SublimeText2 Python console with history and multiline input.

(1) - (ssh, linux/osx only)

Screenshots
-----------
#### Running python code in SublimeREPL
![Running python code in SublimeREPL](http://i.imgur.com/mmYQ6.png)
#### R on Windows
![R on Windows](http://i.imgur.com/jjsDn.png)

Videos
------
 * ![Python & virtualenv over SSH](http://img.youtube.com/vi/zodAqBvKQm0/2.jpg)  [Python & virtualenv over SSH](http://youtu.be/zodAqBvKQm0)
 * ![SBT integration demo](http://img.youtube.com/vi/1Y7Mr_RJpmU/3.jpg) [SBT integration demo](http://youtu.be/1Y7Mr_RJpmU)


Installation
============

1. Install Package Control. [http://wbond.net/sublime_packages/package_control](http://wbond.net/sublime_packages/package_control)
2. Install SublimeREPL
 1. `Preferences | Package Control | Package Control: Install Package`
 2. Choose `SublimeREPL`
3. Restart SublimeText2
4. Configure `SublimeREPL` (default settings in `Preferences | Package Settings | SublimeREPL | Settings - Default` should be modified in `Preferences | Package Settings | SublimeREPL | Settings - User`, this way they will survive package upgrades!


Documentation
=============

Very basic documentation will soon be available on RTD: [http://sublimerepl.readthedocs.org/](http://sublimerepl.readthedocs.org/)

License and Price
=================

Since version 1.2.0 SublimeREPL is licensed under GPL. Previous versions were licensed under BSD.
If you're using SublimeREPL in commercial environment a donation is strongly encouraged ;-)

Compatibility
================

SublimeREPL is developed against the latest dev build of SublimeText2, mostly on Windows7 x64 and Linux Mint 13. From time to time it's tested on Mac OSX as well.

I try to make it cross-platform, but from time to time some functions will be platform specific.


FAQ
---

### 1. Is this a terminal emulator?

No. Shell (cmd.exe/bash) REPL can be used for simple tasks (file creation, `git init` etc.) but anything _terminal like_ (mc, ipython, vim) will not work! SublimeREPL has a sister project: [SublimePTY](https://github.com/wuub/SublimePTY) that aims to bring real terminal emulator to SublimeText2.


