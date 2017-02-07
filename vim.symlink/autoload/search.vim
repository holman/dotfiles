# Search related functions

" quick searching of vimrc files
function! search#VimrcSearch() abort
  echohl String | let text = input("Text to search: ") | echohl None
  if text == '' | return | endif
  execute "Ag! ". text ." ~/.vim/rcfiles/* ~/.vim/rcplugins/*"
endfunction
