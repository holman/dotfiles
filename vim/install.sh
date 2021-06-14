#!/bin/bash

set -e 

echo "installing vim pathogen"
mkdir -p ~/.vim/autoload ~/.vim/bundle
cd ~/.vim/autoload
curl -LSso ~/.vim/autoload/pathogen.vim https://tpo.pe/pathogen.vim

echo "installing vim syntastic"
cd ~/.vim/bundle
if cd ~/.vim/bundle/syntastic; 
  then git pull; 
  else git clone --depth=1 https://github.com/vim-syntastic/syntastic.git; 
fi
# get checkers for python
pip3 install pylint
pip3 install pyflakes

echo "installing vim supertab"
cd ~/.vim/bundle
if cd ~/.vim/bundle/supertab; 
  then git pull; 
  else git clone --depth=1 git@github.com:ervandew/supertab.git;
fi

#echo "installing vim black plugin"
#mkdir -p ~/.vim/bundle/black/plugin
#curl https://raw.githubusercontent.com/psf/black/master/plugin/black.vim -o ~/.vim/bundle/black/plugin/black.vim
#vim /dev/null -c 'q'  # make black venv
# solve issue https://github.com/psf/black/issues/1293
#source ~/.vim/black/bin/activate  # make sure to install in the right venv
#pip install --upgrade git+https://github.com/psf/black.git
#deactivate

# get checkers for syntastic
pip3 install pyflakes
cd ~/.dotfiles
