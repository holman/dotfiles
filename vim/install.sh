#!/bin/sh

cd ~
git clone git://github.com/zaiste/vimified.git
ln -sfn vimified/ ~/.vim
ln -sfn vimified/vimrc ~/.vimrc
cd vimified

mkdir bundle
mkdir -p tmp/backup tmp/swap tmp/undo

git clone https://github.com/gmarik/vundle.git bundle/vundle
echo "let g:vimified_packages = ['general', 'fancy', 'css', 'js', 'os', 'html', 'coding', 'color', 'ruby']" > local.vimrc

ln -s ~/.extra.vimrc ~/vimified/extra.vimrc
ln -s ~/.after.vimrc ~/vimified/after.vimrc

vim +BundleInstall +qall 2>/dev/null
