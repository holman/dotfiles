:let g:test_success = 0

:function Check()
  :" Wait until the completion menu is visible.
  :let complete_visible = wait(10000, "complete_info()['pum_visible']")
  :echomsg "complete_visible: " . complete_visible
  :let last_complete_info = complete_info()
  :if len(last_complete_info['items']) > 0
    :let g:test_success = 1
  :endif
:endfunction

:au CompleteDonePre * call Check()

:e test12.py

:" Wait until the LSP server / client has established connection.
:let lsp_init =  wait(10000, 'luaeval("#vim.lsp.buf_get_clients()") != 0')
:echomsg "lsp_init: " . lsp_init

:" Broken up into two sequences so that clangd is 'ready' and we had time to
:" receive publishDiagnostics.
:" This is hackish but it avoids a 'sleep' with an arbitrary number.
:" Get completion for 'import' keyword
:call feedkeys("iimp", 'tx')
:call feedkeys("i\<c-x>\<c-o>", 'tx')

:if g:test_success == 1
  :quit!
:elseif g:test_success == 0
  :messages
  :cquit!
:endif
