if has('python3')
  silent! python3 from powerline.vim import setup as powerline_setup
  silent! python3 powerline_setup()
  silent! python3 del powerline_setup
else
  silent! python from powerline.vim import setup as powerline_setup
  silent! python powerline_setup()
  silent! python del powerline_setup
end

