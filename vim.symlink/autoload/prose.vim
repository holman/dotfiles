function! prose#Focus() abort
  Goyo
  Limelight
  if has('gui_running')
    set fullscreen
    set background=light
    set linespace=7
  endif
  call system("tmux set -g status off")
  call system('osascript -e "tell application \"iTerm\" to set the transparency of the current session of the current terminal to 0"')
  if s:MoreThanOneTmuxPane() && !s:TmuxPaneIsZoomed()
   call system("tmux resize-pane -Z")
  endif
  wincmd =
endfunction


function! prose#Unfocus() abort
  Goyo!
  Limelight!
  if has('gui_running')
    set nofullscreen
    set background=dark
    set linespace=0
  endif
  call system("tmux set -g status on")
  call system('osascript -e "tell application \"iTerm\" to set the transparency of the current session of the current terminal to 0.17"')
  if s:TmuxPaneIsZoomed()
    call system("tmux resize-pane -Z")
  endif
endfunction

" From writing your first plugin talk, by Chris Toomey
function! prose#MoveEm(position) abort
  let saved_cursor = getpos(".")
  let previous_blank_line = search('^$', 'bn')
  let target_line = previous_blank_line + a:position - 1
  execute "move " . target_line
  call setpos('.', saved_cursor)
endfunction

function! prose#WrapCurrentWord(format) abort
 normal! gv
 if a:format == 'bold'
   let wrapping = '**'
 else
   let wrapping = '_'
 endif

 execute 'normal! "ac' . wrapping . 'a' . wrapping
endfunction

function! prose#FixLastSpellingError() abort
  let position = getpos('.')[1:3]
  let current_line_length = len(getline('.'))
  normal! [s1z=
  let new_line_length = len(getline('.'))
  let position[1] += (new_line_length - current_line_length)
  call cursor(position)
  silent! call repeat#set("\<Plug>FixLastSpellingError", 0)
endfunction

function! s:MoreThanOneTmuxPane()
  return system("tmux list-panes | wc -l | awk '{print $1}'") != "1"
endfunction

function! s:TmuxPaneIsZoomed()
  call system("tmux list-panes -F '#F' | grep -q Z")
  return !v:shell_error
endfunction
