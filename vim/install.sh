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

echo "installing vim supertab"
cd ~/.vim/bundle
if cd ~/.vim/bundle/supertab; 
  then git pull; 
  else git clone --depth=1 git@github.com:ervandew/supertab.git;
fi

echo "installing vim easygrep"
cd ~/.vim/bundle
if cd ~/.vim/bundle/vim-easygrep; 
  then git pull; 
  else git clone --depth=1 git@github.com:dkprice/vim-easygrep.git;
fi

# get checkers for syntastic
pip install pyflakes --user
cd ~/.dotfiles
