" install dir {
  let s:dein_dir = expand('~/.cache/dein')
  let s:dein_repo_dir = s:dein_dir . '/repos/github.com/Shougo/dein.vim'
" }

" dein installation check {
  if &runtimepath !~# '/dein.vim'
    if !isdirectory(s:dein_repo_dir)
      execute '!git clone https://github.com/Shougo/dein.vim' s:dein_repo_dir
    endif
    execute 'set runtimepath^=' . s:dein_repo_dir
  endif
" }

" begin settings {
  if dein#load_state(s:dein_dir)
    call dein#begin(s:dein_dir)

    " .toml file
    let s:rc_dir = expand('~/.vim')
    if !isdirectory(s:rc_dir)
      call mkdir(s:rc_dir, 'p')
    endif
    let s:toml = s:rc_dir . '/dein.toml'

    " read toml and cache
    call dein#load_toml(s:toml, {'lazy': 0})

    " end settings
    call dein#end()
    call dein#save_state()
  endif
" }

" plugin installation check {
  if dein#check_install()
    call dein#install()
  endif
" }

" plugin remove check {
  let s:removed_plugins = dein#check_clean()
  if len(s:removed_plugins) > 0
    call map(s:removed_plugins, "delete(v:val, 'rf')")
    call dein#recache_runtimepath()
  endif
" }

" dein Scripts----------------------------- {
  if &compatible
    set nocompatible " Be iMproved
  endif

  " Required:
  set runtimepath+=$HOME/.cache/dein/repos/github.com/Shougo/dein.vim

  " Required:
  call dein#begin('$HOME/.cache/dein')

  " Let dein manage dein
  " Required:
  call dein#add('$HOME/.cache/dein/repos/github.com/Shougo/dein.vim')

  " Required:
  call dein#end()

  " Required:
  filetype plugin indent on
  syntax enable

  if dein#check_install()
    call dein#install()
  endif

" }

