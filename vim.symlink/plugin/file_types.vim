" Custom filetypes
au BufRead,BufNewFile *.rabl setf ruby
au BufRead,BufNewFile Vagrantfile setf ruby
au BufRead,BufNewFile .metrics setf ruby
au BufRead,BufNewFile .simplecov setf ruby
au BufRead,BufNewFile Guardfile setf ruby
" Enable settings for specific filetypes
autocmd BufRead,BufNewFile *.md setlocal spell
autocmd BufRead,BufNewFile *.txt setlocal spell
