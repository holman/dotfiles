*command-t.txt* Command-T plug-in for Vim         *command-t*

CONTENTS                                        *command-t-contents*

 1. Introduction            |command-t-intro|
 2. Requirements            |command-t-requirements|
 3. Installation            |command-t-installation|
 3. Managing using Pathogen |command-t-pathogen|
 4. Trouble-shooting        |command-t-trouble-shooting|
 5. Usage                   |command-t-usage|
 6. Commands                |command-t-commands|
 7. Mappings                |command-t-mappings|
 8. Options                 |command-t-options|
 9. Authors                 |command-t-authors|
10. Website                 |command-t-website|
11. Donations               |command-t-donations|
12. License                 |command-t-license|
13. History                 |command-t-history|


INTRODUCTION                                    *command-t-intro*

The Command-T plug-in provides an extremely fast, intuitive mechanism for
opening files with a minimal number of keystrokes. It's named "Command-T"
because it is inspired by the "Go to File" window bound to Command-T in
TextMate.

Files are selected by typing characters that appear in their paths, and are
ordered by an algorithm which knows that characters that appear in certain
locations (for example, immediately after a path separator) should be given
more weight.

To search efficiently, especially in large projects, you should adopt a
"path-centric" rather than a "filename-centric" mentality. That is you should
think more about where the desired file is found rather than what it is
called. This means narrowing your search down by including some characters
from the upper path components rather than just entering characters from the
filename itself.

Screencasts demonstrating the plug-in can be viewed at:

  https://wincent.com/products/command-t


REQUIREMENTS                                    *command-t-requirements*

The plug-in requires Vim compiled with Ruby support, a compatible Ruby
installation at the operating system level, and a C compiler to build
the Ruby extension.

1. Vim compiled with Ruby support

You can check for Ruby support by launching Vim with the --version switch:

  vim --version

If "+ruby" appears in the version information then your version of Vim has
Ruby support.

Another way to check is to simply try using the :ruby command from within Vim
itself:

  :ruby 1

If your Vim lacks support you'll see an error message like this:

  E319: Sorry, the command is not available in this version

The version of Vim distributed with Mac OS X does not include Ruby support,
while MacVim does; it is available from:

  http://github.com/b4winckler/macvim/downloads

For Windows users, the executable from www.vim.org does include Ruby support.

2. Ruby

In addition to having Ruby support in Vim, your system itself must have a
compatible Ruby install. "Compatible" means the same version as Vim itself
links against. If you use a different version then Command-T is unlikely
to work (see TROUBLE-SHOOTING below).

On Mac OS X Snow Leopard, the system comes with Ruby 1.8.7 and all recent
versions of MacVim (the 7.2 snapshots and 7.3) are linked against it.

On Linux and similar platforms, the linked version of Ruby will depend on
your distribution. You can usually find this out by examining the
compilation and linking flags displayed by the |:version| command in Vim, and
by looking at the output of:

  :ruby puts RUBY_VERSION

On Windows, Vim 7.3 links against Ruby 1.9.1, while previous versions linked
against Ruby 1.8.7.

A suitable Ruby environment for Windows can be installed using RubyInstaller
available at:

  http://rubyinstaller.org/download.html

If using RubyInstaller be sure to download the installer executable, not the
7-zip archive. When installing mark the checkbox "Add Ruby executables to your
PATH" so that Vim can find them.

3. C compiler

Part of Command-T is implemented in C as a Ruby extension for speed, allowing
it to work responsively even on directory hierarchies containing enormous
numbers of files. As such, a C compiler is required in order to build the
extension and complete the installation.

On Mac OS X, this can be obtained by installing the Xcode Tools that come on
the Mac OS X install disc.

On Windows, the RubyInstaller Development Kit can be used to conveniently
install the necessary tool chain:

  http://wiki.github.com/oneclick/rubyinstaller/development-kit

To use the Development Kit extract the archive contents to your C:\Ruby
folder.


INSTALLATION                                    *command-t-installation*

Command-T is distributed as a "vimball" which means that it can be installed
by opening it in Vim and then sourcing it:

  :e command-t.vba
  :so %

The files will be installed in your |'runtimepath'|. To check where this is
you can issue:

  :echo &rtp

The C extension must then be built, which can be done from the shell. If you
use a typical |'runtimepath'| then the files were installed inside ~/.vim and
you can build the extension with:

  cd ~/.vim/ruby/command-t
  ruby extconf.rb
  make

