" Generic mechanism for scheduling a unit of deferable work.
function! defer#defer(evalable) abort
  if has('autocmd') && has('vim_starting')
    " Note that these commands are not defined in a group, so that we can call
    " this function multiple times. We rely on autocmds#idleboot to ensure that
    " this event is only fired once.
    execute 'autocmd User BourguibaDefer ' . a:evalable
  else
    execute a:evalable
  endif
endfunction
