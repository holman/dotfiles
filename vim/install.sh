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
# get checkers for syntastic
pip install pyflakes
cd ~/.dotfiles
