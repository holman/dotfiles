
map j gj
map k gk

map sc z=

nnoremap <A-t> i<C-x><C-t>
inoremap <A-t> <C-x><C-t>

set spell spelllang=en_us
set thesaurus+=~/mthesaur.txt

set formatoptions=1
set lbr

iab teh the
iab alot a lot
iab noone no one
iab i I

hi SpellBad guibg=#000000
hi SpellLocal guibg=#0000ff
hi SpellRare guibg=#ff0000
hi SpellCap guibg=#00ff00

iab a/ á
iab e/ é
iab i/ í
iab o/ ó
iab u/ ú
iab n~ ñ


syn match homonyms "[Tt]hen\|[Tt]han\|[Ww]eather\|[Ww]hether\|[Ee]ffect\|[Aa]ffect\|[Ii]t\'s\|[Ii]ts\|[Ww]ho\|[Ww]hom\|[Yy]our\|[Yy]ou\'re\|[Tt]heir\|[Tt]hey\'re\|[Tt]here\|[Ll]ose\|[Ll]oose\|[Ll]ie\|[Ll]ay\|[Ll]ain\|[Ll]ay\|[Ll]aid\|[Ff]urther\|[Ff]arther\|[Ll]ying\|[Ll]aying\|[Tt]oo\|[Tt]o\|[Tt]wo"

hi homonyms guibg=#999999
