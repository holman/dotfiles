" ------------------------------------------------------------------
" Filename:      synic.vim
" Last Modified: May, 14 2007 (10:47)
" Maintainer:    Adam Olsen (arolsen@gmail.com)
" Copyright:     2007 Adam Olsen
"                This script is free software; you can redistribute it and/or 
"                modify it under the terms of the GNU General Public License as 
"                published by the Free Software Foundation; either version 2 of 
"                the License, or (at your option) any later version. 
" Description:   Vim colorscheme file.
" Install:       Put this file in the users colors directory (~/.vim/colors)
"                then load it with :colorscheme synic
" ------------------------------------------------------------------
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""
""
""                        SPECIAL NOTE:
"" I believe this colorscheme is based off of Hans 
"" Fugal's colorscheme "desert".  
"" http://hans.fugal.net/vim/colors/desert.html
"" I might be wrong on this... if it looks like it was based off 
"" of your colorscheme, let me know so I can give you credits.
""
""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""


set background=dark
hi clear
if exists("syntax_on")
  syntax reset
endif

let g:colors_name = "synic"

hi Normal       guifg=ivory guibg=Black

hi TabLineFill  guifg=#272d2f guibg=#272d2f gui=None
hi TabLine  guifg=MistyRose3 guibg=#272d2f gui=None
hi TabLineSel   guifg=LightBlue3 guibg=#272d2f gui=None
hi ErrorMsg     gui=NONE guifg=Red guibg=Linen
hi IncSearch    gui=NONE guibg=LightGreen guifg=Black
hi ModeMsg      gui=NONE guifg=fg guibg=bg
hi StatusLine   gui=NONE guifg=LightBlue3 guibg=#272d2f
hi StatusLineNC gui=NONE guifg=MistyRose3 guibg=#272d2f
hi VertSplit    gui=NONE guifg=LightBlue4 guibg=Black
hi Visual       gui=reverse guifg=LightBlue4 guibg=Black
hi VisualNOS    gui=underline guifg=fg guibg=bg
hi DiffText     gui=NONE guifg=Yellow guibg=LightSkyBlue4
hi Cursor       guibg=Lavender guifg=Black
hi lCursor      guibg=Lavender guifg=Black
hi Directory    guifg=LightGreen guibg=bg
hi LineNr       guifg=LightBlue3 guibg=bg
hi MoreMsg      gui=NONE guifg=SeaGreen guibg=bg
hi NonText      gui=NONE guifg=Cyan4 guibg=Black
hi Question     gui=NONE guifg=LimeGreen guibg=bg
hi Search       gui=NONE guifg=SkyBlue4 guibg=Bisque
hi SpecialKey   guifg=Cyan guibg=bg
hi Title        gui=NONE guifg=Yellow2 guibg=bg
hi WarningMsg   guifg=Tomato3 guibg=Black
hi WildMenu     gui=NONE guifg=Black guibg=SkyBlue4
hi Folded       guifg=#f4aba2 guibg=bg
hi FoldColumn   guifg=DarkBlue guibg=Grey
hi DiffAdd      gui=NONE guifg=Blue guibg=LightCyan
hi DiffChange   gui=NONE guifg=white guibg=LightCyan4
hi DiffDelete   gui=None guifg=LightBlue guibg=LightCyan

hi Constant     gui=NONE guifg=MistyRose3 guibg=bg
hi String       gui=NONE guifg=LightBlue3 guibg=bg
hi Special      gui=NONE guifg=GoldenRod guibg=bg
hi Statement    gui=NONE guifg=khaki guibg=bg
hi Operator     gui=NONE guifg=#8673e8 guibg=bg
hi Ignore       gui=NONE guifg=bg guibg=bg
hi ToDo         gui=NONE guifg=DodgerBlue guibg=bg
hi Error        gui=NONE guifg=Red guibg=Linen
hi Comment      gui=NONE guifg=SlateGrey guibg=bg
hi Comment      gui=NONE guifg=#62c600 guibg=bg
hi Identifier   gui=bold guifg=LightBlue4 guibg=bg
hi PreProc      gui=NONE guifg=#ffa0a0 guibg=bg
hi Type         gui=NONE guifg=NavajoWhite guibg=bg
hi Underlined   gui=underline guifg=fg guibg=bg

" vim: sw=2
