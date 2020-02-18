set nocompatible " be iMproved, required

" Plugins
"Load Vundle config
if filereadable(expand("~/.config/nvim/plugs.vim"))
  source ~/.config/nvim/plugs.vim
endif

" General
"
" Customize keybindings
let mapleader="\<SPACE>"

" Style

syntax on
filetype on

" set Vim-specific sequences for RGB colors
" https://tomlankhorst.nl/iterm-tmux-vim-true-color/
let &t_8f = "\<Esc>[38;2;%lu;%lu;%lum"
let &t_8b = "\<Esc>[48;2;%lu;%lu;%lum"
set termguicolors

function! LightMode()
  set background=light
  colorscheme Tomorrow
endfunction

function! DarkMode()
  set background=dark
  colorscheme Tomorrow-Night-Eighties
endfunction

" Default color mode based on system settings
if system('darkMode') =~ "Dark"
  :call DarkMode()
else
  :call LightMode()
endif


" Leader key settings

" v(im)

" t(theme)
nmap <leader>vtl :call LightMode()<CR>
nmap <leader>vtd :call DarkMode()<CR>

" r(eload)
nmap <leader>vr :source $MYVIMRC<CR>



" end v(im) section
