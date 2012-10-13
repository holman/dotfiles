" tComment.vim -- An easily extensible & universal comment plugin 
" @Author:      Tom Link (micathom AT gmail com)
" @License:     GPL (see http://www.gnu.org/licenses/gpl.txt)
" @Created:     27-Dez-2004.
" @Last Change: 2009-08-07.
" @Revision:    1.9.671
" 
" GetLatestVimScripts: 1173 1 tComment.vim

if &cp || exists('loaded_tcomment')
    finish
endif
let loaded_tcomment = 109

" If true, comment blank lines too
if !exists("g:tcommentBlankLines")
    let g:tcommentBlankLines = 1
endif

if !exists("g:tcommentMapLeader1")
    let g:tcommentMapLeader1 = '<c-_>'
endif
if !exists("g:tcommentMapLeader2")
    let g:tcommentMapLeader2 = '<Leader>_'
endif
if !exists("g:tcommentMapLeaderOp1")
    let g:tcommentMapLeaderOp1 = 'gc'
endif
if !exists("g:tcommentMapLeaderOp2")
    let g:tcommentMapLeaderOp2 = 'gC'
endif
if !exists("g:tcommentOpModeExtra")
    let g:tcommentOpModeExtra = ''
endif

" Guess the file type based on syntax names always or for some fileformat only
if !exists("g:tcommentGuessFileType")
    let g:tcommentGuessFileType = 0
endif
" In php documents, the php part is usually marked as phpRegion. We thus 
" assume that the buffers default comment style isn't php but html
if !exists("g:tcommentGuessFileType_dsl")
    let g:tcommentGuessFileType_dsl = 'xml'
endif
if !exists("g:tcommentGuessFileType_php")
    let g:tcommentGuessFileType_php = 'html'
endif
if !exists("g:tcommentGuessFileType_html")
    let g:tcommentGuessFileType_html = 1
endif
if !exists("g:tcommentGuessFileType_tskeleton")
    let g:tcommentGuessFileType_tskeleton = 1
endif
if !exists("g:tcommentGuessFileType_vim")
    let g:tcommentGuessFileType_vim = 1
endif

if !exists("g:tcommentIgnoreTypes_php")
    let g:tcommentIgnoreTypes_php = 'sql'
endif

if !exists('g:tcommentSyntaxMap') "{{{2
    let g:tcommentSyntaxMap = {
            \ 'vimMzSchemeRegion': 'scheme',
            \ 'vimPerlRegion':     'perl',
            \ 'vimPythonRegion':   'python',
            \ 'vimRubyRegion':     'ruby',
            \ 'vimTclRegion':      'tcl',
            \ }
endif

" If you don't define these variables, TComment will use &commentstring 
" instead. We override the default values here in order to have a blank after 
" the comment marker. Block comments work only if we explicitly define the 
" markup.
" The format for block comments is similar to normal commentstrings with the 
" exception that the format strings for blocks can contain a second line that 
" defines how "middle lines" (see :h format-comments) should be displayed.

" I personally find this style rather irritating but here is an alternative 
" definition that does this left-handed bar thing
if !exists("g:tcommentBlockC")
    let g:tcommentBlockC = "/*%s */\n * "
endif
if !exists("g:tcommentBlockC2")
    let g:tcommentBlockC2 = "/**%s */\n * "
endif
if !exists("g:tcommentInlineC")
    let g:tcommentInlineC = "/* %s */"
endif

if !exists("g:tcommentBlockXML")
    let g:tcommentBlockXML = "<!--%s-->\n  "
endif
if !exists("g:tcommentInlineXML")
    let g:tcommentInlineXML = "<!-- %s -->"
endif

let g:tcommentFileTypesDirty = 1

" Currently this function just sets a variable
function! TCommentDefineType(name, commentstring)
    if !exists('g:tcomment_'. a:name)
        let g:tcomment_{a:name} = a:commentstring
    endif
    let g:tcommentFileTypesDirty = 1
endf

function! TCommentTypeExists(name)
    return exists('g:tcomment_'. a:name)
endf

