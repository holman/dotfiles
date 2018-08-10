export WD_HOME=$HOME/.wd

if [ ! -d "$WD_HOME"]; then
    git clone https://github.com/mfaerevaag/wd.git $WD_HOME
fi;
