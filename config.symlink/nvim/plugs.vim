" install vim-plug if needed.
" stolen from https://github.com/dbernheisel/dotfiles/blob/master/.config/nvim/init.vim
if empty(glob('~/.local/share/nvim/site/autoload/plug.vim'))
  silent !curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs
    \ https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
  autocmd VimEnter * PlugInstall --sync | source $MYVIMRC
endif

" Initialize plugin system
call plug#begin(stdpath('data') . '/plugged')

" Make sure you use single quotes

" =================
" Style
" =================

" color scheme
Plug 'jpo/vim-railscasts-theme'


" =================
" Programming
" =================

" all language plugins
Plug 'sheerun/vim-polyglot'

" Intellisense
Plug 'neoclide/coc.nvim', {'branch': 'release'}


call plug#end()