call TCommentDefineType('aap',              '# %s'             )
call TCommentDefineType('ada',              '-- %s'            )
call TCommentDefineType('apache',           '# %s'             )
call TCommentDefineType('autoit',           '; %s'             )
call TCommentDefineType('asm',              '; %s'             )
call TCommentDefineType('awk',              '# %s'             )
call TCommentDefineType('catalog',          '-- %s --'         )
call TCommentDefineType('catalog_block',    "--%s--\n  "       )
call TCommentDefineType('cpp',              '// %s'            )
call TCommentDefineType('cpp_inline',       g:tcommentInlineC  )
call TCommentDefineType('cpp_block',        g:tcommentBlockC   )
call TCommentDefineType('css',              '/* %s */'         )
call TCommentDefineType('css_inline',       g:tcommentInlineC  )
call TCommentDefineType('css_block',        g:tcommentBlockC   )
call TCommentDefineType('c',                '/* %s */'         )
call TCommentDefineType('c_inline',         g:tcommentInlineC  )
call TCommentDefineType('c_block',          g:tcommentBlockC   )
call TCommentDefineType('cfg',              '# %s'             )
call TCommentDefineType('conf',             '# %s'             )
call TCommentDefineType('crontab',          '# %s'             )
call TCommentDefineType('desktop',          '# %s'             )
call TCommentDefineType('docbk',            '<!-- %s -->'      )
call TCommentDefineType('docbk_inline',     g:tcommentInlineXML)
call TCommentDefineType('docbk_block',      g:tcommentBlockXML )
call TCommentDefineType('dosbatch',         'rem %s'           )
call TCommentDefineType('dosini',           '; %s'             )
call TCommentDefineType('dsl',              '; %s'             )
call TCommentDefineType('dylan',            '// %s'            )
call TCommentDefineType('eiffel',           '-- %s'            )
call TCommentDefineType('eruby',            '<%%# %s%%>'       )
call TCommentDefineType('gtkrc',            '# %s'             )
call TCommentDefineType('gitcommit',        '# %s'             )
call TCommentDefineType('haskell',          '-- %s'            )
call TCommentDefineType('haskell_block',    "{-%s-}\n   "      )
call TCommentDefineType('haskell_inline',   '{- %s -}'         )
call TCommentDefineType('html',             '<!-- %s -->'      )
call TCommentDefineType('html_inline',      g:tcommentInlineXML)
call TCommentDefineType('html_block',       g:tcommentBlockXML )
call TCommentDefineType('io',               '// %s'            )
call TCommentDefineType('javaScript',       '// %s'            )
call TCommentDefineType('javaScript_inline', g:tcommentInlineC )
call TCommentDefineType('javaScript_block', g:tcommentBlockC   )
call TCommentDefineType('javascript',       '// %s'            )
call TCommentDefineType('javascript_inline', g:tcommentInlineC )
call TCommentDefineType('javascript_block', g:tcommentBlockC   )
call TCommentDefineType('java',             '/* %s */'         )
call TCommentDefineType('java_inline',      g:tcommentInlineC  )
call TCommentDefineType('java_block',       g:tcommentBlockC   )
call TCommentDefineType('java_doc_block',   g:tcommentBlockC2  )
call TCommentDefineType('jproperties',      '# %s'             )
call TCommentDefineType('lisp',             '; %s'             )
call TCommentDefineType('lynx',             '# %s'             )
call TCommentDefineType('m4',               'dnl %s'           )
call TCommentDefineType('mail',             '> %s'             )
call TCommentDefineType('msidl',            '// %s'            )
call TCommentDefineType('msidl_block',      g:tcommentBlockC   )
call TCommentDefineType('nroff',            '.\\" %s'          )
call TCommentDefineType('nsis',             '# %s'             )
call TCommentDefineType('objc',             '/* %s */'         )
call TCommentDefineType('objc_inline',      g:tcommentInlineC  )
call TCommentDefineType('objc_block',       g:tcommentBlockC   )
call TCommentDefineType('ocaml',            '(* %s *)'         )
call TCommentDefineType('ocaml_inline',     '(* %s *)'         )
call TCommentDefineType('ocaml_block',      "(*%s*)\n   "      )
call TCommentDefineType('pascal',           '(* %s *)'         )
call TCommentDefineType('pascal_inline',    '(* %s *)'         )
call TCommentDefineType('pascal_block',     "(*%s*)\n   "      )
call TCommentDefineType('perl',             '# %s'             )
call TCommentDefineType('perl_block',       "=cut%s=cut"       )
call TCommentDefineType('php',              '// %s'            )
call TCommentDefineType('php_inline',       g:tcommentInlineC  )
call TCommentDefineType('php_block',        g:tcommentBlockC   )
call TCommentDefineType('php_2_block',      g:tcommentBlockC2  )
call TCommentDefineType('po',               '# %s'             )
call TCommentDefineType('prolog',           '%% %s'            )
call TCommentDefineType('rc',               '// %s'            )
call TCommentDefineType('readline',         '# %s'             )
call TCommentDefineType('ruby',             '# %s'             )
call TCommentDefineType('ruby_3',           '### %s'           )
call TCommentDefineType('ruby_block',       "=begin rdoc%s=end")
call TCommentDefineType('ruby_nodoc_block', "=begin%s=end"     )
call TCommentDefineType('r',                '# %s'             )
call TCommentDefineType('sbs',              "' %s"             )
call TCommentDefineType('scheme',           '; %s'             )
call TCommentDefineType('sed',              '# %s'             )
call TCommentDefineType('sgml',             '<!-- %s -->'      )
call TCommentDefineType('sgml_inline',      g:tcommentInlineXML)
call TCommentDefineType('sgml_block',       g:tcommentBlockXML )
call TCommentDefineType('sh',               '# %s'             )
call TCommentDefineType('sql',              '-- %s'            )
call TCommentDefineType('spec',             '# %s'             )
call TCommentDefineType('sps',              '* %s.'            )
call TCommentDefineType('sps_block',        "* %s."            )
call TCommentDefineType('spss',             '* %s.'            )
call TCommentDefineType('spss_block',       "* %s."            )
call TCommentDefineType('tcl',              '# %s'             )
call TCommentDefineType('tex',              '%% %s'            )
call TCommentDefineType('tpl',              '<!-- %s -->'      )
call TCommentDefineType('viki',             '%% %s'            )
call TCommentDefineType('viki_3',           '%%%%%% %s'        )
call TCommentDefineType('viki_inline',      '{cmt: %s}'        )
call TCommentDefineType('vim',              '" %s'             )
call TCommentDefineType('vim_3',            '""" %s'           )
call TCommentDefineType('websec',           '# %s'             )
call TCommentDefineType('xml',              '<!-- %s -->'      )
call TCommentDefineType('xml_inline',       g:tcommentInlineXML)
call TCommentDefineType('xml_block',        g:tcommentBlockXML )
call TCommentDefineType('xs',               '// %s'            )
call TCommentDefineType('xs_block',         g:tcommentBlockC   )
call TCommentDefineType('xslt',             '<!-- %s -->'      )
call TCommentDefineType('xslt_inline',      g:tcommentInlineXML)
call TCommentDefineType('xslt_block',       g:tcommentBlockXML )
call TCommentDefineType('yaml',             '# %s'             )


