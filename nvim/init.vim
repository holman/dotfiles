" Install vim-plug if not installed.
if empty(glob('~/.local/share/nvim/site/autoload/plug.vim'))
	silent !curl -fLo "${XDG_DATA_HOME:-$HOME/.local/share}"/nvim/site/autoload/plug.vim --create-dirs \
       https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim'
	autocmd VimEnter * PlugInstall | source $MYVIMRC
endif
:set number
:set relativenumber
:set autoindent
:set tabstop=4
:set shiftwidth=4
:set smarttab
:set softtabstop=4
:set mouse=a

call plug#begin()

Plug 'tpope/vim-fugitive'
Plug 'tpope/vim-endwise'              " Adds end to methods for if's etc.
Plug 'tpope/vim-rails'
Plug 'vim-ruby/vim-ruby'
Plug 'pangloss/vim-javascript'
Plug 'tpope/vim-markdown'
Plug 'elzr/vim-json'
Plug 'prettier/vim-prettier', { 'do': 'yarn install' }

" Plug 'tomtom/tcomment_vim'            " Commentor
" Plug 'godlygeek/tabular'
" Plug 'mxw/vim-jsx'
" Plug 'w0rp/ale'
" Plug 'itchyny/lightline.vim'
" Plug 'maximbaz/lightline-ale'
" Plug 'mileszs/ack.vim'
" Plug 'benmills/vimux'
" Plug 'posva/vim-vue'
" Plug 'rizzatti/dash.vim'
" Plug 'othree/yajs.vim'
" Plug 'HerringtonDarkholme/yats.vim'
" Plug 'othree/html5.vim'
" Plug 'junegunn/fzf', { 'do': { -> fzf#install() } }
" Plug 'vimwiki/vimwiki'
" Plug 'arcticicestudio/nord-vim'
" Plug 'tpope/vim-vinegar'

Plug 'http://github.com/tpope/vim-surround' " Surrounding ysw)
Plug 'http://github.com/tpope/vim-bundler'
Plug 'http://github.com/airblade/vim-gitgutter'
Plug 'https://github.com/preservim/nerdtree' " NerdTree
Plug 'https://github.com/tpope/vim-commentary' " For Commenting gcc & gc
Plug 'https://github.com/vim-airline/vim-airline' " Status bar
Plug 'https://github.com/ap/vim-css-color' " CSS Color Preview
Plug 'https://github.com/rafi/awesome-vim-colorschemes' " Retro Scheme
Plug 'https://github.com/ryanoasis/vim-devicons' " Developer Icons
Plug 'https://github.com/tc50cal/vim-terminal' " Vim Terminal
Plug 'https://github.com/preservim/tagbar' " Tagbar for code navigation
Plug 'https://github.com/terryma/vim-multiple-cursors' " CTRL + N for multiple cursors

set encoding=UTF-8

call plug#end()

let mapleader = ','

" reload the vim file 
map <leader>rld :source ~/.config/nvim/init.vim<CR>

nnoremap <C-f> :NERDTreeFocus<CR>
nnoremap <C-n> :NERDTree<CR>
nnoremap <silent> <leader>nn :NERDTreeToggle<CR>

nmap <F8> :TagbarToggle<CR>

:set completeopt-=preview " For No Previews


:colorscheme jellybeans

let g:NERDTreeDirArrowExpandable="+"
let g:NERDTreeDirArrowCollapsible="~"

" --- Just Some Notes ---
" :PlugClean :PlugInstall :UpdateRemotePlugins

" air-line
let g:airline_powerline_fonts = 1

if !exists('g:airline_symbols')
    let g:airline_symbols = {}
endif

" airline symbols
let g:airline_left_sep = ''
let g:airline_left_alt_sep = ''
let g:airline_right_sep = ''
let g:airline_right_alt_sep = ''
let g:airline_symbols.branch = ''
let g:airline_symbols.readonly = ''
let g:airline_symbols.linenr = ''
