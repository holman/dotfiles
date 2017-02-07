function! profile#sort()
  let timings = []
  g/^SCRIPT/call add(
        \   timings,
        \   [
        \    getline('.')[len('SCRIPT  '):],
        \    matchstr(getline(line('.')+1),
        \    '^Sourced \zs\d\+')
        \   ] + map(getline(line('.')+2, line('.')+3), 'matchstr(v:val, ''\d\+\.\d\+$'')')
        \ )
  enew
  setl ft=vim
  call setline('.',
        \      ['count total (s)   self (s)  script']+map(copy(timings), 'printf("%5u %9s   %8s  %s", v:val[1], v:val[2], v:val[3], v:val[0])'))
  2,$sort! /\d\s\+\zs\d\.\d\{6}/ r
endfunction

function! profile#stop()
  profdel func *
  profdel file *
  qa!
endfunction

function! profile#start()
  profile start vim.profile
  profile func *
  profile file *
endfunction