" :line1,line2 TCommentAs commenttype
command! -bang -complete=customlist,tcomment#FileTypes -range -nargs=+ TCommentAs 
            \ call tcomment#CommentAs(<line1>, <line2>, "<bang>", <f-args>)

" :line1,line2 TComment ?commentBegin ?commentEnd
command! -bang -range -nargs=* TComment keepjumps call tcomment#Comment(<line1>, <line2>, 'G', "<bang>", <f-args>)

" :line1,line2 TCommentRight ?commentBegin ?commentEnd
command! -bang -range -nargs=* TCommentRight keepjumps call tcomment#Comment(<line1>, <line2>, 'R', "<bang>", <f-args>)

" :line1,line2 TCommentBlock ?commentBegin ?commentEnd
command! -bang -range -nargs=* TCommentBlock keepjumps call tcomment#Comment(<line1>, <line2>, 'B', "<bang>", <f-args>)

" :line1,line2 TCommentInline ?commentBegin ?commentEnd
command! -bang -range -nargs=* TCommentInline keepjumps call tcomment#Comment(<line1>, <line2>, 'I', "<bang>", <f-args>)

" :line1,line2 TCommentMaybeInline ?commentBegin ?commentEnd
command! -bang -range -nargs=* TCommentMaybeInline keepjumps call tcomment#Comment(<line1>, <line2>, 'i', "<bang>", <f-args>)



