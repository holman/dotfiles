
git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim

mkdir -p ~/.vim/temp
mkdir -p ~/.vim/colors
git clone git://github.com/altercation/vim-colors-solarized.git ~/.vim/temp/
cp ~/.vim/temp/vim-colors-solarized/colors/solarized.vim ~/.vim/colors
