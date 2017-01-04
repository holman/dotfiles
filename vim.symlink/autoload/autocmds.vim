let g:BourguibaColorColumnBlacklist = ['diff', 'undotree', 'nerdtree', 'qf']

function! autocmds#should_colorcolumn() abort
  return index(g:BourguibaColorColumnBlacklist, &filetype) == -1
endfunction

function! autocmds#MarkMargin(on) abort
  " echoe "hello"
    if exists('b:MarkMargin')
        try
            call matchdelete(b:MarkMargin)
        catch /./
        endtry
        unlet b:MarkMargin
    endif
    if a:on
        let b:MarkMargin = matchadd('ColorColumn', '\%81v\s*\S', 100)
    endif
    " redraw!
endfunction

function! autocmds#idleboot() abort
  " Make sure we automatically call autocmds#idleboot() only once.
  augroup BourguibaIdleboot
    autocmd!
  augroup END

  " Make sure we run deferred tasks exactly once.
  doautocmd User BourguibaDefer
  autocmd! User BourguibaDefer
endfunction