if (g:tcommentMapLeader1 != '')
    exec 'noremap <silent> '. g:tcommentMapLeader1 .'<c-_> :TComment<cr>'
    exec 'vnoremap <silent> '. g:tcommentMapLeader1 .'<c-_> :TCommentMaybeInline<cr>'
    exec 'inoremap <silent> '. g:tcommentMapLeader1 .'<c-_> <c-o>:TComment<cr>'
    exec 'noremap <silent> '. g:tcommentMapLeader1 .'p m`vip:TComment<cr>``'
    exec 'inoremap <silent> '. g:tcommentMapLeader1 .'p <c-o>:norm! m`vip<cr>:TComment<cr><c-o>``'
    exec 'noremap '. g:tcommentMapLeader1 .'<space> :TComment '
    exec 'inoremap '. g:tcommentMapLeader1 .'<space> <c-o>:TComment '
    exec 'inoremap <silent> '. g:tcommentMapLeader1 .'r <c-o>:TCommentRight<cr>'
    exec 'noremap <silent> '. g:tcommentMapLeader1 .'r :TCommentRight<cr>'
    exec 'vnoremap <silent> '. g:tcommentMapLeader1 .'i :TCommentInline<cr>'
    exec 'vnoremap <silent> '. g:tcommentMapLeader1 .'r :TCommentRight<cr>'
    exec 'noremap '. g:tcommentMapLeader1 .'b :TCommentBlock<cr>'
    exec 'inoremap '. g:tcommentMapLeader1 .'b <c-o>:TCommentBlock<cr>'
    exec 'noremap '. g:tcommentMapLeader1 .'a :TCommentAs '
    exec 'inoremap '. g:tcommentMapLeader1 .'a <c-o>:TCommentAs '
    exec 'noremap '. g:tcommentMapLeader1 .'n :TCommentAs <c-r>=&ft<cr> '
    exec 'inoremap '. g:tcommentMapLeader1 .'n <c-o>:TCommentAs <c-r>=&ft<cr> '
    exec 'noremap '. g:tcommentMapLeader1 .'s :TCommentAs <c-r>=&ft<cr>_'
    exec 'inoremap '. g:tcommentMapLeader1 .'s <c-o>:TCommentAs <c-r>=&ft<cr>_'
endif
if (g:tcommentMapLeader2 != '')
    exec 'noremap <silent> '. g:tcommentMapLeader2 .'_ :TComment<cr>'
    exec 'vnoremap <silent> '. g:tcommentMapLeader2 .'_ :TCommentMaybeInline<cr>'
    exec 'noremap <silent> '. g:tcommentMapLeader2 .'p vip:TComment<cr>'
    exec 'noremap '. g:tcommentMapLeader2 .'<space> :TComment '
    exec 'vnoremap <silent> '. g:tcommentMapLeader2 .'i :TCommentInline<cr>'
    exec 'noremap <silent> '. g:tcommentMapLeader2 .'r :TCommentRight<cr>'
    exec 'vnoremap <silent> '. g:tcommentMapLeader2 .'r :TCommentRight<cr>'
    exec 'noremap '. g:tcommentMapLeader2 .'b :TCommentBlock<cr>'
    exec 'noremap '. g:tcommentMapLeader2 .'a :TCommentAs '
    exec 'noremap '. g:tcommentMapLeader2 .'n :TCommentAs <c-r>=&ft<cr> '
    exec 'noremap '. g:tcommentMapLeader2 .'s :TCommentAs <c-r>=&ft<cr>_'
endif
if (g:tcommentMapLeaderOp1 != '')
    exec 'nnoremap <silent> '. g:tcommentMapLeaderOp1 .' :let w:tcommentPos = getpos(".") \| set opfunc=tcomment#Operator<cr>g@'
    exec 'nnoremap <silent> '. g:tcommentMapLeaderOp1 .'c :let w:tcommentPos = getpos(".") \| set opfunc=tcomment#OperatorLine<cr>g@$'
    exec 'vnoremap <silent> '. g:tcommentMapLeaderOp1 .' :TCommentMaybeInline<cr>'
