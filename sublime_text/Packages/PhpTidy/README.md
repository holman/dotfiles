# PHP code formatter for Sublime Text editor with phptidy
#### [Sublime Text 2](http://www.sublimetext.com/2)

## About
This is a Sublime Text 2 plugin allowing you to format your PHP code. 

It uses wp-phptidy, which is a little tool for formatting PHP code to conform the [WordPress Coding Standards](http://codex.wordpress.org/WordPress_Coding_Standards).

It is based on the [phptidy](http://phptidy.berlios.de/) script by Magnus Rosenbaum.

Modifications were made by Eoin Gallagher and described here:

http://magp.ie/2011/01/10/tidy-and-format-your-php-and-meet-wordpress-standards-on-coda-and-textwrangler/

## Usage
ctrl + shift + P and type `Tidy PHP`, or you can use the ctrl + alt + T keybinding.

## Customize
Custom settings file (for choosing between original phptidy and wp-phptidy).

## Known issues
Running phptidy on your file will clear all bookmarks and foldings.

## Install

### Package Control

The easiest way to install this is with [Package Control](http://wbond.net/sublime\_packages/package\_control).

 * If you just went and installed Package Control, you probably need to restart Sublime Text 2 before doing this next bit.
 * Bring up the Command Palette (Command+Shift+p on OS X, Control+Shift+p on Linux/Windows).
 * Select "Package Control: Install Package" (it'll take a few seconds)
 * Select PhpTidy when the list appears.

Package Control will automatically keep Git up to date with the latest version.

If you have some problems or improvements with it, contact me via GitHub.
