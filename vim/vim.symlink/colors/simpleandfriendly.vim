" Vim color file
" Maintainer:	Thomas Schmall www.oxpal.com
" Last Change:	Nov 2 2009 
" URL: http://www.vim.org/scripts/script.php?script_id=792
" Version: 1.4

" This color scheme uses a light grey background.

" Last Changes:
" *line number colors changed
" *current line highlighting


" First remove all existing highlighting.
set background=light
hi clear
if exists("syntax_on")
  syntax reset
endif

let g:colors_name = "simpleandfriendly"

"set the highlighting of the current line to true - then give it a color
"delete next line to turn off current line highlighting for this color scheme
set cul
hi cursorline gui=underline 
"guibg=grey91 
hi visual guibg=grey80 guifg=black


"Set nice colors #DC6210
"Cursor is Cyan when ":lmap" mappings are active
hi lCursor guibg=Cyan guifg=NONE
hi LineNr	 guifg=white  guibg=#acbbff

"Text below the last line is darker grey
hi NonText 	guibg=grey80
"Normal text is black background is grey
hi Normal 	guifg=black		guibg=grey89  ctermfg=Black  ctermbg=LightGrey 
hi Comment	guifg=Orange	guibg=grey94	ctermfg=DarkCyan	term=bold
"Constants are not underlined but have a slightly lighter background
hi Constant	guifg=#8080a0   guibg=grey92	gui=NONE  term=underline
hi String	  guifg=#80a0ff 	guibg=grey93	gui=NONE  term=underline	
hi Number	  guifg=#80a5ff 	guibg=grey91  gui=NONE  ctermfg=Gray  term=none
"Words like _if_ or _else_  (Grey27)
hi Statement	guifg=#4A2B99	gui=NONE  	ctermfg=Blue

hi Title    guifg=red		ctermfg=red gui=NONE term=BOLD
"color for _NONE_ for instance:
hi PreProc	term=underline	ctermfg=LightBlue	guifg=#DC6210
"color for _guifg_ for instance: (SlateBlue works here nice too)
hi Type	  	guifg=#008080 ctermfg=LightGreen gui=None term=underline	
hi Function	guifg=#61577A	term=bold 	
"in lingo the defined functions. (alt: SlateBlue)
hi Identifier	guifg=Seagreen
"hi Identifier	term=underline	cterm=bold ctermfg=Cyan	guifg=#40ffff

"hi Repeat	term=underline	ctermfg=White		guifg=white
"hi Ignore	guifg=bg	ctermfg=black
hi Error  	term=reverse  ctermbg=Red     ctermfg=White guibg=Red guifg=White
hi Todo	  	term=standout	ctermbg=Yellow  ctermfg=Black guifg=Blue guibg=Yellow
"Special Characters
hi Special 	guibg=grey90	guifg=Slateblue	gui=UNDERLINE

hi operator guifg=gray25  ctermfg=Black   term=bold   cterm=bold  gui=bold
