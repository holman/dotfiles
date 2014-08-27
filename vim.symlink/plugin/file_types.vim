" Custom filetypes
au BufRead,BufNewFile *.rabl setf ruby
au BufRead,BufNewFile Vagrantfile setf ruby
au BufRead,BufNewFile .metrics setf ruby
au BufRead,BufNewFile .simplecov setf ruby
au BufRead,BufNewFile Guardfile setf ruby
" Rspec highlighting out of rails projects
autocmd BufRead *_spec.rb syn keyword rubyRspec describe context it specify it_should_behave_like before after setup subject its shared_examples_for shared_context let
highlight def link rubyRspec Function
