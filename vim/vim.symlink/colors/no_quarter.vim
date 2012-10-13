" Vim color file
"  Maintainer: Otavio Fernandes <otaviof@gmail.com>
" Last Change: 2010/01/03 Sun 22:56
"     Version: 1.0.6
"
" ts=4
"

set background=dark
hi clear
if exists("syntax_on")
   syntax reset
endif
let colors_name = "no_quarter"

"
" Vim Colors (( Default Options ))
"

hi Normal				guifg=grey90                        guibg=#303030

hi Comment				gui=NONE		guifg=#647bcf       guibg=NONE
hi Constant				gui=NONE		guifg=#b07050       guibg=NONE
hi Cursor				gui=NONE		guifg=#424242       guibg=green
hi CursorIM				gui=NONE		guifg=#ffffff       guibg=#8800ff
hi CursorLine           gui=NONE                            guibg=gray25
hi DiffAdd				gui=NONE		guifg=#a0d0ff       guibg=#0020a0
hi DiffChange			gui=NONE		guifg=#e03870       guibg=#601830
hi DiffDelete			gui=NONE		guifg=#a0d0ff       guibg=#0020a0
hi DiffText				gui=NONE		guifg=#ff78f0       guibg=#a02860
hi Directory			gui=NONE		guifg=lightmagenta  guibg=NONE
hi Error				gui=BOLD		guifg=#ffffff       guibg=#8000ff
hi ErrorMsg				gui=BOLD		guifg=#ffa0ff       guibg=NONE
hi FoldColumn			gui=NONE		guifg=#40c0ff       guibg=#404040
hi Folded				gui=NONE		guifg=#40f0f0       guibg=#006090
hi Identifier			gui=NONE		guifg=#90c0c0       guibg=NONE
hi Ignore				gui=NONE		guifg=bg            guibg=NONE
hi IncSearch			gui=UNDERLINE	guifg=#80ffff       guibg=#0060c0
hi LineNr				gui=NONE		guifg=#707070       guibg=NONE
hi ModeMsg				gui=BOLD		guifg=#a0d0ff       guibg=NONE
hi MoreMsg				gui=NONE        guifg=lightred      guibg=bg
hi NonText				gui=BOLD		guifg=#707070       guibg=#383838
hi OverLength           gui=NONE        guifg=fg            guibg=#353535
hi PreProc				gui=NONE		guifg=#c090c0       guibg=NONE
hi Question				gui=BOLD		guifg=#e8e800       guibg=NONE
hi Search				gui=NONE		guifg=bg            guibg=grey60
hi SignColumn           gui=NONE        guifg=darkyellow    guibg=bg
hi Special				gui=NONE		guifg=#c090c0       guibg=NONE
hi SpecialKey			gui=BOLD		guifg=green         guibg=NONE
hi Statement			gui=NONE		guifg=#c0c090       guibg=NONE
hi StatusLine			gui=NONE		guifg=#000000       guibg=#909090
hi StatusLineNC			gui=NONE		guifg=#abac84       guibg=#404040
hi Title				gui=NONE        guifg=darkcyan      guibg=bg
hi Todo					gui=BOLD		guifg=#ff80d0       guibg=NONE
hi Type					gui=NONE		guifg=#60f0a8       guibg=NONE
hi Underlined			gui=UNDERLINE	guifg=#707070       guibg=NONE
hi VertSplit			gui=NONE		guifg=#abac84       guibg=#404040
hi Visual				gui=NONE		guifg=#b0ffb0       guibg=#008000
hi VisualNOS			gui=NONE		guifg=#ffe8c8       guibg=#c06800
hi WarningMsg			gui=BOLD		guifg=#ffa0ff       guibg=NONE
hi WildMenu				gui=NONE		guifg=#000000       guibg=#abac84
hi htmlTagName			gui=NONE 		guifg=grey70        guibg=bg
hi lCursor				gui=NONE		guifg=#ffffff       guibg=#8800ff

"
" Tag List
"

hi MyTagListFileName      gui=underline   guifg=fg        guibg=grey25

