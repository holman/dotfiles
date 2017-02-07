setlocal spell        " Enable spell checking
setlocal nowrap       " Let long lines scroll off
setlocal linebreak    " Use word boundaries to break lines
setlocal textwidth=78
setlocal isk-=.       " sh.vim syntax file seems to be setting this...


" nnoremap <leader>bl :BoldListItems<cr>
nnoremap <buffer> <leader>ns ]s
" nnoremap <buffer> <leader>sp ea<C-x><C-s>
nnoremap <buffer> <leader>sf mm[s1z=`m
nnoremap <buffer> <LEADER>more i<!--more--><ESC>
nnoremap <buffer> <leader>gf gqip
" nnoremap <buffer> <leader>md :call OpenCurrentFileInMarked()<cr>

" Embolden the word under cursor
nnoremap <buffer> <leader>bld mm"bciw**b**<esc>`m2l

" Italicize the word under cursors
nnoremap <buffer> <leader>em mm"bciw*b*<esc>`m2l

" nnoremap <buffer> <cr> :MarkdownAwareGX<cr>
" nnoremap <buffer> <leader>dp :call system("open -a Deckset <C-r>%")<cr>

command! BlockQuotify execute "normal! {jvip\<C-v>I> \<ESC>gqip"
nnoremap <buffer> <leader>gq :BlockQuotify<cr>
vmap <leader>gq :g/\(^$\n\)\@<=.*/BlockQuotify<cr>

" Heading / underline funcitons
" nnoremap <buffer> <leader>u1 :MH1<cr>
" nnoremap <buffer> <leader>u2 :MH2<cr>
" nnoremap <buffer> <leader>u1 mmyypVr=`m<cr><esc>
" nnoremap <buffer> <leader>u2 mmyypVr-`m<cr><esc>
" nnoremap <buffer> <leader>u3 mm0i### <esc>`m4l
" nnoremap <buffer> <tab> :JumpToNextLink<cr>
" nnoremap <buffer> <S-tab> :JumpToNextLinkBackward<cr>

nnoremap <buffer> <leader>fw mm1z=`m    "This will correct the word under cursor
nnoremap <buffer> <leader>df :call system('open dict://'. expand('<cword>'))<cr>
