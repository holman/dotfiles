function s:CheckColorScheme()
   if !has('termguicolors')
    let g:base16colorspace=256
   endif
  "  let &t_8f = "\<Esc>[38;2;%lu;%lu;%lum"
  "  let &t_8b = "\<Esc>[48;2;%lu;%lu;%lum"

  let s:config_file = expand('~/.vim/.base16')

  if filereadable(s:config_file)
    let s:config = readfile(s:config_file, '', 2)

    if s:config[1] =~# '^dark\|light$'
      execute 'set background=' . s:config[1]
    else
      echoerr 'Bad background ' . s:config[1] . ' in ' . s:config_file
    endif

    if filereadable(expand('~/.vim/plugged/base16-vim/colors/base16-' . s:config[0] . '.vim'))
      execute 'color base16-' . s:config[0]
    else
      echoerr 'Bad scheme ' . s:config[0] . ' in ' . s:config_file
    endif
  else " default
    set background=dark
    color base16-ocean
  endif

  execute 'highlight Statement ' . pinnacle#embolden('Statement')
  execute 'highlight link EndOfBuffer ColorColumn'

  " Allow for overrides:
  " - `statusline.vim` will re-set User1, User2 etc.
  " - `after/plugin/loupe.vim` will override Search.
  doautocmd ColorScheme
  call s:SwitchIfOceanicnext()
endfunction

function s:SwitchIfOceanicnext()
  let s:config_file = expand('~/.vim/.base16')

  if filereadable(s:config_file)
    let s:config = readfile(s:config_file, '', 2)
    if s:config[0] == "oceanicnext"
      execute 'AirlineTheme oceanicnext'
    endif
  endif
endfunction

if v:progname !=# 'vi'
  if has('autocmd')
    augroup CBourguibaAutocolor
      autocmd!
      autocmd FocusGained * :call s:CheckColorScheme()
      if has('gui_running')
        " For MacVim because it doesn't want to set oceanicnext at vim startup.
        autocmd VimEnter * call s:SwitchIfOceanicnext()
      endif
    augroup END
  endif
  call s:CheckColorScheme()
endif
