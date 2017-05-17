" Name:         sexy-railscasts.vim
" Maintainer:   David Kariuki <davidkariuki>
" Last Change:  02 Dec 2012
" License:      WTFPL <http://sam.zoy.org/wtfpl/>
" Version:      2.1
"
" This theme is a mash up of the sexy-railscasts theme and the
" railscasts 256 theme
" https://github.com/davidkariuki/sexy-railscasts-256-theme/blob/master/colors/sexy-railscasts-256.vim

set background=dark
hi clear
if exists("syntax_on")
    syntax reset
  endif

  let g:colors_name = "sexy-railscasts-256"

  hi link htmlTag                     xmlTag
  hi link htmlTagName                 xmlTagName
  hi link htmlEndTag                  xmlEndTag

  highlight Normal                    guifg=#E6E1DC guibg=#222222
  highlight Cursor                    guifg=#000000 ctermfg=0 guibg=#FFFFFF ctermbg=15  
  highlight CursorLine                guibg=#333435 ctermbg=237 cterm=NONE
  highlight CursorColumn              guibg=#333435 ctermbg=237 cterm=NONE
  highlight NonText                   ctermfg=235


  highlight Comment                   guifg=#BC9458 ctermfg=180 gui=italic
  highlight Constant                  guifg=#6D9CBE ctermfg=73
  highlight Define                    guifg=#CC7833 ctermfg=173
  highlight Error                     guifg=#FFC66D ctermfg=221 guibg=#990000 ctermbg=88
  highlight Function                  guifg=#FFC66D ctermfg=221 gui=NONE cterm=NONE
  highlight Identifier                guifg=#6D9CBE ctermfg=73 gui=NONE cterm=NONE
  highlight Include                   guifg=#CC7833 ctermfg=173 gui=NONE cterm=NONE
  highlight PreCondit                 guifg=#CC7833 ctermfg=173 gui=NONE cterm=NONE
  highlight Keyword                   guifg=#CC7833 ctermfg=173 cterm=NONE
  highlight LineNr                    guifg=#2B2B2B ctermfg=236 ctermbg=233 guibg=#C0C0FF
  highlight Number                    guifg=#A5C261 ctermfg=107
  highlight VertSplit                 guifg=#383838 guibg=#383838 ctermfg=236 ctermbg=236
  highlight Directory                 guifg=#A5C261 gui=NONE ctermfg=107
  highlight StatusLine                ctermfg=236

  highlight Pmenu                     guifg=#F6F3E8 guibg=#444444 ctermfg=230 ctermbg=234 gui=NONE
  highlight PmenuSel                  guifg=#000000 guibg=#A5C261 ctermfg=232 ctermbg=64 gui=NONE
  highlight PMenuSbar                 guibg=#5A647E ctermbg=64 gui=NONE
  highlight PMenuThumb                guibg=#AAAAAA ctermbg=240 gui=NONE

  highlight PreProc                   guifg=#E6E1DC ctermfg=103
  highlight Search                    guifg=NONE ctermfg=NONE guibg=#2b2b2b ctermbg=235 gui=italic cterm=underline
  highlight Statement                 guifg=#CC7833 ctermfg=173 gui=NONE cterm=NONE
  highlight String                    guifg=#A5C261 ctermfg=107
  highlight Title                     guifg=#FFFFFF ctermfg=15
  highlight Type                      guifg=#DA4939 ctermfg=167 gui=NONE cterm=NONE
  highlight Visual                    guibg=#5A647E ctermbg=60

  highlight DiffAdd                   guifg=#E6E1DC ctermfg=7 guibg=#519F50 ctermbg=71
  highlight DiffDelete                guifg=#E6E1DC ctermfg=7 guibg=#660000 ctermbg=52
  highlight Special                   guifg=#DA4939 ctermfg=167

  highlight pythonBuiltin             guifg=#6D9CBE ctermfg=73 gui=NONE cterm=NONE
  highlight rubyBlockParameter        guifg=#FFFFFF ctermfg=221
  highlight rubyClass                 guifg=#FFFFFF ctermfg=173
  highlight rubyConstant              guifg=#DA4939 ctermfg=167
  highlight rubyInstanceVariable      guifg=#D0D0FF ctermfg=189
  highlight rubyInterpolation         guifg=#519F50 ctermfg=107
  highlight rubyLocalVariableOrMethod guifg=#D0D0FF ctermfg=189
  highlight rubyPredefinedConstant    guifg=#DA4939 ctermfg=167
  highlight rubyPseudoVariable        guifg=#FFC66D ctermfg=221
  highlight rubyStringDelimiter       guifg=#A5C261 ctermfg=143

  highlight xmlTag                    guifg=#E8BF6A ctermfg=179
  highlight xmlTagName                guifg=#E8BF6A ctermfg=179
  highlight xmlEndTag                 guifg=#E8BF6A ctermfg=179

  highlight mailSubject               guifg=#A5C261 ctermfg=107
  highlight mailHeaderKey             guifg=#FFC66D ctermfg=221
  highlight mailEmail                 guifg=#A5C261 ctermfg=107 gui=italic cterm=underline

  highlight SpellBad                  guifg=#D70000 ctermfg=160 ctermbg=NONE cterm=underline
  highlight SpellRare                 guifg=#D75F87 ctermfg=168 guibg=NONE ctermbg=NONE gui=underline cterm=underline
  highlight SpellCap                  guifg=#D0D0FF ctermfg=189 guibg=NONE ctermbg=NONE gui=underline cterm=underline
  highlight MatchParen                guifg=#FFFFFF ctermfg=15 guibg=#005f5f ctermbg=23
