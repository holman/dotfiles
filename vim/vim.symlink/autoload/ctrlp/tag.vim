" =============================================================================
" File:          autoload/ctrlp/tag.vim
" Description:   Tag file extension
" Author:        Kien Nguyen <github.com/kien>
" =============================================================================

" Init {{{1
if exists('g:loaded_ctrlp_tag') && g:loaded_ctrlp_tag
	fini
en
let g:loaded_ctrlp_tag = 1

cal add(g:ctrlp_ext_vars, {
	\ 'init': 'ctrlp#tag#init()',
	\ 'accept': 'ctrlp#tag#accept',
	\ 'lname': 'tags',
	\ 'sname': 'tag',
	\ 'enter': 'ctrlp#tag#enter()',
	\ 'type': 'tabs',
	\ })

let s:id = g:ctrlp_builtins + len(g:ctrlp_ext_vars)
" Utilities {{{1
fu! s:findcount(str)
	let [tg, fname] = split(a:str, '\t\+\ze[^\t]\+$')
	let [fname, tgs] = [expand(fname, 1), taglist('^'.tg.'$')]
	if empty(tgs) | retu [1, 1] | en
	let [fnd, ct, pos] = [0, 0, 0]
	for each in tgs
		let ct += 1
		let fulname = fnamemodify(each["filename"], ':p')
		if stridx(fulname, fname) >= 0
			\ && strlen(fname) + stridx(fulname, fname) == strlen(fulname)
			let fnd += 1
			let pos = ct
		en
		if fnd > 1 | brea | en
	endfo
	retu [fnd, pos]
endf

fu! s:filter(tags)
	let [nr, alltags] = [0, a:tags]
	wh 0 < 1
		if alltags[nr] =~ '^!' && alltags[nr] !~ '^!_TAG_'
			let nr += 1
			con
		en
		if alltags[nr] =~ '^!_TAG_' && len(alltags) > nr
			cal remove(alltags, nr)
		el
			brea
		en
	endw
	retu alltags
endf

fu! s:syntax()
	if !ctrlp#nosy()
		cal ctrlp#hicheck('CtrlPTabExtra', 'Comment')
		sy match CtrlPTabExtra '\zs\t.*\ze$'
	en
endf
" Public {{{1
fu! ctrlp#tag#init()
	if empty(s:tagfiles) | retu [] | en
	let g:ctrlp_alltags = []
	let tagfiles = sort(filter(s:tagfiles, 'count(s:tagfiles, v:val) == 1'))
	for each in tagfiles
		let alltags = s:filter(ctrlp#utils#readfile(each))
		cal extend(g:ctrlp_alltags, alltags)
	endfo
	cal s:syntax()
	retu g:ctrlp_alltags
endf

fu! ctrlp#tag#accept(mode, str)
	cal ctrlp#exit()
	let str = matchstr(a:str, '^[^\t]\+\t\+[^\t]\+\ze\t')
	let [tg, fnd] = [split(str, '^[^\t]\+\zs\t')[0], s:findcount(str)]
	let cmds = {
		\ 't': ['tab sp', 'tab stj'],
		\ 'h': ['sp', 'stj'],
		\ 'v': ['vs', 'vert stj'],
		\ 'e': ['', 'tj'],
		\ }
	let cmd = fnd[0] == 1 ? cmds[a:mode][0] : cmds[a:mode][1]
	let cmd = cmd == 'tj' && &modified ? 'hid '.cmd : cmd
	let cmd = cmd =~ '^tab' ? tabpagenr('$').cmd : cmd
	if fnd[0] == 1
		if cmd != ''
			exe cmd
		en
		exe fnd[1].'ta' tg
	el
		exe cmd tg
	en
	cal ctrlp#setlcdir()
endf

fu! ctrlp#tag#id()
	retu s:id
endf

fu! ctrlp#tag#enter()
	let tfs = tagfiles()
	let s:tagfiles = tfs != [] ? filter(map(tfs, 'fnamemodify(v:val, ":p")'),
		\ 'filereadable(v:val)') : []
endf
"}}}

" vim:fen:fdm=marker:fmr={{{,}}}:fdl=0:fdc=1:ts=2:sw=2:sts=2
