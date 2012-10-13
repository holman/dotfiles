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

hi ColorColumn  ctermbg=234   guibg=#303030

hi Normal       guifg=#f8f8f8 guibg=#000000
hi NonText      guifg=#666666 guibg=#000000
hi StatusLine   guifg=#ffffff guibg=#343434 gui=bold
hi StatusLineNC guifg=#aaaaaa guibg=#121212
hi Cursor       guifg=#000000 guibg=#a7a7a7
hi CursorLine   guifg=NONE    guibg=#121212
hi CursorColumn guifg=NONE    guibg=#121212
hi Pmenu        guifg=#ffffff guibg=#121212
hi PmenuSel     guifg=#ffffff guibg=#242424
hi Todo         guifg=#fd5ff1 guibg=#000000 gui=italic,underline
hi PreProc      guifg=#9b859d
hi Visual                     guibg=#242424
hi VisualNOS                  guibg=#202020
hi Comment      guifg=#7f7f7f               gui=italic
hi Constant     guifg=#3387cc
hi Directory    guifg=#3387cc
hi LineNr       guifg=#666666 guibg=#121212
hi Identifier   guifg=#99cf50
hi SpecialKey   guifg=#e28964
hi Type         guifg=#89bdff
hi Statement    guifg=#e28964
hi Operator     guifg=#e28964
hi String       guifg=#65b042
hi ErrorMsg     guifg=#fd5ff1 guibg=#562d56
hi WarningMsg   guifg=#fd5ff1               gui=italic,underline
hi Regexp       guifg=#cf7d34
hi Variable     guifg=#3e87e3
hi Special      guifg=#daefa3
hi Title        guifg=#cdcdcd
hi Search       guifg=NONE    guibg=#303030 gui=NONE
hi IncSearch    guifg=NONE    guibg=#303030 gui=NONE
hi rubyInstanceVariable    guifg=#3e87e3
hi rubyBlockArgument       guifg=#3e87e3
hi rubyMethod              guifg=#e28964
hi railsUserMethod         guifg=#cf7d34
hi railsUserClass          guifg=#89bdff
hi javaScriptType          guifg=#3e87e3
hi javaScriptOpAssign      guifg=#e28964
hi javaScriptFuncName      guifg=#3e87e3
hi javaScriptComment       guifg=#3f3f3f
hi htmlTag                 guifg=#89bdff
hi htmlEndTag              guifg=#89bdff
hi htmlStatement           guifg=#89bdff
hi cssClassName            guifg=#9b703f
hi cssIdentifier           guifg=#8b98ab
hi cssBraces               guifg=#cdcdcd
hi cssTagName              guifg=#cda869
hi cssPseudoClass          guifg=#8f9d6a
hi cssValueNumber          guifg=#dd7b3b
hi cssValueInteger         guifg=#dd7b3b
hi cssValueLength          guifg=#e28964
hi cssValueFrequency       guifg=#dd7b3b
hi cssValueTime            guifg=#dd7b3b
hi cssValueAngle           guifg=#dd7b3b
hi cssColor                guifg=#dd7b3b
hi cssCommonAttr           guifg=#f9ee98
hi cssBoxProp              guifg=#c5af75
hi cssBoxAttr              guifg=#f9ee98
hi cssFontProp             guifg=#c5af75
hi cssFontAttr             guifg=#cf6a4c
hi cssColorProp            guifg=#c5af75
hi cssColorAttr            guifg=#cf6a4c
hi cssTextProp             guifg=#c5af75
hi cssTextAttr             guifg=#f9ee98
hi cssGeneratedContentProp guifg=#c5af75
hi cssGeneratedContentAttr guifg=#f9ee98
hi cssPagingProp           guifg=#c5af75
hi cssPagingAttr           guifg=#f9ee98
hi cssUIProp               guifg=#c5af75
hi cssUIAttr               guifg=#f9ee98
hi cssRenderProp           guifg=#c5af75
hi cssRenderAttr           guifg=#f9ee98
hi cssAuralProp            guifg=#c5af75
hi cssAuralAttr            guifg=#f9ee98
hi cssTableProp            guifg=#c5af75
hi cssTableAttr            guifg=#f9ee98
hi cssImportant            guifg=#cf6a4c
hi cssFunctionName         guifg=#f9ee98
hi cssURL                  guifg=#3e87e3
hi cssMediaType            guifg=#cf6a4c
hi cssMediaComma           guifg=#cf6a4c
hi cssMedia                guifg=#e28964
hi erubyDelimiter          guifg=#cdcdcd
