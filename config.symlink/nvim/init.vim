set nocompatible " be iMproved, required

" Plugins
"Load Vundle config
if filereadable(expand("~/.config/nvim/plugs.vim"))
  source ~/.config/nvim/plugs.vim
endif

" Style

syntax on
filetype on

" set Vim-specific sequences for RGB colors
" https://tomlankhorst.nl/iterm-tmux-vim-true-color/
let &t_8f = "\<Esc>[38;2;%lu;%lu;%lum"
let &t_8b = "\<Esc>[48;2;%lu;%lu;%lum"
set termguicolors

colorscheme Tomorrow

