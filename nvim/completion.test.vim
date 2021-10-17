:e test12.cpp

:" Wait until the LSP server / client has established connection.
:let lsp_init =  wait(10000, 'luaeval("#vim.lsp.buf_get_clients()") != 0')
:echomsg "lsp_init: " . lsp_init

:" Tab complete 'inline' and select it

:" The timer_start + feedkeys with '!' to stay in insert mode was copied from YCM integration test suite
:function EscapeIt(id)
:  redraw
:  call feedkeys("\<esc>")
:  let inline_keyword_found = search('inline')
:  if inline_keyword_found != 0
:    quit!
:  else
:    cquit!
:  endif
:endfunction

:function SelectIt(id)
:  redraw
:  call wait(10000, 'luaeval("require\"cmp\".visible()")')
:  call timer_start(500, funcref("EscapeIt"))
:  call feedkeys("\<tab>")
:endfunction

:call timer_start(500, funcref("SelectIt"))
:call feedkeys("iin", 'tx!')
