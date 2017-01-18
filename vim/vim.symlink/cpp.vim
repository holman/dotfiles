

source $VIM/vim73/syntax/cpp.vim
set omnifunc=omni#cpp#complete#Main

set tags=D:/Code/tag_files/osg
"set tags+=D:/Code/tag_files/nspire
set tags+=D:/Code/tag_files/boost
set tags+=D:/Code/tag_files/stl
"set tags+=D:/Code/tag_files/TerrainConverter
set tags+=D:/Code/tag_files/switchblade

" configuration of omnicpp complete
autocmd CursorMovedI * if pumvisible() == 0|pclose|endif
autocmd InsertLeave * if pumvisible() == 0|pclose|endif
set completeopt=menu,menuone

let OmniCpp_MayCompleteDot = 1
let OmniCpp_MayCompleteArrow = 1 
let OmniCpp_MayCompleteScope = 1 
let OmniCpp_SelectFirstItem = 2 
let OmniCpp_NamespaceSearch = 0 
let OmniCpp_ShowPrototypeInAbbr = 1 
let OmniCpp_LocalSearchDecl = 1 

" Setup the tab key to do autocompletion
function! CompleteTab()
  let prec = strpart( getline('.'), 0, col('.')-1 )
  if prec =~ '^\s*$' || prec =~ '\s$'
    return "\<tab>"
  else
    return "\<c-x>\<c-o>"
  endif
endfunction

inoremap <tab> <c-r>=CompleteTab()<cr>
map <F12> :!build_tags.bat

set autoread  "files will autoupdate if changed (in visual studio)


" abbreviations
iab INC #include
iab rp ref_ptr<
iab orp osg::ref_ptr<
iab DBGFUN std::cout << __FUNCTION__ << std::endl;
iab SC std::cout <<
iab NL << "\n";


compiler devenv

" code folding
set foldminlines=4
set foldmarker={,}
set foldmethod=marker
set foldtext=v:folddashes.substitute(getline(v:foldstart+1),'/\\*\\\|\\*/\\\|{{{\\d\\=','','g')



