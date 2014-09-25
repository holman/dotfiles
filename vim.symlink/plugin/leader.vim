" Note leader s is not taken by split
"map <Leader>r :call RunCurrentSpecFile()<CR>
"map <Leader>s :call RunNearestSpec()<CR>
"map <Leader>a :call RunLastSpec()<CR>

" set a map leader that and a save shortcut
" Leader is already \
let mapleader = ','
" Don't do below, it messes up window swap!
" nmap <leader>w :w<cr>

" Ruby 1.8 to 1.9 hash conversion
nmap <leader>h :s/\:\([a-zA-Z_]*\)\s*=>/\1\: /g<cr>
vmap <Leader>h :s/\:\([a-zA-Z_]*\)\s*=>/\1\: /g<cr>

map <leader><space> :noh<cr>
map <leader>a :Ack 
map <leader>e :Explore<cr> 


" Toggle spell checking
map <leader>ss :setlocal spell!<cr>

" Spelling shortcuts
map <leader>sn ]s
map <leader>sp [s
map <leader>sa zg
map <leader>s? z=

map <leader>v :vs<cr>
map <leader>s :sp<cr>
