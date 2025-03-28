" options
" 入力中のコマンドをステータスに表示する
set showcmd
" 行番号を表示
set number
" タイトルを表示
set title
" インデントはスマートインデント
set smartindent
" ビープ音を可視化
set visualbell
" 括弧入力時の対応する括弧を表示
set showmatch
" コマンドラインの補完
set wildmode=list:longest
" シンタックスハイライトの有効化
syntax enable
" vim 系のファイルのみ fold を有効化
au FileType vim setlocal foldmethod=marker
" Tab文字を半角スペースにする
set expandtab
" 行頭以外のTab文字の表示幅（スペースいくつ分）
set tabstop=2
" 行頭でのTab文字の表示幅
set shiftwidth=2
" 検索文字列が小文字の場合は大文字小文字を区別なく検索する
set ignorecase
" 検索文字列に大文字が含まれている場合は区別して検索する
set smartcase
" 検索文字列入力時に順次対象文字列にヒットさせる
set incsearch
" 検索時に最後まで行ったら最初に戻る
set wrapscan
" 検索語をハイライト表示
set hlsearch
" menuone=補完ウィンドウで対象が1件しかなくても常に補完ウィンドウを表示, noinsert=補完ウィンドウを表示時に挿入しないようにする
set completeopt=menuone,noinsert
" history の上限を増やす
set history=200
" 256色対応させる
set t_Co=256

" key map
" insert
" カッコ補完
inoremap {<enter> {}<left><cr><esc><s-o>
inoremap [<enter> []<left><cr><esc><s-o>
inoremap (<enter> ()<left><cr><esc><s-o>
" 補完時の動作を制御する
inoremap <expr><CR> pumvisible() ? "<C-y>" : "<CR>"
inoremap <expr><C-n> pumvisible() ? "<Down>" : "<C-n>"
inoremap <expr><C-p> pumvisible() ? "<Up>" : "<C-p>"
" visual
" visual mode で選択してからのインデント調整で選択範囲を解放しない
vnoremap > >gv
vnoremap < <gb
" normal
nnoremap <silent> <C-h> :bprev<CR>
nnoremap <silent> <C-l> :bnext<CR>
" plugins keymap
nnoremap <silent><C-e> :NERDTreeToggle<CR>
nnoremap <silent><Leader>n :NERDTreeFind<CR>
nnoremap <silent><Leader>g :GFiles<CR>
nnoremap <silent><Leader>h :History<CR>
nnoremap <silent><Leader>r :Rg<CR>
" command
" <C-p> と <C-n> でもコマンド履歴のフィルタリングができるようにする
cnoremap <C-p> <Up>
cnoremap <C-n> <Down>

" source settings
source ~/.vim/dein_vim.vim
source ~/.vim/coc.nvim.vim
