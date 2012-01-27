" Vim syntax file
" Language:     Markdown
" Author:       Ben Williams <benw@plasticboy.com>
" Maintainer:   Hallison Batista <email@hallisonbatista.com>
" URL:          http://plasticboy.com/markdown-vim-mode/
" Version:      1.0.1
" Last Change:  Fri Dec  4 08:36:48 AMT 2009
" Remark:       Uses HTML syntax file
" Remark:       I don't do anything with angle brackets (<>) because that would too easily
"               easily conflict with HTML syntax
" TODO: Handle stuff contained within stuff (e.g. headings within blockquotes)

" Read the HTML syntax to start with
if version < 600
  so <sfile>:p:h/html.vim
else
  runtime! syntax/html.vim
  unlet b:current_syntax
endif

if version < 600
  syntax clear
elseif exists("b:current_syntax")
  finish
endif

" Don't use standard HiLink, it will not work with included syntax files
if version < 508
  command! -nargs=+ HtmlHiLink hi link <args>
else
  command! -nargs=+ HtmlHiLink hi def link <args>
endif

syntax spell toplevel
syntax case ignore
syntax sync linebreaks=1

" Additions to HTML groups
syntax region htmlBold    start=/\\\@<!\(^\|\A\)\@=\*\@<!\*\*\*\@!/  end=/\\\@<!\*\@<!\*\*\*\@!\($\|\A\)\@=/  contains=htmlItalic,@Spell
syntax region htmlItalic  start=/\\\@<!\(^\|\A\)\@=\*\@<!\*\*\@!/    end=/\\\@<!\*\@<!\*\*\@!\($\|\A\)\@=/    contains=htmlBold,@Spell
syntax region htmlBold    start=/\\\@<!\(^\|\A\)\@=_\@<!___\@!/      end=/\\\@<!_\@<!___\@!\($\|\A\)\@=/      contains=htmlItalic,@Spell
syntax region htmlItalic  start=/\\\@<!\(^\|\A\)\@=_\@<!__\@!/       end=/\\\@<!_\@<!__\@!\($\|\A\)\@=/       contains=htmlBold,@Spell

" [link](URL) | [link][id] | [link][]
syntax region mkdLink matchgroup=mkdDelimiter start="\!\?\["  end="\]\ze\s*[[(]" contains=@Spell nextgroup=mkdURL,mkdID skipwhite oneline
syntax region mkdID   matchgroup=mkdDelimiter start="\["      end="\]" contained
syntax region mkdURL  matchgroup=mkdDelimiter start="("       end=")"  contained

" Link definitions: [id]: URL (Optional Title)
" TODO handle automatic links without colliding with htmlTag (<URL>)
syntax region mkdLinkDef matchgroup=mkdDelimiter   start="^ \{,3}\zs\[" end="]:" oneline nextgroup=mkdLinkDefTarget skipwhite
syntax region mkdLinkDefTarget start="<\?\zs\S" excludenl end="\ze[>[:space:]\n]"   contained nextgroup=mkdLinkTitle,mkdLinkDef skipwhite skipnl oneline
syntax region mkdLinkTitle matchgroup=mkdDelimiter start=+"+     end=+"+  contained
syntax region mkdLinkTitle matchgroup=mkdDelimiter start=+'+     end=+'+  contained
syntax region mkdLinkTitle matchgroup=mkdDelimiter start=+(+     end=+)+  contained

" Define Markdown groups
syntax match  mkdLineContinue ".$" contained
syntax match  mkdRule      /^\s*\*\s\{0,1}\*\s\{0,1}\*$/
syntax match  mkdRule      /^\s*-\s\{0,1}-\s\{0,1}-$/
syntax match  mkdRule      /^\s*_\s\{0,1}_\s\{0,1}_$/
syntax match  mkdRule      /^\s*-\{3,}$/
syntax match  mkdRule      /^\s*\*\{3,5}$/
syntax match  mkdListItem  "^\s*[-*+]\s\+"
syntax match  mkdListItem  "^\s*\d\+\.\s\+"
syntax match  mkdCode      /^\s*\n\(\(\s\{4,}[^ ]\|\t\+[^\t]\).*\n\)\+/
syntax match  mkdLineBreak /  \+$/
syntax region mkdCode       start=/\\\@<!`/     end=/\\\@<!`/
syntax region mkdCode       start=/\s*``[^`]*/  end=/[^`]*``\s*/
syntax region mkdCode       start=/\s*```[^`]*/ end=/[^`]*```\s*/
syntax region mkdBlockquote start=/^\s*>/       end=/$/           contains=mkdLineBreak,mkdLineContinue,@Spell
syntax region mkdCode       start="<pre[^>]*>"  end="</pre>"
syntax region mkdCode       start="<code[^>]*>" end="</code>"

" HTML headings
syntax region htmlH1       start="^\s*#"                   end="\($\|#\+\)" contains=@Spell
syntax region htmlH2       start="^\s*##"                  end="\($\|#\+\)" contains=@Spell
syntax region htmlH3       start="^\s*###"                 end="\($\|#\+\)" contains=@Spell
syntax region htmlH4       start="^\s*####"                end="\($\|#\+\)" contains=@Spell
syntax region htmlH5       start="^\s*#####"               end="\($\|#\+\)" contains=@Spell
syntax region htmlH6       start="^\s*######"              end="\($\|#\+\)" contains=@Spell
syntax match  htmlH1       /^.\+\n=\+$/ contains=@Spell
syntax match  htmlH2       /^.\+\n-\+$/ contains=@Spell

"highlighting for Markdown groups
HtmlHiLink mkdString        String
HtmlHiLink mkdCode          String
HtmlHiLink mkdBlockquote    Comment
HtmlHiLink mkdLineContinue  Comment
HtmlHiLink mkdListItem      Identifier
HtmlHiLink mkdRule          Identifier
HtmlHiLink mkdLineBreak     Todo
HtmlHiLink mkdLink          htmlLink
HtmlHiLink mkdURL           htmlString
HtmlHiLink mkdID            Identifier
HtmlHiLink mkdLinkDef       mkdID
HtmlHiLink mkdLinkDefTarget mkdURL
HtmlHiLink mkdLinkTitle     htmlString

HtmlHiLink mkdDelimiter     Delimiter

let b:current_syntax = "markdown"

delcommand HtmlHiLink
" vim: tabstop=2
