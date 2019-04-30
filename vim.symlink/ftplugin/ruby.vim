autocmd FileType ruby autocmd BufWritePre * %s/\s\+$//e
autocmd FileType ruby autocmd BufWritePre * %s/\n\n\+$//e

setlocal shiftwidth=2 expandtab
setlocal smartindent
setlocal tabstop=2
setlocal re=1 foldmethod=indent
