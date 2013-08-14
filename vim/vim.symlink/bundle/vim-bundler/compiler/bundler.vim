" Vim compiler file

if exists("current_compiler")
  finish
endif
let current_compiler = "bundler"

let s:cpo_save = &cpo
set cpo-=C

CompilerSet makeprg=bundle

CompilerSet errorformat=
      \%+E%f:%l:\ parse\ error,
      \%W%f:%l:\ warning:\ %m,
      \%E%f:%l:in\ %*[^:]:\ %m,
      \%E%f:%l:\ %m,
      \%-C%\tfrom\ %f:%l:in\ %.%#,
      \%-Z%\tfrom\ %f:%l,
      \%-Z%p^,
      \%-G%.%#

let &cpo = s:cpo_save
unlet s:cpo_save

" vim: sw=2:
