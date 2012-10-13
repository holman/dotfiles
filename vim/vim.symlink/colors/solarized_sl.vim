" Name:     Solarized Simplified light vim colorscheme
" Author:   Ethan Schoonover <es@ethanschoonover.com>
"           Kyo Nagashima <kyo@hail2u.net>
" License:  OSI approved MIT license (see end of this file)

set background=light
hi clear

if exists("syntax_on")
  syntax reset
endif

let colors_name = "solarized_sl"

hi Normal guifg=#657b83 guibg=#fdf6e3 gui=NONE
hi Comment guifg=#93a1a1 guibg=NONE gui=NONE,italic
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
hi SpecialKey guifg=#eee8d5 guibg=NONE gui=NONE
hi NonText guifg=#eee8d5 guibg=NONE gui=NONE,bold
hi Directory guifg=#268bd2 guibg=NONE gui=NONE
hi ErrorMsg guifg=#dc322f guibg=NONE gui=NONE,reverse
hi IncSearch guifg=#b58900 guibg=NONE gui=NONE,reverse
hi Search guifg=#b58900 guibg=NONE gui=NONE,standout
hi MoreMsg guifg=#268bd2 guibg=NONE gui=NONE
hi ModeMsg guifg=#268bd2 guibg=NONE gui=NONE
hi LineNr guifg=#93a1a1 guibg=#eee8d5 gui=NONE
hi Question guifg=#2aa198 guibg=NONE gui=NONE,bold
hi StatusLine guifg=#657b83 guibg=#eee8d5 gui=NONE
hi StatusLineNC guifg=#586e75 guibg=#eee8d5 gui=NONE
hi VertSplit guifg=#657b83 guibg=#eee8d5 gui=NONE
hi Title guifg=#cb4b16 guibg=NONE gui=NONE,bold
hi Visual guifg=NONE guibg=#eee8d5 gui=NONE,standout
hi VisualNOS guifg=NONE guibg=#eee8d5 gui=NONE,standout
hi WarningMsg guifg=#dc322f guibg=NONE gui=NONE,bold
hi WildMenu guifg=#586e75 guibg=#eee8d5 gui=NONE
hi Folded guifg=#657b83 guibg=#eee8d5 gui=NONE,underline guisp=#fdf6e3
hi FoldColumn guifg=#657b83 guibg=#eee8d5 gui=NONE,bold
hi DiffAdd guifg=#859900 guibg=NONE gui=NONE,reverse
hi DiffChange guifg=#b58900 guibg=NONE gui=NONE,reverse
hi DiffDelete guifg=#dc322f guibg=NONE gui=NONE,reverse
hi DiffText guifg=#268bd2 guibg=NONE gui=NONE,reverse
hi SignColumn guifg=#657b83 guibg=#eee8d5 gui=NONE
hi Conceal guifg=#268bd2 guibg=NONE gui=NONE
hi SpellBad guifg=NONE guibg=NONE gui=NONE,undercurl guisp=#dc322f
hi SpellCap guifg=NONE guibg=NONE gui=NONE,undercurl guisp=#6c71c4
hi SpellRare guifg=NONE guibg=NONE gui=NONE,undercurl guisp=#2aa198
hi SpellLocal guifg=NONE guibg=NONE gui=NONE,undercurl guisp=#b58900
hi Pmenu guifg=#657b83 guibg=#eee8d5 gui=NONE
hi PmenuSel guifg=#073642 guibg=#93a1a1 gui=NONE
hi PmenuSbar guifg=#657b83 guibg=#073642 gui=NONE
hi PmenuThumb guifg=#fdf6e3 guibg=#657b83 gui=NONE
hi TabLine guifg=#657b83 guibg=#eee8d5 gui=NONE,underline guisp=#657b83
hi TabLineSel guifg=#073642 guibg=#93a1a1 gui=NONE,underline guisp=#657b83
hi TabLineFill guifg=#657b83 guibg=#eee8d5 gui=NONE,underline guisp=#657b83
hi CursorColumn guifg=NONE guibg=#eee8d5 gui=NONE
hi CursorLine guifg=NONE guibg=#eee8d5 gui=NONE guisp=#586e75
hi ColorColumn guifg=NONE guibg=#eee8d5 gui=NONE
hi Cursor guifg=NONE guibg=NONE gui=NONE,reverse
hi lCursor guifg=NONE guibg=NONE gui=NONE,standout
hi MatchParen guifg=#dc322f guibg=#93a1a1 gui=NONE,bold

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