Note: If you are an RVM user, you must perform the build using the same
version of Ruby that Vim itself is linked against. This will often be the
system Ruby, which can be selected before issuing the "make" command with:

  rvm use system


MANAGING USING PATHOGEN                         *command-t-pathogen*

Pathogen is a plugin that allows you to maintain plugin installations in
separate, isolated subdirectories under the "bundle" directory in your
|'runtimepath'|. The following examples assume that you already have
Pathogen installed and configured, and that you are installing into
~/.vim/bundle. For more information about Pathogen, see:

  http://www.vim.org/scripts/script.php?script_id=2332

If you manage your entire ~/.vim folder using Git then you can add the
Command-T repository as a submodule:

  cd ~/.vim
  git submodule add git://git.wincent.com/command-t.git bundle/command-t
  git submodule init

Or if you just wish to do a simple clone instead of using submodules:

  cd ~/.vim
  git clone git://git.wincent.com/command-t.git bundle/command-t

Once you have a local copy of the repository you can update it at any time
with:

  cd ~/.vim/bundle/command-t
  git pull

Or you can switch to a specific release with:

  cd ~/.vim/bundle/command-t
  git checkout 0.8b

After installing or updating you must build the extension:

  cd ~/.vim/bundle/command-t
  rake make

While the Vimball installation automatically generates the help tags, under
Pathogen it is necessary to do so explicitly from inside Vim:

  :call pathogen#helptags()


TROUBLE-SHOOTING                                *command-t-trouble-shooting*

Most installation problems are caused by a mismatch between the version of
Ruby on the host operating system, and the version of Ruby that Vim itself
linked against at compile time. For example, if one is 32-bit and the other is
64-bit, or one is from the Ruby 1.9 series and the other is from the 1.8
series, then the plug-in is not likely to work.

As such, on Mac OS X, I recommend using the standard Ruby that comes with the
system (currently 1.8.7) along with the latest version of MacVim (currently
version 7.3). If you wish to use custom builds of Ruby or of MacVim (not
recommmended) then you will have to take extra care to ensure that the exact
same Ruby environment is in effect when building Ruby, Vim and the Command-T
extension.

On Windows, I recommend using the version 1.9.1 RubyInstaller and the
corresponding RubyInstaller Development Kit linked to above, along with the
standard (32-bit) version of Vim 7.3 that can be downloaded from www.vim.org.
If you are still using Vim 7.2 then you should instead use version 1.8.7 of
RubyInstaller.

If a problem occurs the first thing you should do is inspect the output of:

  ruby extconf.rb
  make

During the installation, and:

  vim --version

And compare the compilation and linker flags that were passed to the
extension and to Vim itself when they were built. If the Ruby-related
flags or architecture flags are different then it is likely that something
has changed in your Ruby environment and the extension may not work until
you eliminate the discrepancy.


USAGE                                           *command-t-usage*

Bring up the Command-T match window by typing:

  <Leader>t

This mapping is set up automatically for you, provided you do not already have
a mapping for <Leader>t or |:CommandT|. You can also bring up the match window
by issuing the command:

  :CommandT

A prompt will appear at the bottom of the screen along with a match window
showing all of the files in the current directory (as returned by the
|:pwd| command).

For the most efficient file navigation within a project it's recommended that
you |:cd| into the root directory of your project when starting to work on it.
If you wish to open a file from outside of the project folder you can pass in
an optional path argument (relative or absolute) to |:CommandT|:

  :CommandT ../path/to/other/files

Type letters in the prompt to narrow down the selection, showing only the
files whose paths contain those letters in the specified order. Letters do not
need to appear consecutively in a path in order for it to be classified as a
match.

Once the desired file has been selected it can be opened by pressing <CR>.
(By default files are opened in the current window, but there are other
mappings that you can use to open in a vertical or horizontal split, or in
a new tab.) Note that if you have |'nohidden'| set and there are unsaved
changes in the current window when you press <CR> then opening in the current
window would fail; in this case Command-T will open the file in a new split.

The following mappings are active when the prompt has focus:

    <BS>        delete the character to the left of the cursor
    <Del>       delete the character at the cursor
    <Left>      move the cursor one character to the left
    <C-h>       move the cursor one character to the left
    <Right>     move the cursor one character to the right
    <C-l>       move the cursor one character to the right
    <C-a>       move the cursor to the start (left)
    <C-e>       move the cursor to the end (right)
    <C-u>       clear the contents of the prompt
    <Tab>       change focus to the match listing

The following mappings are active when the match listing has focus:

    <Tab>       change focus to the prompt

The following mappings are active when either the prompt or the match listing
has focus:

    <CR>        open the selected file
    <C-CR>      open the selected file in a new split window
    <C-s>       open the selected file in a new split window
    <C-v>       open the selected file in a new vertical split window
    <C-t>       open the selected file in a new tab
    <C-j>       select next file in the match listing
    <C-n>       select next file in the match listing
    <Down>      select next file in the match listing
    <C-k>       select previous file in the match listing
    <C-p>       select previous file in the match listing
    <Up>        select previous file in the match listing
    <C-c>       cancel (dismisses match listing)

The following is also available on terminals which support it:

    <Esc>       cancel (dismisses match listing)

Note that the default mappings can be overriden by setting options in your
~/.vimrc file (see the OPTIONS section for a full list of available options).

In addition, when the match listing has focus, typing a character will cause
the selection to jump to the first path which begins with that character.
Typing multiple characters consecutively can be used to distinguish between
paths which begin with the same prefix.


COMMANDS                                        *command-t-commands*

                                                *:CommandT*
|:CommandT|     Brings up the Command-T match window, starting in the
                current working directory as returned by the|:pwd|
                command.

                                                *:CommandTFlush*
|:CommandTFlush|Instructs the plug-in to flush its path cache, causing
                the directory to be rescanned for new or deleted paths
                the next time the match window is shown. In addition, all
                configuration settings are re-evaluated, causing any
                changes made to settings via the |:let| command to be picked
                up.


MAPPINGS                                        *command-t-mappings*

By default Command-T comes with only one mapping:

  <Leader>t     bring up the Command-T match window

However, Command-T won't overwrite a pre-existing mapping so if you prefer
to define a different mapping use a line like this in your ~/.vimrc:

  nmap <silent> <Leader>t :CommandT<CR>

Replacing "<Leader>t" with your mapping of choice.

Note that in the case of MacVim you actually can map to Command-T (written
as <D-t> in Vim) in your ~/.gvimrc file if you first unmap the existing menu
binding of Command-T to "New Tab":

  if has("gui_macvim")
    macmenu &File.New\ Tab key=<nop>
    map <D-t> :CommandT<CR>
  endif

When the Command-T window is active a number of other additional mappings
become available for doing things like moving between and selecting matches.
These are fully described above in the USAGE section, and settings for
overriding the mappings are listed below under OPTIONS.


OPTIONS                                         *command-t-options*

A number of options may be set in your ~/.vimrc to influence the behaviour of
the plug-in. To set an option, you include a line like this in your ~/.vimrc:

    let g:CommandTMaxFiles=20000

To have Command-T pick up new settings immediately (that is, without having
to restart Vim) you can issue the |:CommandTFlush| command after making
changes via |:let|.

Following is a list of all available options:

                                                *g:CommandTMaxFiles*
  |g:CommandTMaxFiles|                           number (default 10000)

      The maximum number of files that will be considered when scanning the
      current directory. Upon reaching this number scanning stops.

                                                *g:CommandTMaxDepth*
  |g:CommandTMaxDepth|                           number (default 15)

      The maximum depth (levels of recursion) to be explored when scanning the
      current directory. Any directories at levels beyond this depth will be
      skipped.

                                                *g:CommandTMaxHeight*
  |g:CommandTMaxHeight|                          number (default: 0)

      The maximum height in lines the match window is allowed to expand to.
      If set to 0, the window will occupy as much of the available space as
      needed to show matching entries.

                                                *g:CommandTAlwaysShowDotFiles*
  |g:CommandTAlwaysShowDotFiles|                 boolean (default: 0)

      By default Command-T will show dot-files only if the entered search
      string contains a dot that could cause a dot-file to match. When set to
      a non-zero value, this setting instructs Command-T to always include
      matching dot-files in the match list regardless of whether the search
      string contains a dot. See also |g:CommandTNeverShowDotFiles|.

                                                *g:CommandTNeverShowDotFiles*
  |g:CommandTNeverShowDotFiles|                  boolean (default: 0)

      By default Command-T will show dot-files if the entered search string
      contains a dot that could cause a dot-file to match. When set to a
      non-zero value, this setting instructs Command-T to never show dot-files
      under any circumstances. Note that it is contradictory to set both this
      setting and |g:CommandTAlwaysShowDotFiles| to true, and if you do so Vim
      will suffer from headaches, nervous twitches, and sudden mood swings.

                                                *g:CommandTScanDotDirectories*
  |g:CommandTScanDotDirectories|                 boolean (default: 0)

      Normally Command-T will not recurse into "dot-directories" (directories
      whose names begin with a dot) while performing its initial scan. Set
      this setting to a non-zero value to override this behavior and recurse.
      Note that this setting is completely independent of the
      |g:CommandTAlwaysShowDotFiles| and |g:CommandTNeverShowDotFiles|
      settings; those apply only to the selection and display of matches
      (after scanning has been performed), whereas
      |g:CommandTScanDotDirectories| affects the behaviour at scan-time.

      Note also that even with this setting on you can still use Command-T to
      open files inside a "dot-directory" such as ~/.vim, but you have to use
      the |:cd| command to change into that directory first. For example:

        :cd ~/.vim
        :CommandT

                                                *g:CommandTMatchWindowAtTop*
  |g:CommandTMatchWindowAtTop|                   boolean (default: 0)

      When this settings is off (the default) the match window will appear at
      the bottom so as to keep it near to the prompt. Turning it on causes the
      match window to appear at the top instead. This may be preferable if you
      want the best match (usually the first one) to appear in a fixed location
      on the screen rather than moving as the number of matches changes during
      typing.

As well as the basic options listed above, there are a number of settings that
can be used to override the default key mappings used by Command-T. For
example, to set <C-x> as the mapping for cancelling (dismissing) the Command-T
window, you would add the following to your ~/.vimrc:

  let g:CommandTCancelMap='<C-x>'

Multiple, alternative mappings may be specified using list syntax:

  let g:CommandTCancelMap=['<C-x>', '<C-c>']

Following is a list of all map settings and their defaults:

                              Setting   Default mapping(s)

                                       *g:CommandTBackspaceMap*
              |g:CommandTBackspaceMap|  <BS>

                                       *g:CommandTDeleteMap*
                 |g:CommandTDeleteMap|  <Del>

                                       *g:CommandTAcceptSelectionMap*
        |g:CommandTAcceptSelectionMap|  <CR>

                                       *g:CommandTAcceptSelectionSplitMap*
   |g:CommandTAcceptSelectionSplitMap|  <C-CR>
                                        <C-s>

                                       *g:CommandTAcceptSelectionTabMap*
     |g:CommandTAcceptSelectionTabMap|  <C-t>

                                       *g:CommandTAcceptSelectionVSplitMap*
  |g:CommandTAcceptSelectionVSplitMap|  <C-v>

                                       *g:CommandTToggleFocusMap*
            |g:CommandTToggleFocusMap|  <Tab>

                                       *g:CommandTCancelMap*
                 |g:CommandTCancelMap|  <C-c>
                                        <Esc> (not on all terminals)

                                       *g:CommandTSelectNextMap*
             |g:CommandTSelectNextMap|  <C-n>
                                        <C-j>
                                        <Down>

                                       *g:CommandTSelectPrevMap*
             |g:CommandTSelectPrevMap|  <C-p>
                                        <C-k>
                                        <Up>

                                       *g:CommandTClearMap*
                  |g:CommandTClearMap|  <C-u>

                                       *g:CommandTCursorLeftMap*
             |g:CommandTCursorLeftMap|  <Left>
                                        <C-h>

                                       *g:CommandTCursorRightMap*
            |g:CommandTCursorRightMap|  <Right>
                                        <C-l>

                                       *g:CommandTCursorEndMap*
              |g:CommandTCursorEndMap|  <C-e>

                                       *g:CommandTCursorStartMap*
            |g:CommandTCursorStartMap|  <C-a>

In addition to the options provided by Command-T itself, some of Vim's own
settings can be used to control behavior:

                                                *command-t-wildignore*
  |'wildignore'|                                 string (default: '')

      Vim's |'wildignore'| setting is used to determine which files should be
      excluded from listings. This is a comma-separated list of glob patterns.
      It defaults to the empty string, but common settings include "*.o,*.obj"
      (to exclude object files) or ".git,.svn" (to exclude SCM metadata
      directories). For example:

        :set wildignore+=*.o,*.obj,.git

      A pattern such as "vendor/rails/**" would exclude all files and
      subdirectories inside the "vendor/rails" directory (relative to
      directory Command-T starts in).

      See the |'wildignore'| documentation for more information.


AUTHORS                                         *command-t-authors*

Command-T is written and maintained by Wincent Colaiuta <win@wincent.com>.
Other contributors that have submitted patches include:

  Lucas de Vries
  Mike Lundy
  Scott Bronson
  Zak Johnson

