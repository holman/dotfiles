#Sublime Text 2 - Coffee Compile

This package allows you to compile some or all of your CoffeeScript right from the editor.
The JavaScript output will even have syntax highlighting!


##Usage

Just highlight some CoffeeScript code, right click and select the _Coffee Compile_ command.
To compile the whole file, don't highlight any text.

This package assumes that the _coffee_ command is on your path (it probably is). You can
configure an explicit path to _coffee_ in the settings file.



## Install

### Package Control
Install the _CoffeeCompile_ package from [http://wbond.net/sublime_packages/package_control](Package Control).


### Manual

Clone this repository from your Sublime packages directory:

#### Linux
```
$ cd ~/.config/sublime-text-2/Packages
$ git clone https://github.com/surjikal/sublime-coffee-compile "Coffee Compile"
```

#### Macosx
```
$ cd "~/Library/Application Support/Sublime Text 2/Packages"
$ git clone https://github.com/surjikal/sublime-coffee-compile "Coffee Compile"
```

#### Windows (manual install untested)
```
$ cd "%APPDATA%\Sublime Text 2"
$ git clone https://github.com/surjikal/sublime-coffee-compile "Coffee Compile"
```


## Known Issues

### File not found

You will need to specify the path to your _coffee_ executable explicitely in the CoffeeCompile settings.

The setting file can be found in `Sublime Text 2 > Preferences > Package Settings > CoffeeCompile`. The
`coffee_executable` key lets you specify an explicit path for your _coffee_ executable.

You can find the path of your _coffee_ executable by typing `which coffee` in the terminal.
Make sure you put the full path and not a symlink, because symlinks don't seem to work.


## Screenshot
![CoffeeCompile Screenshot](http://i.imgur.com/2J49Q.png)