"
" Perl
"

hi perlIdentifier			gui=NONE	guifg=#90c0c0	guibg=NONE
hi perlStatement			gui=NONE	guifg=#c0c090	guibg=NONE
hi perlStatementHash		gui=NONE	guifg=#c0c090	guibg=#404040
hi perlStatementNew			gui=NONE	guifg=#c0c090	guibg=#424242
hi perlMatchStartEnd		gui=NONE	guifg=#c0c090	guibg=#424242
hi perlVarPlain				gui=NONE	guifg=#74c5c6	guibg=bg
hi perlVarNotInMatches		gui=NONE	guifg=#915555	guibg=bg
hi perlVarPlain2			gui=NONE	guifg=#74c6a8	guibg=bg
hi perlFunctionName			gui=NONE	guifg=white 	guibg=bg
hi perlNumber				gui=NONE	guifg=#80ac7b	guibg=bg
hi perlQQ					gui=NONE	guifg=fg		guibg=#393939
hi perlSpecialString		gui=NONE	guifg=#dc966b	guibg=bg
hi perlSpecialMatch			gui=NONE	guifg=#c864c7	guibg=bg
hi perlSpecialBEOM			gui=NONE	guifg=fg		guibg=#404040
hi perlStringStartEnd		gui=NONE	guifg=#b07050	guibg=#353535
hi perlShellCommand			gui=NONE	guibg=#c090c0	guibg=#424242
hi perlOperator				gui=NONE	guifg=#c0c090	guibg=#404040
hi perlLabel				gui=NONE	guifg=#c0c090	guibg=#404040
hi perlControl				gui=NONE	guifg=#c0c090	guibg=#404040
hi perlSharpBang			gui=NONE	guifg=#c0c090	guibg=#505050
hi perlPackageDecl			gui=NONE	guifg=#80ac7b	guibg=#404040
hi perlStatementFiledesc	gui=NONE	guifg=#a2c090	guibg=bg
hi perlRepeat				gui=NONE	guifg=#c0b790	guibg=bg
hi perlStatementInclude 	gui=NONE 	guifg=#c0c090 	guibg=#3b4038
hi perlStatementControl		gui=NONE	guifg=#dcdb6b	guibg=bg
hi perlStatementSub 		gui=NONE 	guifg=#c0c090 	guibg=bg
hi perlVarSimpleMember		gui=NONE	guifg=#c0c090	guibg=bg
hi perlVarSimpleMemberName	gui=NONE	guifg=grey70	guibg=bg

" -------------------------------------------------------------------------------------------------
" perlStatementRegexp perlSpecialDollar perlSpecialStringU perlSubstitutionBracket
" perlTranslationBracket perlType perlStatementStorage perlStatementScalar
" perlStatementNumeric perlStatementList perlStatementIOfunc 
" perlStatementVector perlStatementFiles perlStatementFlow perlStatementScope
" perlStatementProc perlStatementSocket perlStatementIPC perlStatementNetwork perlStatementPword
" perlStatementTime perlStatementMisc perlStatementPackage perlList perlMisc
" perlVarSlash perlMethod perlFiledescRead perlFiledescStatement perlFormatName
" perlFloat perlString perlSubstitutionSQ perlSubstitutionDQ
" perlSubstitutionSlash perlSubstitutionHash perlSubstitutionCurly perlSubstitutionPling
" perlTranslationSlash perlTranslationHash perlTranslationCurly perlHereDoc perlFormatField
" perlStringUnexpanded perlCharacter perlSpecialAscii perlConditional perlInclude
" perlStorageClass perlPackageRef perlFunctionPRef
" -------------------------------------------------------------------------------------------------

"
" Omni Menu
"

hi Pmenu				guifg=grey10	guibg=grey50
hi PmenuSel				guifg=#abac84	guibg=#404040
hi PmenuSbar			guibg=grey20
hi PmenuThumb			guifg=grey30

"
" Right Margin
"

hi rightMargin          guibg=#453030

" EOF
