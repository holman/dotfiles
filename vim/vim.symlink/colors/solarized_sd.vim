" Name:     Solarized Simplified Dark vim colorscheme
" Author:   Ethan Schoonover <es@ethanschoonover.com>
"           Kyo Nagashima <kyo@hail2u.net>
" License:  OSI approved MIT license (see end of this file)

set background=dark
hi clear

if exists("syntax_on")
  syntax reset
endif

let colors_name = "solarized_sd"

hi Normal guifg=#839496 guibg=#002b36 gui=NONE
hi Comment guifg=#586e75 guibg=NONE gui=NONE,italic
hi Constant guifg=#2aa198 guibg=NONE gui=NONE
hi Identifier guifg=#268bd2 guibg=NONE gui=NONE
hi Statement guifg=#859900 guibg=NONE gui=NONE
hi PreProc guifg=#cb4b16 guibg=NONE gui=NONE
hi Type guifg=#b58900 guibg=NONE gui=NONE
hi Special guifg=#dc322f guibg=NONE gui=NONE
hi Underlined guifg=#6c71c4 guibg=NONE gui=NONE
hi Ignore guifg=NONE guibg=NONE gui=NONE
hi Error guifg=#dc322f guibg=NONE gui=NONE,bold
hi Todo guifg=#d33682 guibg=NONE gui=NONE,bold
hi SpecialKey guifg=#073642 guibg=NONE gui=NONE
hi NonText guifg=#073642 guibg=NONE gui=NONE,bold
hi Directory guifg=#268bd2 guibg=NONE gui=NONE
hi ErrorMsg guifg=#dc322f guibg=NONE gui=NONE,reverse
hi IncSearch guifg=#b58900 guibg=NONE gui=NONE,reverse
hi Search guifg=#b58900 guibg=NONE gui=NONE,standout
hi MoreMsg guifg=#268bd2 guibg=NONE gui=NONE
hi ModeMsg guifg=#268bd2 guibg=NONE gui=NONE
hi LineNr guifg=#586e75 guibg=#073642 gui=NONE
hi Question guifg=#2aa198 guibg=NONE gui=NONE,bold
hi StatusLine guifg=#839496 guibg=#073642 gui=NONE
hi StatusLineNC guifg=#93a1a1 guibg=#073642 gui=NONE
hi VertSplit guifg=#839496 guibg=#073642 gui=NONE
hi Title guifg=#cb4b16 guibg=NONE gui=NONE,bold
hi Visual guifg=NONE guibg=#073642 gui=NONE,standout
hi VisualNOS guifg=NONE guibg=#073642 gui=NONE,standout
hi WarningMsg guifg=#dc322f guibg=NONE gui=NONE,bold
hi WildMenu guifg=#93a1a1 guibg=#073642 gui=NONE
hi Folded guifg=#839496 guibg=#073642 gui=NONE,underline guisp=#002b36
hi FoldColumn guifg=#839496 guibg=#073642 gui=NONE,bold
hi DiffAdd guifg=#859900 guibg=NONE gui=NONE,reverse
hi DiffChange guifg=#b58900 guibg=NONE gui=NONE,reverse
hi DiffDelete guifg=#dc322f guibg=NONE gui=NONE,reverse
hi DiffText guifg=#268bd2 guibg=NONE gui=NONE,reverse
hi SignColumn guifg=#839496 guibg=#073642 gui=NONE
hi Conceal guifg=#268bd2 guibg=NONE gui=NONE
hi SpellBad guifg=NONE guibg=NONE gui=NONE,undercurl guisp=#dc322f
hi SpellCap guifg=NONE guibg=NONE gui=NONE,undercurl guisp=#6c71c4
hi SpellRare guifg=NONE guibg=NONE gui=NONE,undercurl guisp=#2aa198
hi SpellLocal guifg=NONE guibg=NONE gui=NONE,undercurl guisp=#b58900
hi Pmenu guifg=#839496 guibg=#073642 gui=NONE
hi PmenuSel guifg=#eee8d5 guibg=#586e75 gui=NONE
hi PmenuSbar guifg=#839496 guibg=#eee8d5 gui=NONE
hi PmenuThumb guifg=#002b36 guibg=#839496 gui=NONE
hi TabLine guifg=#839496 guibg=#073642 gui=NONE,underline guisp=#839496
hi TabLineSel guifg=#eee8d5 guibg=#586e75 gui=NONE,underline guisp=#839496
hi TabLineFill guifg=#839496 guibg=#073642 gui=NONE,underline guisp=#839496
hi CursorColumn guifg=NONE guibg=#073642 gui=NONE
hi CursorLine guifg=NONE guibg=#073642 gui=NONE guisp=#93a1a1
hi ColorColumn guifg=NONE guibg=#073642 gui=NONE
hi Cursor guifg=NONE guibg=NONE gui=NONE,reverse
hi lCursor guifg=NONE guibg=NONE gui=NONE,standout
hi MatchParen guifg=#dc322f guibg=#586e75 gui=NONE,bold

" License "{{{
" ---------------------------------------------------------------------
"
" Copyright (c) 2011 Ethan Schoonover, Kyo Nagashima
"
" Permission is hereby granted, free of charge, to any person obtaining a copy
" of this software and associated documentation files (the "Software"), to deal
" in the Software without restriction, including without limitation the rights
" to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
" copies of the Software, and to permit persons to whom the Software is
" furnished to do so, subject to the following conditions:
"
" The above copyright notice and this permission notice shall be included in
" all copies or substantial portions of the Software.
"
" THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
" IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
" FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
" AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
" LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
" OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
" THE SOFTWARE.
"
"}}}
