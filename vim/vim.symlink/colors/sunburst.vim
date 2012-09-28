" Vim color scheme
"
" Name:   sunburst.vim
" Author: Gigamo <gigamo@gmail.com>
"
" Based on the Sunburst theme for TextMate
" Distributable under the same terms as Vim itself
"
" Best usable with Ruby/HTML/CSS/JavaScript. Feel free to add custom
" language matchers!
"
" Cterm colors courtesy of greezybacon.

hi clear
if exists('syntax_on')
  syntax reset
endif
let colors_name = 'sunburst'

" Custom Ruby/JavaScript links (thanks to vividchalk.vim from tpope)
hi link railsMethod         PreProc
hi link rubyDefine          Keyword
hi link rubySymbol          Constant
hi link rubyAccess          rubyMethod
hi link rubyAttribute       rubyMethod
hi link rubyEval            rubyMethod
hi link rubyException       rubyMethod
hi link rubyInclude         rubyMethod
hi link rubyStringDelimiter rubyString
hi link rubyRegexp          Regexp
hi link rubyRegexpDelimiter rubyRegexp
hi link javascriptRegexpString  Regexp
hi link javascriptNumber        Number
hi link javascriptNull          Constant

hi Normal       guifg=#f8f8f8 guibg=#000000
hi Normal       ctermfg=253   ctermbg=0
hi NonText      guifg=#666666 guibg=#000000
hi NonText      ctermfg=241   ctermbg=0
hi StatusLine   guifg=#ffffff guibg=#121212 gui=bold
hi StatusLine   ctermfg=15    ctermbg=233   cterm=bold
hi StatusLineNC guifg=#ffffff guibg=#121212
hi StatusLineNC ctermfg=15    ctermbg=233
hi Cursor       guifg=#000000 guibg=#a7a7a7
hi Cursor       ctermfg=0     ctermbg=248
hi CursorLine   guifg=NONE    guibg=#121212
hi CursorLine   ctermfg=none  ctermbg=233
hi CursorColumn guifg=NONE    guibg=#121212
hi CursorColumn ctermfg=none  ctermbg=233
hi Pmenu        guifg=#ffffff guibg=#121212
hi Pmenu        ctermfg=15    ctermbg=233
hi PmenuSel     guifg=#ffffff guibg=#242424
hi PmenuSel     ctermfg=15    ctermbg=235
hi Todo         guifg=#fd5ff1 guibg=#000000 gui=italic,underline
hi Todo         ctermfg=207   ctermbg=0     cterm=underline
hi PreProc      guifg=#9b859d
hi PreProc      ctermfg=246
hi Visual                     guibg=#242424
hi Visual                     ctermbg=236
hi VisualNOS                  guibg=#202020
hi VisualNOS                  ctermbg=235
hi Comment      guifg=#6f6f6f               gui=italic
hi Comment      ctermfg=242
hi Constant     guifg=#3387cc
hi Constant     ctermfg=68
hi Directory    guifg=#3387cc
hi Directory    ctermfg=68
hi Entity       guifg=#89bdff
hi Entity       ctermfg=111
hi LineNr       guifg=#666666 guibg=#121212
hi LineNr       ctermfg=245   ctermbg=234
hi Identifier   guifg=#99cf50
hi Identifier   ctermfg=113
hi SpecialKey   guifg=#e28964
hi SpecialKey   ctermfg=173
hi Type         guifg=#89bdff
hi Type         ctermfg=111
hi Statement    guifg=#e28964
hi Statement    ctermfg=173
hi Operator     guifg=#e28964
hi Operator     ctermfg=173
hi Test                       guibg=#121212
hi Test                       ctermbg=234
hi String       guifg=#65b042
hi String       ctermfg=71
hi ErrorMsg     guifg=#fd5ff1 guibg=#562d56
hi ErrorMsg     ctermfg=207   ctermbg=238
hi WarningMsg   guifg=#fd5ff1               gui=italic,underline
hi WarningMsg   ctermfg=207                 cterm=underline
hi Regexp       guifg=#cf7d34
hi Regexp       ctermfg=173
hi Variable     guifg=#3e87e3
hi Variable     ctermfg=69
hi Special      guifg=#daefa3
hi Special      ctermfg=193
hi Title        guifg=#cdcdcd
hi Title        ctermfg=251
hi Structure    guifg=#af8fa7
hi Structure    ctermfg=139
hi Search       guifg=NONE    guibg=#303030 gui=NONE
hi Search       ctermfg=none  ctermbg=237   cterm=none
hi IncSearch    guifg=NONE    guibg=#303030 gui=NONE
hi IncSearch    ctermfg=none  ctermbg=237   cterm=none
hi rubyInstanceVariable    guifg=#3e87e3
hi rubyInstanceVariable    ctermfg=68
hi rubyBlockArgument       guifg=#3e87e3
hi rubyBlockArgument       ctermfg=68
hi rubyMethod              guifg=#e28964
hi rubyMethod              ctermfg=173
hi railsUserMethod         guifg=#cf7d34
hi railsUserMethod         ctermfg=173
hi railsUserClass          guifg=#89bdff
hi railsUserClass          ctermfg=111
hi javaScriptType          guifg=#3e87e3
hi javascriptType          ctermfg=68
hi javaScriptOpAssign      guifg=#e28964
hi javaScriptOpAssign      ctermfg=173
hi javaScriptFuncName      guifg=#3e87e3
hi javaScriptFuncName      ctermfg=68
hi javaScriptComment       guifg=#3f3f3f
hi javaScriptComment       ctermfg=237
hi htmlTag                 guifg=#89bdff
hi htmlTag                 ctermfg=111
hi htmlEndTag              guifg=#89bdff
hi htmlEndTag              ctermfg=111
hi htmlStatement           guifg=#89bdff
hi htmlStatement           ctermfg=111
hi cssClassName            guifg=#9b703f
hi cssClassName            ctermfg=95
hi cssIdentifier           guifg=#8b98ab
hi cssIdentifier           ctermfg=103
hi cssBraces               guifg=#cdcdcd
hi cssBraces               ctermfg=251
hi cssTagName              guifg=#cda869
hi cssTagName              ctermfg=179
hi cssPseudoClass          guifg=#8f9d6a
hi cssPsuedoClass          ctermfg=107
hi cssValueNumber          guifg=#dd7b3b
hi cssValueNumber          ctermfg=173
hi cssValueInteger         guifg=#dd7b3b
hi cssValueInteger         ctermfg=173
hi cssValueLength          guifg=#e28964
hi cssValueLength          ctermfg=173
hi cssValueFrequency       guifg=#dd7b3b
hi cssValueFrequency       ctermfg=173
hi cssValueTime            guifg=#dd7b3b
hi cssValueTime            ctermfg=173
hi cssValueAngle           guifg=#dd7b3b
hi cssValueAngle           ctermfg=173
hi cssColor                guifg=#dd7b3b
hi cssColor                ctermfg=173
hi cssCommonAttr           guifg=#f9ee98
hi cssCommonAttr           ctermfg=228
hi cssBoxProp              guifg=#c5af75
hi cssBoxProp              ctermfg=180
hi cssBoxAttr              guifg=#f9ee98
hi cssBoxAttr              ctermfg=228
hi cssFontProp             guifg=#c5af75
hi cssFontProp             ctermfg=180
hi cssFontAttr             guifg=#cf6a4c
hi cssFontAttr             ctermfg=167
hi cssColorProp            guifg=#c5af75
hi cssColorProp            ctermfg=180
hi cssColorAttr            guifg=#cf6a4c
hi cssColorAttr            ctermfg=167
hi cssTextProp             guifg=#c5af75
hi cssTextProp             ctermfg=180
hi cssTextAttr             guifg=#f9ee98
hi cssTextAttr             ctermfg=228
hi cssGeneratedContentProp guifg=#c5af75
hi cssGeneratedContentProp ctermfg=180
hi cssGeneratedContentAttr guifg=#f9ee98
hi cssGeneratedContentAttr ctermfg=228
hi cssPagingProp           guifg=#c5af75
hi cssPagingProp           ctermfg=180
hi cssPagingAttr           guifg=#f9ee98
hi cssPagingAttr           ctermfg=228
hi cssUIProp               guifg=#c5af75
hi cssUIProp               ctermfg=180
hi cssUIAttr               guifg=#f9ee98
hi cssUIAttr               ctermfg=228
hi cssRenderProp           guifg=#c5af75
hi cssRenderProp           ctermfg=180
hi cssRenderAttr           guifg=#f9ee98
hi cssRenderAttr           ctermfg=228
hi cssAuralProp            guifg=#c5af75
hi cssAuralProp            ctermfg=180
hi cssAuralAttr            guifg=#f9ee98
hi cssAuralAttr            ctermfg=228
hi cssTableProp            guifg=#c5af75
hi cssTableProp            ctermfg=180
hi cssTableAttr            guifg=#f9ee98
hi cssTableAttr            ctermfg=228
hi cssImportant            guifg=#cf6a4c
hi cssImportant            ctermfg=167
hi cssFunctionName         guifg=#f9ee98
hi cssFunctionName         ctermfg=228
hi cssURL                  guifg=#3e87e3
hi cssMediaType            guifg=#cf6a4c
hi cssMediaType            ctermfg=167
hi cssMediaComma           guifg=#cf6a4c
hi cssMediaComma           ctermfg=167
hi cssMedia                guifg=#e28964
hi cssMedia                ctermfg=173
hi erubyDelimiter          guifg=#cdcdcd
hi erubyDelimiter          ctermfg=251

hi pythonClassName      guifg=#89bdff               gui=underline
hi pythonClassName      ctermfg=111                 cterm=underline
hi pythonClassDef       guifg=#99cf50
hi pythonClassDef       ctermfg=113
hi pythonFuncDef        guifg=#99cf50
hi pythonFuncDef        ctermfg=113
hi pythonParamName      guifg=#3387cc
hi pythonParamName      ctermfg=32
hi pythonSuperClass     guifg=#996633               gui=italic
hi pythonSuperClass     ctermfg=95
