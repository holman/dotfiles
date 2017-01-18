" Vim color file
" Maintainer: Ruda Moura <ruda@rudix.org>
" Last Change: Sun Feb 24 18:50:47 BRT 2008

highlight clear Normal
set background&

highlight clear

if exists("syntax_on")
  syntax reset
endif

let colors_name = "satori"

" Vim colors
highlight Normal     ctermfg=NONE    cterm=NONE
highlight Comment    ctermfg=Cyan    cterm=NONE
highlight Constant   ctermfg=Red     cterm=NONE
highlight Number     ctermfg=Red     cterm=NONE
highlight Identifier ctermfg=NONE    cterm=NONE
highlight Statement  ctermfg=NONE    cterm=Bold
highlight PreProc    ctermfg=Blue    cterm=NONE
highlight Type       ctermfg=Magenta cterm=NONE
highlight Special    ctermfg=Magenta cterm=NONE

" Vim monochrome
highlight Normal     term=NONE
highlight Comment    term=NONE
highlight Constant   term=Underline
highlight Number     term=Underline
highlight Identifier term=NONE
highlight Statement  term=Bold
highlight PreProc    term=NONE
highlight Type       term=Bold
highlight Special    term=NONE

" GVim colors
highlight Normal     guifg=NONE     gui=NONE
highlight Comment    guifg=DarkCyan gui=NONE
highlight Constant   guifg=Red      gui=NONE
highlight Number     guifg=Red      gui=Bold
highlight Identifier guifg=NONE     gui=NONE
highlight Statement  guifg=NONE     gui=Bold
highlight PreProc    guifg=Blue     gui=NONE
highlight Type       guifg=Magenta  gui=NONE
highlight Special    guifg=Red      gui=Bold
