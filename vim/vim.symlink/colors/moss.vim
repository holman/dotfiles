" ------------------------------------------------------------------
" Vim color file
" Name: moss (苔)
" Maintainer: Li Chunlin <yeiicn!gmail.com>
" Last Change: 2009-10-15
" Version: 2.0
" URL: http://vim.sourceforge.net/script.php?script_id=2779
" ------------------------------------------------------------------

" Init
" ------------------------------------------------------------------
set background=dark
highlight clear
if exists("syntax_on")
   syntax reset
endif
let g:colors_name = "moss"

" Highlighting groups for various occasions
" ------------------------------------------------------------------
hi SpecialKey   guifg=RosyBrown4
hi NonText      guifg=MidnightBlue guibg=#0C2628
hi Directory    gui=BOLD guifg=DarkOliveGreen3
hi ErrorMsg     guifg=LightGoldenRod guibg=Firebrick
hi IncSearch    gui=BOLD guifg=Firebrick1
hi Search       gui=REVERSE guifg=NONE guibg=NONE
hi MoreMsg      guifg=DarkCyan
hi ModeMsg      guifg=OliveDrab2
hi LineNr       guifg=DarkSeaGreen3 guibg=#0C2628
hi Question     guifg=Green
hi StatusLine   gui=BOLD guifg=LemonChiffon3 guibg=#334680
hi StatusLineNC gui=BOLD guifg=Honeydew4 guibg=Gray26
hi VertSplit    gui=BOLD guifg=Gray20 guibg=Gray26
hi Title        gui=BOLD guifg=RoyalBlue3
hi Visual       guifg=PowderBlue guibg=#22364C
hi VisualNOS    gui=BOLD,UNDERLINE guifg=SlateGray
hi WarningMsg   guifg=Gold
hi WildMenu     gui=BOLD guifg=Black guibg=Chartreuse3
hi Folded       guifg=PaleGreen3 guibg=DarkSlateGray
hi FoldColumn   gui=BOLD guifg=PaleGreen3 guibg=DarkSlateGray
hi DiffAdd      guifg=SandyBrown guibg=DarkOliveGreen
hi DiffChange   guibg=#3C444C
hi DiffDelete   guifg=Gray20 guibg=Black
hi DiffText     guifg=Chocolate guibg=#033B40

" new Vim 7.0 items
if v:version >= 700
   hi CursorColumn guibg=#063C36
   hi CursorLine   guibg=#063C36
   hi SignColumn   guifg=PaleGoldenrod guibg=Turquoise4
   hi TabLine      guifg=CornflowerBlue guibg=Gray26
   hi TabLineSel   guifg=RoyalBlue guibg=#082926
   hi TabLineFill  gui=UNDERLINE guifg=CornflowerBlue guibg=Gray20
   hi Pmenu        guifg=White guibg=MediumPurple4
   hi PmenuSel     guifg=Wheat guibg=#22364C
   hi PmenuSbar    guifg=Tan   guibg=SeaShell4
   hi PmenuThumb   guifg=IndianRed   guibg=SeaShell4
   hi MatchParen   gui=BOLD guifg=GoldenRod guibg=DarkCyan
endif

hi Cursor       guifg=Black guibg=LimeGreen
hi CursorIM     guifg=Black guibg=OrangeRed

" Syntax highlighting groups
" ------------------------------------------------------------------

hi Normal      gui=NONE guifg=LightBlue3 guibg=#082926
hi Comment     gui=ITALIC guifg=BurlyWood4

hi Constant    gui=NONE guifg=CadetBlue3
hi link        String    Constant
hi link        Character Constant
hi Number      gui=NONE guifg=Turquoise3
hi link        Boolean Number
hi link        Float   Number

hi Identifier  gui=NONE guifg=SteelBlue3
hi Function    gui=NONE guifg=Aquamarine3

hi Statement   gui=NONE guifg=SpringGreen3
hi link        Conditional Statement
hi link        Repeat      Statement
hi link        Label       Statement
hi Operator    gui=NONE guifg=SeaGreen3
hi link        Keyword     Statement
hi link        Exception   Statement

hi PreProc     gui=NONE guifg=DodgerBlue3
hi link        Include   PreProc
hi link        Define    PreProc
hi link        Macro     PreProc
hi link        PreCondit PreProc

hi Type        gui=NONE guifg=DeepSkyBlue3
hi link        StorageClass Type
hi link        Structure    Type
hi link        Typedef      Type

hi Special     gui=NONE guifg=SlateBlue
hi link        Specialchar Special
hi link        Tag         Special
hi link        Delimiter   Special
hi link        Debug       Special

hi Underlined  gui=UNDERLINE guifg=SkyBlue3
hi Ignore      gui=NONE guifg=Gray18
hi Error       gui=NONE guifg=Khaki3 guibg=VioletRed4
hi Todo        gui=BOLD guifg=GoldenRod3 guibg=NONE

