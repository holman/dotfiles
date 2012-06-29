" =============================================================================
" File:          autoload/ctrlp/rtscript.vim
" Description:   Runtime scripts extension
" Author:        Kien Nguyen <github.com/kien>
" =============================================================================

" Init {{{1
if exists('g:loaded_ctrlp_rtscript') && g:loaded_ctrlp_rtscript
	fini
en
let [g:loaded_ctrlp_rtscript, g:ctrlp_newrts] = [1, 0]

cal add(g:ctrlp_ext_vars, {
	\ 'init': 'ctrlp#rtscript#init()',
	\ 'accept': 'ctrlp#acceptfile',
	\ 'lname': 'runtime scripts',
	\ 'sname': 'rts',
	\ 'type': 'path',
	\ 'opmul': 1,
	\ })

let s:id = g:ctrlp_builtins + len(g:ctrlp_ext_vars)
" Public {{{1
fu! ctrlp#rtscript#init()
	if g:ctrlp_newrts
		\ || !( exists('g:ctrlp_rtscache') && g:ctrlp_rtscache[0] == &rtp )
		sil! cal ctrlp#progress('Indexing...')
		let entries = split(globpath(&rtp, '**/*.*'), "\n")
		cal filter(entries, 'count(entries, v:val) == 1')
		let [entries, echoed] = [ctrlp#dirnfile(entries)[1], 1]
	el
		let [entries, results] = g:ctrlp_rtscache[2:3]
	en
	let cwd = getcwd()
	if g:ctrlp_newrts
		\ || !( exists('g:ctrlp_rtscache') && g:ctrlp_rtscache[:1] == [&rtp, cwd] )
		if !exists('echoed') | sil! cal ctrlp#progress('Processing...') | en
		let results = map(copy(entries), 'fnamemodify(v:val, '':.'')')
	en
	let [g:ctrlp_rtscache, g:ctrlp_newrts] = [[&rtp, cwd, entries, results], 0]
	retu results
endf

fu! ctrlp#rtscript#id()
	retu s:id
endf
"}}}

" vim:fen:fdm=marker:fmr={{{,}}}:fdl=0:fdc=1:ts=2:sw=2:sts=2
