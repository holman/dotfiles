" Recalculate the trailing whitespace warning when idle, and after saving
autocmd CursorHold,BufWritePost,InsertLeave * unlet! b:statusline_trailing_space_warning

function! Powerline#Functions#GetFilepath() " {{{
	if exists('b:Powerline_filepath')
		return b:Powerline_filepath
	endif

	let dirsep = has('win32') && ! &shellslash ? '\' : '/'
	let filepath = expand('%:p')

	if empty(filepath)
		return ''
	endif

	let ret = ''

	if g:Powerline_stl_path_style == 'short'
		" Display a short path where the first directory is displayed with its
		" full name, and the subsequent directories are shortened to their
		" first letter, i.e. "/home/user/foo/foo/bar/baz.vim" becomes
		" "~/foo/f/b/baz.vim"
		"
		" This displays the shortest possible path, relative to ~ or the
		" current directory.
		let mod = (exists('+acd') && &acd) ? ':~:h' : ':~:.:h'
		let fpath = split(fnamemodify(filepath, mod), dirsep)
		let fpath_shortparts = map(fpath[1:], 'v:val[0]')
		let ret = join(extend([fpath[0]], fpath_shortparts), dirsep) . dirsep
	elseif g:Powerline_stl_path_style == 'relative'
		" Display a relative path, similar to the %f statusline item
		let ret = fnamemodify(filepath, ':.:h') . dirsep
	elseif g:Powerline_stl_path_style == 'full'
		" Display the full path, similar to the %F statusline item
		let ret = fnamemodify(filepath, ':h') . dirsep
	endif

	if ret == ('.' . dirsep)
		return ''
	endif

	let b:Powerline_filepath = ret
	return ret
endfunction " }}}
function! Powerline#Functions#GetShortPath(threshold) " {{{
	let fullpath = split(substitute(expand('%:p:h'), $HOME, '~', 'g'), '/')

	if len(fullpath) > a:threshold
		let fullpath = [fullpath[0], '…'] +  fullpath[-a:threshold + 1 :]
	endif

	return join(fullpath, '/')
endfunction " }}}
function! Powerline#Functions#GetMode() " {{{
	let mode = mode()

	if mode =~# '\v(v|V|)'
		" Visual mode
		if mode ==# 'v'
			let mode = 'VISUAL'
		elseif mode ==# 'V'
			let mode = 'V·LINE'
		elseif mode ==# ''
			let mode = 'V·BLOCK'
		endif
	elseif mode =~# '\v(s|S|)'
		" Select mode
		if mode ==# 's'
			let mode = 'SELECT'
		elseif mode ==# 'S'
			let mode = 'S·LINE'
		elseif mode ==# ''
			let mode = 'S·BLOCK'
		endif
	elseif mode =~# '\vi'
		let mode = 'INSERT' " Insert mode
	elseif mode =~# '\v(R|Rv)'
		let mode = 'REPLACE' " Replace mode
	else
		" Fallback to normal mode
		let mode = ' N ' " Normal (current)
	endif

	return mode
endfunction " }}}
function! Powerline#Functions#GetFilesize() " {{{
	let bytes = getfsize(expand("%:p"))

	if bytes <= 0
		return ''
	endif

	if bytes < 1024
		return bytes . 'B'
	else
		return (bytes / 1024) . 'kB'
	endif
endfunction "}}}
function! Powerline#Functions#GetCharCode() " {{{
	" Get the output of :ascii
	redir => ascii
	silent! ascii
	redir END

	if match(ascii, 'NUL') != -1
		return 'NUL'
	endif

	" Zero pad hex values
	let nrformat = '0x%02x'

	let encoding = (&fenc == '' ? &enc : &fenc)

	if encoding == 'utf-8'
		" Zero pad with 4 zeroes in unicode files
		let nrformat = '0x%04x'
	endif

	" Get the character and the numeric value from the return value of :ascii
	" This matches the two first pieces of the return value, e.g.
	" "<F>  70" => char: 'F', nr: '70'
	let [str, char, nr; rest] = matchlist(ascii, '\v\<(.{-1,})\>\s*([0-9]+)')

	" Format the numeric value
	let nr = printf(nrformat, nr)

	return "'". char ."' ". nr
endfunction "}}}
function! Powerline#Functions#GetWSMarker() " {{{
	" Return '...' if trailing white space is detected
	" Return '' otherwise
	if ! exists("b:statusline_trailing_space_warning")
		if search('\s$', 'nw') != 0
			let b:statusline_trailing_space_warning = ' … '
		else
			let b:statusline_trailing_space_warning = ''
		endif
	endif
	return b:statusline_trailing_space_warning
endfunction " }}}