endif 
if (g:tcommentMapLeaderOp2 != '')
    exec 'nnoremap <silent> '. g:tcommentMapLeaderOp2 .' :let w:tcommentPos = getpos(".") \| set opfunc=tcomment#OperatorAnyway<cr>g@'
    exec 'nnoremap <silent> '. g:tcommentMapLeaderOp2 .'c :let w:tcommentPos = getpos(".") \| set opfunc=tcomment#OperatorLineAnyway<cr>g@$'
    exec 'vnoremap <silent> '. g:tcommentMapLeaderOp2 .' :TCommentMaybeInline<cr>'
endif 

finish


-----------------------------------------------------------------------
History

0.1
- Initial release

0.2
- Fixed uncommenting of non-aligned comments
- improved support for block comments (with middle lines and indentation)
- using TCommentBlock for file types that don't have block comments creates 
single line comments
- removed the TCommentAsBlock command (TCommentAs provides its functionality)
- removed g:tcommentSetCMS
- the default key bindings have slightly changed

1.3
- slightly improved recognition of embedded syntax
- if no commentstring is defined in whatever way, reconstruct one from 
&comments
- The TComment... commands now have bang variants that don't act as toggles 
but always comment out the selected text
- fixed problem with commentstrings containing backslashes
- comment as visual block (allows commenting text to the right of the main 
text, i.e., this command doesn't work on whole lines but on the text to the 
right of the cursor)
- enable multimode for dsl, vim filetypes
- added explicit support for some other file types I ran into

1.4
- Fixed problem when &commentstring was invalid (e.g. lua)
- perl_block by Kyosuke Takayama.
- <c-_>s mapped to :TCommentAs <c-r>=&ft<cr>

1.5
- "Inline" visual comments (uses the &filetype_inline style if 
available; doesn't check if the filetype actually supports this kind of 
comments); tComment can't currently deduce inline comment styles from 
&comments or &commentstring (I personally hardly ever use them); default 
map: <c-_>i or <c-_>I
- In visual mode: if the selection spans several lines, normal mode is 
selected; if the selection covers only a part of one line, inline mode 
is selected
- Fixed problem with lines containing ^M or ^@ characters.
- It's no longer necessary to call TCommentCollectFileTypes() after 
defining a new filetype via TCommentDefineType()
- Disabled single <c-_> mappings
- Renamed TCommentVisualBlock to TCommentRight
- FIX: Forgot 'x' in ExtractCommentsPart() (thanks to Fredrik Acosta)

1.6
- Ignore sql when guessing the comment string in php files; tComment 
sometimes chooses the wrong comment string because the use of sql syntax 
is used too loosely in php files; if you want to comment embedded sql 
code you have to use TCommentAs
- Use keepjumps in commands.
- Map <c-_>p & <L>_p to vip:TComment<cr>
- Made key maps configurable via g:tcommentMapLeader1 and 
g:tcommentMapLeader2

1.7
- gc{motion} (see g:tcommentMapLeaderOp1) functions as a comment toggle 
operator (i.e., something like gcl... works, mostly); gC{motion} (see 
g:tcommentMapLeaderOp2) will unconditionally comment the text.
- TCommentAs takes an optional second argument (the comment level)
- New "n" map: TCommentAs &filetype [COUNT]
- Defined mail comments/citations
- g:tcommentSyntaxMap: Map syntax names to filetypes for buffers with 
mixed syntax groups that don't match the filetypeEmbeddedsyntax scheme (e.g.  
'vimRubyRegion', which should be commented as ruby syntax, not as vim 
syntax)
- FIX: Comments in vim*Region
- TComment: The use of the type argument has slightly changed (IG -> i, 
new: >)

1.8
- Definitly require vim7
- Split the plugin into autoload & plugin.
- g:TCommentFileTypes is a list
- Fixed some block comment strings
- Removed extraneous newline in some block comments.
- Maps for visal mode (thanks Krzysztof Goj)

1.9
- Fix left offset for inline comments (via operator binding)

1.10
- tcomment#Operator defines w:tcommentPos if invoked repeatedly
- s:GuessFileType: use len(getline()) instead of col()

