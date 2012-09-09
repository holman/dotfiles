# SublimeCSSTidy
## CSS code formatter for Sublime Text 2

### What is does
SublimeCSSTidy is a [Sublime Text 2](http://www.sublimetext.com/2) package for cleaning and tidying up your CSS. It's mostly a wrapper for the [CSS Tidy PHP Library](http://github.com/Cerdic/CSSTidy), but it will fall back on a bundled [CSS Tidy](http://csstidy.sourceforge.net/) executable for Windows users without PHP (the exe isn't recommended for CSS3, take care).

SublimeCSSTidy adds three commands to the Sublime Text 2 command palette:

* Tidy CSS (Highest Compression)
* Tidy CSS (Low Compression)
* Tidy CSS

The last one uses the default template, which is a decent balance of readability and compression. If you can decipher the complicated pattern for creating [custom formatting rules](http://csstidy.sourceforge.net/templates.php), SublimeCSSTidy will happily use them. An example of a custom template file is included (`template-medium.txt`).

### Installation

#### With Package Control
If you have [Package Control][package_control] installed, you can install CSSTIdy from within Sublime Text 2. Open the Command Palette and select "Package Control: Install Package", then search for *CSSTidy*.

#### Without Package Control
Go to your Sublime Text 2 packages directory (by selecting "Preferences > Browse Packages") and clone the repository there:

    git clone git://github.com/fitnr/SublimeCSSTidy

#### Without Package Control or Git
[Go to the download section](http://github.com/fitnr/SublimeCSSTidy/downloads) and download the package. Unzip it and move the CSSTidy folder into your Sublime Text 2 packages directory.

### Configuration
Check out `csstidy.sublime-settings` for a documented list of options.

### Problems?
Tweet at [@fitnr](http://twitter.com/fitnr) and maybe we can work something out.