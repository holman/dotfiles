" Mustache indent
" Language:	Mustache
" Maintainer:	Juvenn Woo <machese@gmail.com>
" Version:	2
" Last Change:	Jan. 16th 2011

" Only load this indent file when no other was loaded.
if exists("b:did_indent")
  finish
endif

" Use HTML formatting rules.
runtime! indent/html.vim
