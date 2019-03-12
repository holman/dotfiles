##############################################################################
#
#   COMMON .cshrc file
#
#   Version: 2.0.0,  Date: 97/03/27
#
#   This file will source the global .cshrc file
#
#   If you want aliases in addition to those in the globals file,
#   put them in a file called .cshrc.solaris in your home directory.
#
#   Following are variables you can set to modify your environment:
#
##############################################################################

setenv WINDOWS  "X" # [X] X11R6, [O] OpenWindows, [N] None
setenv ASK_WIN  "y" # Ask for window system on startup?
setenv BANNERS  "y" # 'y' if you want CWD in the window banner
setenv PROMPT   "d" # [d]efault, [c]wd (current working directory) or [o]wn.
setenv ALIASES  "y" # 'y' if you want the standard aliases (good idea!)
setenv PRINTERS "y" # 'y' if you want the standard printer aliases.
setenv ERASE    "d" # Erase character: [d]elete or [b]ackspace
setenv CHK_MAIL "n" # Let your shell check mail?

setenv MYPROMPT ""  # customize prompt

##############################################################################
# Source common CSH startup file.
##############################################################################
## Set C shell variables
# Remember my 5000 most recent events
set history=5000

# Save the most recent 5000 events when I log out
set savehist=5000

# Shortcut aliases
alias dict    'vi /usr/dict/words'
alias gs      'ghostscript'
alias laser   'lpr -Pmsa13 -h'
alias line    'lpr -Ped3'
alias ll      'ls -la'
alias ls      'ls -x'
alias mine    'chmod og-rwx'
alias pwd     'echo $cwd'       # This is faster than executing the pwd command
alias safe    'chmod a-w'

#directory aliases
alias socp      'cd ~/code/matlab/socp'
alias bn                'cd ~/code/matlab/utility/script/'
set cm =        '~/code/matlab'
set D  =        '~/Desktop'

#personal:
alias nice      '/usr/bin/nice -n 10'
alias n         'nice '
alias t         'top '
alias m         'free | grep -B2 Mem'
alias f         'vmstat | colrm 1 12 | colrm 10 59 | colrm 14 |grep -A 2 free'
alias fh                'find /ubc/ece/home/ll/grads/naddaf/ -name'
alias M         'matlab'
alias b         'bluefish'
alias c     'clear'
alias clc   'clear'
alias cls       'clear'
alias conf  './configure --prefix /data/naddaf6/ CFLAGS='-I/data/naddaf6/include' LDFLAGS=-L/data/naddaf6/lib'
alias D         'cd ~/Desktop'
alias DL                'cd ~/Downloads'
alias dude  'du -si ~/'
alias Q         'quota -s'
alias E         '/ubc/ece/home/ll/grads/naddaf/software/eclipse/eclipse'
alias erc       'b  ~/.cshrc ; csh'
alias vrc       'vi ~/.cshrc ; csh'
alias ff3       'n ssh -X commlab32 firefox'
#alias g                'gimp'
#alias k                'xcalc'
alias openoffice 'openoffice.org'
alias  oo   'openoffice'
alias svn       '/data/naddaf6/bin/svn'
#alias u                'uptime'
alias xf                'xset fp rehash | xfig specialtext -latexfonts -startlatexFont default'
alias matbg     '/ubc/ece/home/ll/grads/naddaf/code/matlab/utility/script/matbg2'
alias nmatbg 'n /ubc/ece/home/ll/grads/naddaf/code/matlab/utility/script/matbg2'
alias rmfflock 'rm ~/.mozilla/firefox/*.default/.parentlock' 

#ssh aliases
alias gohome    'ssh -X lampe5 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias ll4       'ssh -X lampe4 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias ll5       'ssh -X lampe5 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias ll6       'ssh -X lampe6 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias ll7       'ssh -X lampe7 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias ll8       'ssh -X lampe8 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias ll9       'ssh -X lampe9 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias rs10      'ssh -X rschober10 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias rs2       'ssh -X rs-dell02 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias rs3       'ssh -X rschober03 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias rs4       'ssh -X rs-dell04 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias rs6       'ssh -X rs-dell06 -l naddaf -i ~/.ssh/id_rsa_no_passwd'
alias rs7       'ssh -X rs-dell07 -l naddaf -i ~/.ssh/id_rsa_no_passwd'

source /usr/common/Cshrc

setenv TMPDIR /ubc/ece/home/ll/grads/naddaf/tmp
setenv TMP /ubc/ece/home/ll/grads/naddaf/tmp

#MOSEK Configuration
set PLATFORM = linux32x86
set MSKHOME = /ubc/ece/home/ll/grads/naddaf/code/matlab/mosek
if ( ${?LD_LIBRARY_PATH} ) then
        setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:$MSKHOME/mosek/5/tools/platform/$PLATFORM/bin
else
        setenv LD_LIBRARY_PATH $MSKHOME/mosek/5/tools/platform/$PLATFORM/bin
endif

setenv MOSEKLM_LICENSE_FILE $MSKHOME/mosek/5/licenses
set path = ($path /usr/include/kde $MSKHOME/mosek/5/tools/platform/$PLATFORM/bin)
#Graph toolbox for matlab:
setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/ubc/ece/home/ll/grads/naddaf/code/matlab/glpk4/lib
#/usr/lib libraries:
setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/usr/lib
#Qt chat program (needed newer kernel)
#setenv PATH /ubc/ece/home/ll/grads/naddaf/ProgramFiles/Qt-4.6.1/lib:$PATH
#setenv PATH /ubc/ece/home/ll/grads/naddaf/ProgramFiles/Qt-4.6.1/bin:$PATH
#setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/ubc/ece/home/ll/grads/naddaf/ProgramFiles/Qt-4.6.1/lib

setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/data/naddaf6/lib
setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/data/naddaf6/lib/tcl8.5/sqlite3

#OPNET path:
set path = ($path /usr/local/bin/)
setenv PATH /usr/local/bin:$PATH

#local bin files:
set path = ($path /ubc/ece/home/ll/grads/naddaf/.local/bin) 
setenv PATH /ubc/ece/home/ll/grads/naddaf/.local/bin:$PATH
set path = ($path /ubc/ece/home/ll/grads/naddaf/software/cmake-2.8.3-Linux-i386/bin) 
setenv PATH /ubc/ece/home/ll/grads/naddaf/software/cmake-2.8.3-Linux-i386/bin:$PATH
set path = ($path /data/naddaf6/bin) 
setenv PATH /data/naddaf6/bin:$PATH
set path = ($path /data/naddaf6/include) 
setenv PATH /data/naddaf6/include:$PATH

setenv PKG_CONFIG_PATH /data/naddaf6/lib/pkgconfig
set PKG_CONFIG  = pkg-config

#MATLAB MCC
setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/opt/Matlab_R2008b/sys/java/jre/glnxa64/jre/lib/amd64/native_threads
setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/opt/Matlab_R2008b/sys/java/jre/glnxa64/jre/lib/amd64/server
setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/opt/Matlab_R2008b/sys/java/jre/glnxa64/jre/lib/amd64
setenv LD_LIBRARY_PATH ${LD_LIBRARY_PATH}:/opt/Matlab_R2008b/bin/glnxa64/
setenv XAPPLRESDIR /opt/Matlab_R2008b/X11/app-defaults

setenv CFLAGS "-I/data/naddaf6/include,/data/naddaf6/src/sqlite-3.7.3/ -L/data/naddaf6/lib,/usr/lib"

#Package Config Paths (required for texmaker)
if ( ${?PKG_CONFIG_PATH} ) then
        setenv PKG_CONFIG_PATH ${PKG_CONFIG_PATH}:/usr/lib/pkgconfig
else
        setenv PKG_CONFIG_PATH /usr/lib/pkgconfig
endif
#setenv PKG_CONFIG_PATH ${PKG_CONFIG_PATH}:/data/naddaf/usr/lib/pkgconfig
#setenv PKG_CONFIG_PATH ${PKG_CONFIG_PATH}:/data/naddaf/qt/qt/lib/pkgconfig:/data/naddaf/pretype/lib/pkgconfig:/data/naddaf/fc2/lib/pkgconfig:/data/naddaf/poppler/lib/pkgconfig
#texmaker binary
#setenv INCLUDE_PATH /usr/include:/data/naddaf6/include

if ( ${?XORGCONFIG} ) then
        setenv XORGCONFIG ${XORGCONFIG}:/ubc/ece/home/ll/grads/naddaf/X11
else
        setenv XORGCONFIG /ubc/ece/home/ll/grads/naddaf/X11
endif

setenv EDITOR /usr/bin/vi
