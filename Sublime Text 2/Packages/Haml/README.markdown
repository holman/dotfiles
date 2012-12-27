#HAML TextMate Bundle

##Description

Forked from the Handcrafted HAML TextMate Bundle.  Additions include

####Improved Language
 * Text inside Ruby, ERB, Javascript, Sass, and CSS filters are now properly recognized so you get all the syntax highlighting, snippets, commands, etc.
 * Added built-in html recognition. Helpful when you include html in your haml.
 * Ruby code inside <code>#{}</code> recognized as embedded ruby
 * Updated language so that < and > are recognized as HAML constants

####Added snippets and commands
 * <code>⌘⌥+C</code> converts selection from HTML to HAML (and tries to convert erb to haml style - still beta-y)
 * <code>⌃+></code> inserts <code>#{}</code> and toggles between <code>#{ruby code}</code> and <code>#{ ruby code }</code>
 * Added snippets for attributes (<code>:⇥</code> and <code>=></code>)
 * Added full trigger snippets for common html elements (ie table, br, div, h1, h2, etc.)
 * <code> ⌘+/</code> uses rails comments -# instead of HTML comments
 * <code>⌘⌥+X</code> escapes HTML special characters

##Installation

1. $ `cd ~/Library/Application\ Support/TextMate/Bundles/`
2. $ `git clone git://github.com/phuibonhoa/handcrafted-haml-textmate-bundle.git Haml.tmbundle`
3. $ `osascript -e 'tell app "TextMate" to reload bundles'`

If you'd like to install all my bundles, check out this [script](http://gist.github.com/443129) written by [mkdynamic](http://github.com/mkdynamic).  It installs all bundles and backups any existing bundles with conflicting names.  Thanks Mark!
 
##My Other Textmate Bundles
My bundles work best when use in conjunction with my other bundles:

 * Rails - [http://github.com/phuibonhoa/ruby-on-rails-tmbundle](http://github.com/phuibonhoa/ruby-on-rails-tmbundle)
 * Ruby - [http://github.com/phuibonhoa/ruby-tmbundle](http://github.com/phuibonhoa/ruby-tmbundle)
 * Shoulda - [http://github.com/phuibonhoa/ruby-shoulda-tmbundle](http://github.com/phuibonhoa/ruby-shoulda-tmbundle)
 * HAML - [http://github.com/phuibonhoa/handcrafted-haml-textmate-bundle](http://github.com/phuibonhoa/handcrafted-haml-textmate-bundle)
 * Sass - [http://github.com/phuibonhoa/ruby-sass-tmbundle](http://github.com/phuibonhoa/ruby-sass-tmbundle)
 * JavaScript - [http://github.com/phuibonhoa/Javascript-Bundle-Extension](http://github.com/phuibonhoa/Javascript-Bundle-Extension)
 * CTags - [http://github.com/phuibonhoa/tm-ctags-tmbundle](http://github.com/phuibonhoa/tm-ctags-tmbundle)

##Credits

![BookRenter.com Logo](http://assets0.bookrenter.com/images/header/bookrenter_logo.gif "BookRenter.com")

Additions by [Philippe Huibonhoa](http://github.com/phuibonhoa) and funded by [BookRenter.com](http://www.bookrenter.com "BookRenter.com").


Original bundle can be found [here](http://github.com/handcrafted/handcrafted-haml-textmate-bundle)
