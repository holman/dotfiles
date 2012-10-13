" Language:    CoffeeScript
" Maintainer:  Mick Koch <kchmck@gmail.com>
" URL:         http://github.com/kchmck/vim-coffee-script
" License:     WTFPL

if exists('current_compiler')
  finish
endif

let current_compiler = 'coffee'
" Pattern to check if coffee is the compiler
let s:pat = '^' . current_compiler

" Extra options passed to CoffeeMake
if !exists("coffee_make_options")
  let coffee_make_options = ""
endif

" Get a `makeprg` for the current filename. This is needed to support filenames
" with spaces and quotes, but also not break generic `make`.
function! s:GetMakePrg()
  return 'coffee -c ' . g:coffee_make_options . ' $* ' . fnameescape(expand('%'))
endfunction

" Set `makeprg` and return 1 if coffee is still the compiler, else return 0.
function! s:SetMakePrg()
  if &l:makeprg =~ s:pat
    let &l:makeprg = s:GetMakePrg()
  elseif &g:makeprg =~ s:pat
    let &g:makeprg = s:GetMakePrg()
  else
    return 0
  endif

  return 1
endfunction

" Set a dummy compiler so we can check whether to set locally or globally.
CompilerSet makeprg=coffee
call s:SetMakePrg()

CompilerSet errorformat=Error:\ In\ %f\\,\ %m\ on\ line\ %l,
                       \Error:\ In\ %f\\,\ Parse\ error\ on\ line\ %l:\ %m,
                       \SyntaxError:\ In\ %f\\,\ %m,
                       \%-G%.%#

" Compile the current file.
command! -bang -bar -nargs=* CoffeeMake make<bang> <args>

" Set `makeprg` on rename since we embed the filename in the setting.
augroup CoffeeUpdateMakePrg
  autocmd!

  " Update `makeprg` if coffee is still the compiler, else stop running this
  " function.
  function! s:UpdateMakePrg()
    if !s:SetMakePrg()
      autocmd! CoffeeUpdateMakePrg
    endif
  endfunction

  " Set autocmd locally if compiler was set locally.
  if &l:makeprg =~ s:pat
    autocmd BufFilePost,BufWritePost <buffer> call s:UpdateMakePrg()
  else
    autocmd BufFilePost,BufWritePost          call s:UpdateMakePrg()
  endif
augroup END
