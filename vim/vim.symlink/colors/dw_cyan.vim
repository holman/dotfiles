"--------------------------------------------------------------------
" Name Of File: dw_cyan.vim.
" Description: Gvim colorscheme, designed against VIM 7.0 GUI
" By: Steve Cadwallader
" Contact: demwiz@gmail.com
" Credits: Inspiration from the brookstream and redblack schemes.
" Last Change: Saturday, September 17, 2006.
" Installation: Drop this file in your $VIMRUNTIME/colors/ directory.
"--------------------------------------------------------------------

set background=dark
hi clear
if exists("syntax_on")
    syntax reset
endif
let g:colors_name="dw_cyan"

"--------------------------------------------------------------------

hi Boolean                                       guifg=#00ffff
hi cDefine                                       guifg=#00ffff
hi cInclude                                      guifg=#ffffff
hi Comment                                       guifg=#696969
hi Constant                                      guifg=#00ffff
hi Cursor                         guibg=#444444  guifg=#ffffff
hi CursorColumn                   guibg=#001111
hi CursorLine                     guibg=#001818
hi DiffAdd                        guibg=#333333  guifg=#00ffff
hi DiffChange                     guibg=#333333  guifg=#00ffff
hi DiffDelete                     guibg=#333333  guifg=#00ffff
hi DiffText                       guibg=#333333  guifg=#ffffff
hi Directory                      guibg=#000000  guifg=#00ffff
hi ErrorMsg                       guibg=#ffffff  guifg=#000000
hi FoldColumn                     guibg=#222222  guifg=#ff0000
hi Folded                         guibg=#222222  guifg=#ff0000
hi Function                       guibg=#000000  guifg=#00ffff
hi Identifier                     guibg=#000000  guifg=#00cccc
hi IncSearch       gui=none       guibg=#00bbbb  guifg=#000000
hi LineNr                         guibg=#000000  guifg=#008888
hi MatchParen      gui=none       guibg=#222222  guifg=#00ffff
hi ModeMsg                        guibg=#000000  guifg=#00ffff
hi MoreMsg                        guibg=#000000  guifg=#00ffff
hi NonText                        guibg=#000000  guifg=#ffffff
hi Normal          gui=none       guibg=#000000  guifg=#c0c0c0
hi Operator        gui=none                      guifg=#696969
hi PreProc         gui=none                      guifg=#ffffff
hi Question                                      guifg=#00ffff
hi Search          gui=none       guibg=#00ffff  guifg=#000000
hi SignColumn                     guibg=#111111  guifg=#ffffff
hi Special         gui=none       guibg=#000000  guifg=#ffffff
hi SpecialKey                     guibg=#000000  guifg=#00ffff
hi Statement       gui=bold                      guifg=#00ffff
hi StatusLine      gui=none       guibg=#00ffff  guifg=#000000
hi StatusLineNC    gui=none       guibg=#444444  guifg=#000000
hi String          gui=none                      guifg=#00bbbb
hi TabLine         gui=none       guibg=#444444  guifg=#000000
hi TabLineFill     gui=underline  guibg=#000000  guifg=#ffffff
hi TabLineSel      gui=none       guibg=#00aaaa  guifg=#000000
hi Title           gui=none                      guifg=#00ffff
hi Todo            gui=none       guibg=#000000  guifg=#ff0000
hi Type            gui=none                      guifg=#ffffff
hi VertSplit       gui=none       guibg=#000000  guifg=#ffffff
hi Visual                         guibg=#00dddd  guifg=#000000
hi WarningMsg                     guibg=#888888  guifg=#000000

"- end of colorscheme -----------------------------------------------  