As this was the first Vim plug-in I had ever written I was heavily influenced
by the design of the LustyExplorer plug-in by Stephen Bach, which I understand
is one of the largest Ruby-based Vim plug-ins to date.

While the Command-T codebase doesn't contain any code directly copied from
LustyExplorer, I did use it as a reference for answers to basic questions (like
"How do you do 'X' in a Ruby-based Vim plug-in?"), and also copied some basic
architectural decisions (like the division of the code into Prompt, Settings
and MatchWindow classes).

LustyExplorer is available from:

  http://www.vim.org/scripts/script.php?script_id=1890


WEBSITE                                         *command-t-website*

The official website for Command-T is:

  https://wincent.com/products/command-t

The latest release will always be available from there.

Development in progress can be inspected via the project's Git repository
browser at:

  http://git.wincent.com/command-t.git

A copy of each release is also available from the official Vim scripts site
at:

  http://www.vim.org/scripts/script.php?script_id=3025

Bug reports should be submitted to the issue tracker at:

  https://wincent.com/issues


DONATIONS                                       *command-t-donations*

Command-T itself is free software released under the terms of the BSD license.
If you would like to support further development you can make a donation via
PayPal to win@wincent.com:

  https://wincent.com/products/command-t/donations


LICENSE                                         *command-t-license*

Copyright 2010 Wincent Colaiuta. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.


HISTORY                                         *command-t-history*

0.8 (19 August 2010)

- overrides for the default mappings can now be lists of strings, allowing
  multiple mappings to be defined for any given action
- <Leader>t mapping only set up if no other map for |:CommandT| exists
  (patch from Scott Bronson)
- prevent folds from appearing in the match listing
- tweaks to avoid the likelihood of "Not enough room" errors when trying to
  open files
- watch out for "nil" windows when restoring window dimensions
- optimizations (avoid some repeated downcasing)
- move all Ruby files under the "command-t" subdirectory and avoid polluting
  the "Vim" module namespace

0.8b (11 July 2010)

- large overhaul of the scoring algorithm to make the ordering of returned
  results more intuitive; given the scope of the changes and room for
  optimization of the new algorithm, this release is labelled as "beta"

0.7 (10 June 2010)

- handle more |'wildignore'| patterns by delegating to Vim's own |expand()|
  function; with this change it is now viable to exclude patterns such as
  'vendor/rails/**' in addition to filename-only patterns like '*.o' and
  '.git' (patch from Mike Lundy)
- always sort results alphabetically for empty search strings; this eliminates
  filesystem-specific variations (patch from Mike Lundy)

0.6 (28 April 2010)

- |:CommandT| now accepts an optional parameter to specify the starting
  directory, temporarily overriding the usual default of Vim's |:pwd|
- fix truncated paths when operating from root directory

0.5.1 (11 April 2010)

- fix for Ruby 1.9 compatibility regression introduced in 0.5
- documentation enhancements, specifically targetted at Windows users

0.5 (3 April 2010)

- |:CommandTFlush| now re-evaluates settings, allowing changes made via |let|
  to be picked up without having to restart Vim
- fix premature abort when scanning very deep directory hierarchies
- remove broken |<Esc>| key mapping on vt100 and xterm terminals
- provide settings for overriding default mappings
- minor performance optimization

0.4 (27 March 2010)

- add |g:CommandTMatchWindowAtTop| setting (patch from Zak Johnson)
- documentation fixes and enhancements
- internal refactoring and simplification

0.3 (24 March 2010)

- add |g:CommandTMaxHeight| setting for controlling the maximum height of the
  match window (patch from Lucas de Vries)
- fix bug where |'list'| setting might be inappropriately set after dismissing
  Command-T
- compatibility fix for different behaviour of "autoload" under Ruby 1.9.1
- avoid "highlight group not found" warning when run under a version of Vim
  that does not have syntax highlighting support
- open in split when opening normally would fail due to |'hidden'| and
  |'modified'| values

0.2 (23 March 2010)

- compatibility fixes for compilation under Ruby 1.9 series
- compatibility fixes for compilation under Ruby 1.8.5
- compatibility fixes for Windows and other non-UNIX platforms
- suppress "mapping already exists" message if <Leader>t mapping is already
  defined when plug-in is loaded
- exclude paths based on |'wildignore'| setting rather than a hardcoded
  regular expression

0.1 (22 March 2010)

- initial public release

------------------------------------------------------------------------------
vim:tw=78:ft=help:
