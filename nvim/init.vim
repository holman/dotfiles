" Install vim-plug if not installed.
" curl -fLo ~/.local/share/nvim/site/autoload/plug.vim --create-dirs https://raw.githubusercontent.com/junegunn/vim-plug/master/plug.vim
" Might need to link the .vim to the .nvim director
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
Plug 'catppuccin/nvim', {'as': 'catppuccin'}
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
Plug 'https://github.com/ryanoasis/vim-devicons' " Developer Icons
Plug 'https://github.com/tc50cal/vim-terminal' " Vim Terminal
Plug 'https://github.com/preservim/tagbar' " Tagbar for code navigation
Plug 'https://github.com/terryma/vim-multiple-cursors' " CTRL + N for multiple cursors
Plug 'https://github.com/sheerun/vim-polyglot'
Plug 'https://github.com/vim-scripts/indentpython.vim'
Plug 'https://github.com/vim-syntastic/syntastic'
Plug 'https://github.com/nvie/vim-flake8'
Plug 'neoclide/coc.nvim', {'branch': 'release'}


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

let NERDTreeIgnore=['\.pyc$', '\~$'] "ignore files in NERDTree

nmap <F8> :TagbarToggle<CR>

:set completeopt-=preview " For No Previews

let g:catppuccin_flavour = "macchiato" " latte, frappe, macchiato, mocha

lua << EOF
require("catppuccin").setup()
EOF

colorscheme catppuccin

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

" Python tab settings
" au BufNewFile,BufRead *.py
"     \ set tabstop=4
"     \ set softtabstop=4
"     \ set shiftwidth=4
"     \ set textwidth=79
"     \ set expandtab
"     \ set autoindent
"     \ set fileformat=unix

" THIS IS FOR AUTO COMPLETION
" Use tab for trigger completion with characters ahead and navigate.
" NOTE: There's always complete item selected by default, you may want to enable
" no select by `"suggest.noselect": true` in your configuration file.
" NOTE: Use command ':verbose imap <tab>' to make sure tab is not mapped by
" other plugin before putting this into your config.
inoremap <silent><expr> <TAB>
      \ coc#pum#visible() ? coc#pum#next(1) :
      \ CheckBackspace() ? "\<Tab>" :
      \ coc#refresh()
inoremap <expr><S-TAB> coc#pum#visible() ? coc#pum#prev(1) : "\<C-h>"

" Make <CR> to accept selected completion item or notify coc.nvim to format
" <C-g>u breaks current undo, please make your own choice.
inoremap <silent><expr> <CR> coc#pum#visible() ? coc#pum#confirm()
                              \: "\<C-g>u\<CR>\<c-r>=coc#on_enter()\<CR>"

function! CheckBackspace() abort
  let col = col('.') - 1
  return !col || getline('.')[col - 1]  =~# '\s'
endfunction
