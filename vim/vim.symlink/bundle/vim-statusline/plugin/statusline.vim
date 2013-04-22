if has("statusline") && !&cp
  set laststatus=2                    " Always show the status bar

  set statusline=%f\ %m\ %r           " File name/path, modified, read-only
  set statusline+=%=                  " Separate Left/Right
  set statusline+=%#todo#             " Switch to todo highlight
  set statusline+=Ln:\ %l/%L\ [%p%%]  " Current line/total lines, progress
  set statusline+=\ Col:\ %v          " Current column
endif
