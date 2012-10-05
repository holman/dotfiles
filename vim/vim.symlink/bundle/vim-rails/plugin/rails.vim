" rails.vim - Detect a rails application
" Author:       Tim Pope <http://tpo.pe/>
" GetLatestVimScripts: 1567 1 :AutoInstall: rails.vim

" Install this file as plugin/rails.vim.  See doc/rails.txt for details. (Grab
" it from the URL above if you don't have it.)  To access it from Vim, see
" :help add-local-help (hint: :helptags ~/.vim/doc) Afterwards, you should be
" able to do :help rails

if exists('g:loaded_rails') || &cp || v:version < 700
  finish
endif
let g:loaded_rails = 1

" Utility Functions {{{1

function! s:error(str)
  echohl ErrorMsg
  echomsg a:str
  echohl None
  let v:errmsg = a:str
endfunction

function! s:autoload(...)
  if !exists("g:autoloaded_rails") && v:version >= 700
    runtime! autoload/rails.vim
  endif
  if exists("g:autoloaded_rails")
    if a:0
      exe a:1
    endif
    return 1
  endif
  if !exists("g:rails_no_autoload_warning")
    let g:rails_no_autoload_warning = 1
    if v:version >= 700
      call s:error("Disabling rails.vim: autoload/rails.vim is missing")
    else
      call s:error("Disabling rails.vim: Vim version 7 or higher required")
    endif
  endif
  return ""
endfunction

" }}}1
" Configuration {{{

function! s:SetOptDefault(opt,val)
  if !exists("g:".a:opt)
    let g:{a:opt} = a:val
  endif
endfunction

call s:SetOptDefault("rails_syntax",1)
call s:SetOptDefault("rails_mappings",1)
call s:SetOptDefault("rails_abbreviations",1)
call s:SetOptDefault("rails_ctags_arguments","--languages=-javascript")
call s:SetOptDefault("rails_default_file","README")
call s:SetOptDefault("rails_root_url",'http://localhost:3000/')
call s:SetOptDefault("rails_modelines",0)
call s:SetOptDefault("rails_gnu_screen",1)
call s:SetOptDefault("rails_generators","controller\ngenerator\nhelper\nintegration_test\nmailer\nmetal\nmigration\nmodel\nobserver\nperformance_test\nplugin\nresource\nscaffold\nscaffold_controller\nsession_migration\nstylesheets")
if exists("g:loaded_dbext") && executable("sqlite3") && ! executable("sqlite")
  " Since dbext can't find it by itself
  call s:SetOptDefault("dbext_default_SQLITE_bin","sqlite3")
endif

" }}}1
" Detection {{{1

function! s:escvar(r)
  let r = fnamemodify(a:r,':~')
  let r = substitute(r,'\W','\="_".char2nr(submatch(0))."_"','g')
  let r = substitute(r,'^\d','_&','')
  return r
endfunction

function! s:Detect(filename)
  if exists('b:rails_root')
    return s:BufInit(b:rails_root)
  endif
  let fn = substitute(fnamemodify(a:filename,":p"),'\c^file://','','')
  let sep = matchstr(fn,'^[^\\/]\{3,\}\zs[\\/]')
  if sep != ""
    let fn = getcwd().sep.fn
  endif
  if fn =~ '[\/]config[\/]environment\.rb$'
    return s:BufInit(strpart(fn,0,strlen(fn)-22))
  endif
  if isdirectory(fn)
    let fn = fnamemodify(fn,':s?[\/]$??')
  else
    let fn = fnamemodify(fn,':s?\(.*\)[\/][^\/]*$?\1?')
  endif
  let ofn = ""
  let nfn = fn
  while nfn != ofn && nfn != ""
    if exists("s:_".s:escvar(nfn))
      return s:BufInit(nfn)
    endif
    let ofn = nfn
    let nfn = fnamemodify(nfn,':h')
  endwhile
  let ofn = ""
  while fn != ofn
    if filereadable(fn . "/config/environment.rb")
      return s:BufInit(fn)
    endif
    let ofn = fn
    let fn = fnamemodify(ofn,':s?\(.*\)[\/]\(app\|config\|db\|doc\|extras\|features\|lib\|log\|public\|script\|spec\|stories\|test\|tmp\|vendor\)\($\|[\/].*$\)?\1?')
  endwhile
  return 0
endfunction

function! s:BufInit(path)
  let s:_{s:escvar(a:path)} = 1
  if s:autoload()
    return RailsBufInit(a:path)
  endif
endfunction

" }}}1
" Initialization {{{1

augroup railsPluginDetect
  autocmd!
  autocmd BufNewFile,BufRead * call s:Detect(expand("<afile>:p"))
  autocmd VimEnter * if expand("<amatch>") == "" && !exists("b:rails_root") | call s:Detect(getcwd()) | endif | if exists("b:rails_root") | silent doau User BufEnterRails | endif
  autocmd FileType netrw if !exists("b:rails_root") | call s:Detect(expand("%:p")) | endif | if exists("b:rails_root") | silent doau User BufEnterRails | endif
  autocmd BufEnter * if exists("b:rails_root")|silent doau User BufEnterRails|endif
  autocmd BufLeave * if exists("b:rails_root")|silent doau User BufLeaveRails|endif
  autocmd Syntax railslog if s:autoload()|call rails#log_syntax()|endif
augroup END

command! -bar -bang -nargs=* -complete=dir Rails :if s:autoload()|call rails#new_app_command(<bang>0,<f-args>)|endif

" }}}1
" abolish.vim support {{{1

function! s:function(name)
    return function(substitute(a:name,'^s:',matchstr(expand('<sfile>'), '<SNR>\d\+_'),''))
endfunction

augroup railsPluginAbolish
  autocmd!
  autocmd VimEnter * call s:abolish_setup()
augroup END

function! s:abolish_setup()
  if exists('g:Abolish') && has_key(g:Abolish,'Coercions')
    if !has_key(g:Abolish.Coercions,'l')
      let g:Abolish.Coercions.l = s:function('s:abolish_l')
    endif
    if !has_key(g:Abolish.Coercions,'t')
      let g:Abolish.Coercions.t = s:function('s:abolish_t')
    endif
  endif
endfunction

function! s:abolish_l(word)
  let singular = rails#singularize(a:word)
  return a:word ==? singular ? rails#pluralize(a:word) : singular
endfunction

function! s:abolish_t(word)
  if a:word =~# '\u'
    return rails#pluralize(rails#underscore(a:word))
  else
    return rails#singularize(rails#camelize(a:word))
  endif
endfunction

" }}}1
" vim:set sw=2 sts=2:
