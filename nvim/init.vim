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
Plug 'preservim/vimux'
Plug 'EdenEast/nightfox.nvim'
Plug 'ludovicchabant/vim-gutentags'
Plug 'nvim-lua/plenary.nvim'
Plug 'nvim-telescope/telescope.nvim'
Plug 'nvim-telescope/telescope-fzf-native.nvim'
Plug 'https://github.com/nvim-treesitter/nvim-treesitter'
Plug 'http://github.com/tpope/vim-surround' " Surrounding ysw)
Plug 'http://github.com/tpope/vim-bundler'
Plug 'http://github.com/airblade/vim-gitgutter'
Plug 'https://github.com/preservim/nerdtree' " NerdTree
Plug 'https://github.com/tpope/vim-commentary' " For Commenting gcc & gc
Plug 'https://github.com/vim-airline/vim-airline' " Status bar
Plug 'https://github.com/ap/vim-css-color' " CSS Color Preview
" Not needed for kitty, but needed for alacritty
Plug 'https://github.com/ryanoasis/vim-devicons' " Developer Icons
Plug 'https://github.com/tc50cal/vim-terminal' " Vim Terminal
Plug 'https://github.com/preservim/tagbar' " Tagbar for code navigation
Plug 'https://github.com/terryma/vim-multiple-cursors' " CTRL + N for multiple cursors
Plug 'https://github.com/sheerun/vim-polyglot'

:set encoding=UTF-8

set guifont=Hack\ Nerd\ Font\ Mono:h14

call plug#end()

let mapleader = ','

" reload the vim file
map <leader>rld :source ~/.config/nvim/init.vim<CR>

" Movement around panes CTRL-<letter>
nnoremap <C-J> <C-W><C-J>
nnoremap <C-K> <C-W><C-K>
nnoremap <C-L> <C-W><C-L>
nnoremap <C-H> <C-W><C-H>

" easier window splits
nnoremap <silent> vv <C-w>v
nnoremap <silent> ss <C-w>s

" Nerd Tree
nnoremap <C-f> :NERDTreeFocus<CR>
nnoremap <C-n> :NERDTree<CR>
nnoremap <silent> <leader>nn :NERDTreeToggle<CR>

nmap <F8> :TagbarToggle<CR>

:set completeopt-=preview " For No Previews

:colorscheme nightfox

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

" Fugitive
nnoremap <silent> <leader>gs :Git<CR>
nnoremap <silent> <leader>gd :Gdiff<CR>
nnoremap <silent> <leader>gc :Git commit<CR>
nnoremap <silent> <leader>gb :Git blame<CR>
nnoremap <silent> <leader>gl :Glog<CR>
nnoremap <silent> <leader>gp :Git push<CR>
nnoremap <silent> <leader>gr :Gread<CR>
nnoremap <silent> <leader>gw :Gwrite<CR>
nnoremap <silent> <leader>ge :Gedit<CR>

" Always enable preview window on the right with 60% width
let g:fzf_layout = { 'up': '~25%' }
nnoremap <silent> <leader>s <cmd>Telescope find_files<cr>
nnoremap <silent> <leader>sg <cmd>Telescope live_grep<cr>
nnoremap <silent> <leader>sG <cmd>Telescope grep_string<cr>
nnoremap <silent> <leader>ja <cmd>Telescope find_files cwd=app/assets/<cr>
nnoremap <silent> <leader>jc <cmd>Telescope find_files cwd=app/controllers/<cr>
nnoremap <silent> <leader>ji <cmd>Telescope find_files cwd=app/interactors/<cr>
nnoremap <silent> <leader>jm <cmd>Telescope find_files cwd=app/models/<cr>
nnoremap <silent> <leader>jv <cmd>Telescope find_files cwd=app/views/<cr>
nnoremap <silent> <leader>jT <cmd>Telescope find_files cwd=test/<cr>

" Easier rails movement
nnoremap <leader>vv :Eview<cr>
nnoremap <leader>cc :Econtroller<cr>
nnoremap <leader>rA :AV<cr>
nnoremap <leader>ra :A<cr>

" exit to normal mode with jj
inoremap jj <ESC>

"Clear current search highlight by double tapping //
nmap <silent> // :nohlsearch<CR>

" TSlime
" let g:tslime_always_current_session = 1
" let g:tslime_always_current_window = 1
" let g:tslime_autoset_pane = 1

" Test runner
map <Leader>rt :call VimuxRunCommand("clear; bundle exec rails test -f -c " . bufname("%"))<CR>
map <Leader>dt :call VimuxRunCommand("clear; docker-compose exec test bin/rails test " . fnamemodify(expand("%"), ":~:."))<CR>
map <Leader>qq :VimuxCloseRunner<CR>
map <Leader>rp :call VimuxRunCommand("clear; bin/prontoci run")<CR>

nnoremap <Leader><Leader> :e#<CR> " Reopen last file
nnoremap <Leader>w :w<CR> " <Leader>w will save
map q <Nop>

" Automatically trim trailing whitespace
fun! <SID>StripTrailingWhitespaces()
  let l = line(".")
  let c = col(".")
  %s/\s\+$//e
  call cursor(l, c)
endfun
autocmd BufWritePre * :call <SID>StripTrailingWhitespaces()
autocmd BufWritePre * :%s#\($\n\s*\)\+\%$##e

" bind K to grep word under cursor
nnoremap K :grep! "\b<C-R><C-W>\b"<CR>:cw<CR>

augroup filetype_stand_up.txt
    autocmd!
    autocmd BufNewFile stand_up.txt 0r ~/.config/nvim/stand_up.txt
	autocmd BufNewFile article.txt 5$pu=strftime('%Y-%m-%d %H:%M:%S')
    autocmd BufNewFile article.txt :normal ggA
augroup END
