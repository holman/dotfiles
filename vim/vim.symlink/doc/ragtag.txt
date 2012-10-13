*ragtag.txt*  Ghetto XML/HTML mappings (formerly allml.vim)

Author:  Tim Pope <vimNOSPAM@tpope.org>         *ragtag-author*
License: Same terms as Vim itself (see |license|)

This plugin is only available if 'compatible' is not set.

INTRODUCTION                                    *ragtag*

These are my personal mappings for XML/XHTML editing, particularly with
dynamic content like PHP/ASP/eRuby.  Because they are personal, less effort
has been put into customizability (if you like these mappings but the lack of
customizability poses an issue for you, let me know).  Examples shown are for
eRuby.

You might find these helpful in your vimrc:
>
        inoremap <M-o>       <Esc>o
        inoremap <C-j>       <Down>
        let g:ragtag_global_maps = 1
<
MAPPINGS                                        *ragtag-mappings*

The table below shows what happens if the binding is pressed on the end of a
line consisting of "foo".

Mapping       Changed to   (cursor = ^) ~
<C-X>=        foo<%= ^ %>                               *ragtag-CTRL-X_=*
<C-X>+        <%= foo^ %>                               *ragtag-CTRL-X_+*
<C-X>-        foo<% ^ %>                                *ragtag-CTRL-X_-*
<C-X>_        <% foo^ %>                                *ragtag-CTRL-X__*
<C-X>'        foo<%# ^ %>                               *ragtag-CTRL-X_'*
              (mnemonic: ' is a comment in ASP VBS)
<C-X>"        <%# foo^ %>                               *ragtag-CTRL-X_quote*
<C-X><Space>  <foo>^</foo>                              *ragtag-CTRL-X_<Space>*
<C-X><CR>     <foo>\n^\n</foo>                          *ragtag-CTRL-X_<CR>*
<C-X>/        Last HTML tag closed                      *ragtag-CTRL-X_/*
<C-X>!        <!DOCTYPE...>/<?xml ...?> (menu)          *ragtag-CTRL-X_!*
<C-X>@        <link rel="stylesheet" ...>               *ragtag-CTRL-X_@*
              (mnemonic: @ is used for importing in a CSS file)
<C-X>#        <meta http-equiv="Content-Type" ... />    *ragtag-CTRL-X_#*
<C-X>$        <script src="/javascripts/^.js"></script> *ragtag-CTRL-X_$*
              (mnemonic: $ is valid in javascript identifiers)

For the bindings that generate HTML tag pairs, in a few cases, attributes will
be automatically added.  For example, script becomes >
        <script type="text/javascript">
<
ENCODING                                        *ragtag-encoding*

This plugin used to provide a set of general purpose XML/URL encoding/decoding
mappings.  These mappings have been extracted to a (highly recommended) plugin
named unimpaired.vim.  Left behind were the following four insert mode
mappings (mostly useful as stupid party tricks).

                                                *ragtag-CTRL-V_%*
<Plug>ragtagUrlV        URL encode the next character.
<C-V>%

                                                *ragtag-CTRL-V_&*
<Plug>ragtagXmlV        XML encode the next character.
<C-V>&

                                                *ragtag-CTRL-X_%*
<Plug>ragtagUrlEncode   Toggle a mode that automatically URL encodes unsafe
<C-X>%                  characters.

                                                *ragtag-CTRL-X_&*
<Plug>ragtagXmlEncode   Toggle a mode that automatically XML encodes unsafe
<C-X>&                  characters.

SURROUNDINGS                                    *ragtag-surroundings*

Combined with surround.vim, you also get three "replacements".  Below, the ^
indicates the location of the wrapped text.  See |surround| for details.

Character     Replacement ~
-             <% ^ %>
=             <%= ^ %>
#             <%# ^ %>

 vim:tw=78:et:ft=help:norl:
