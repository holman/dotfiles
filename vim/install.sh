curl -fLo ~/.config/nvim/autoload/plug.vim --create-dirs \
    https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim

mkdir -p ~/.config/nvim/colors

rm ~/.config/nvim/init.vim
ln -s ~/.vimrc ~/.config/nvim/init.vim
cp ~/.dotfiles/vim/molokai.vim ~/.config/nvim/colors/molokai.vim