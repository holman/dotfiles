" Vim color file
" Maintainer: Niklas Lindström <nlm@valtech.se>
" Last Change: 2002-03-22
" Version: 0.3
" URI: http://localhost/


""" Init
set background=dark
highlight clear
if exists("syntax_on")
    syntax reset
endif
let g:colors_name = "nightshimmer"


""""""""\ Colors \""""""""


"""" GUI Colors

highlight Cursor        gui=None guibg=Green guifg=White
highlight CursorIM gui=bold guifg=white guibg=Green1
highlight Directory     guifg=LightSeaGreen guibg=bg
highlight DiffAdd gui=None guifg=fg guibg=DarkCyan
highlight DiffChange gui=None guifg=fg guibg=Green4
highlight DiffDelete gui=None guifg=fg guibg=black
highlight DiffText gui=bold guifg=fg guibg=bg
highlight ErrorMsg      guifg=LightYellow  guibg=FireBrick
" previously 'FillColumn':
"highlight FillColumn    gui=NONE guifg=black guibg=grey60
highlight VertSplit    gui=NONE guifg=black guibg=grey60
highlight Folded        gui=bold guibg=#305060 guifg=#b0d0e0
highlight FoldColumn        gui=bold guibg=#305060 guifg=#b0d0e0
highlight IncSearch gui=reverse guifg=fg guibg=bg
highlight LineNr        gui=bold guibg=grey6 guifg=Purple3
highlight ModeMsg       guibg=DarkGreen guifg=LightGreen
highlight MoreMsg       gui=bold  guifg=SeaGreen4 guibg=bg
if version < 600
    " same as SpecialKey
    highlight NonText       guibg=#123A4A guifg=#3D5D6D
else
    " Bottom fill (use e.g. same as LineNr)
    highlight NonText       gui=None guibg=grey6 guifg=Purple
endif
highlight Normal        gui=None guibg=#103040 guifg=honeydew2
highlight Question      gui=bold  guifg=SeaGreen2 guibg=bg
highlight Search        gui=NONE guibg=Purple4 guifg=NONE
highlight SpecialKey    guibg=#123A4A guifg=#426272
highlight StatusLine    gui=bold guibg=grey88 guifg=black
highlight StatusLineNC  gui=NONE guibg=grey60 guifg=grey10
highlight Title         gui=bold  guifg=MediumOrchid1 guibg=bg
highlight Visual        gui=reverse guibg=WHITE guifg=SeaGreen
highlight VisualNOS     gui=bold,underline guifg=fg guibg=bg
highlight WarningMsg    gui=bold guifg=FireBrick1 guibg=bg
highlight WildMenu      gui=bold guibg=Chartreuse guifg=Black


"""" Syntax Colors

highlight Comment       gui=reverse guifg=#507080
"highlight Comment       gui=None guifg=#507080

highlight Constant      guifg=Cyan guibg=bg
    "hi String gui=None guifg=Cyan guibg=bg
    "hi Character gui=None guifg=Cyan guibg=bg
    highlight Number gui=None guifg=Cyan guibg=bg
    highlight Boolean gui=bold guifg=Cyan guibg=bg
    "hi Float gui=None guifg=Cyan guibg=bg

highlight Identifier    guifg=orchid1
    "hi Function gui=None guifg=orchid1 guibg=bg

highlight Statement     gui=NONE guifg=LightGreen
    highlight Conditional gui=None guifg=LightGreen guibg=bg
    highlight Repeat gui=None guifg=SeaGreen2 guibg=bg
    "hi Label gui=None guifg=LightGreen guibg=bg
    highlight Operator gui=None guifg=Chartreuse guibg=bg
    highlight Keyword gui=bold guifg=LightGreen guibg=bg
    highlight Exception gui=bold guifg=LightGreen guibg=bg

highlight PreProc       guifg=MediumPurple1
    "hi Include gui=None guifg=MediumPurple1 guibg=bg
    "hi Define gui=None guifg=MediumPurple1g guibg=bg
    "hi Macro gui=None guifg=MediumPurple1g guibg=bg
    "hi PreCondit gui=None guifg=MediumPurple1g guibg=bg

highlight Type          gui=NONE guifg=LightBlue
    "hi StorageClass gui=None guifg=LightBlue guibg=bg
    "hi Structure gui=None guifg=LightBlue guibg=bg
    "hi Typedef gui=None guifg=LightBlue guibg=bg

highlight Special       gui=bold guifg=White
    "hi SpecialChar gui=bold guifg=White guibg=bg
    "hi Tag gui=bold guifg=White guibg=bg
    "hi Delimiter gui=bold guifg=White guibg=bg
    "hi SpecialComment gui=bold guifg=White guibg=bg
    "hi Debug gui=bold guifg=White guibg=bg

highlight Underlined gui=underline guifg=honeydew4 guibg=bg

highlight Ignore    guifg=#204050

highlight Error      guifg=LightYellow  guibg=FireBrick

highlight Todo          guifg=Cyan guibg=#507080

""" OLD COLORS



