echo "installing theme"
mkdir -p ~/.vim/colors
curl https://raw.githubusercontent.com/sickill/vim-monokai/master/colors/monokai.vim -o ~/.vim/colors/monokai.vim

if [ -d ~/.vim/bundle/Vundle.vim ]; then
    echo "updating Vundle"
    git -C ~/.vim/bundle/Vundle.vim pull 
else
    echo "installing Vundle"
    git clone https://github.com/VundleVim/Vundle.vim.git ~/.vim/bundle/Vundle.vim
fi
vim +PluginInstall +qall
