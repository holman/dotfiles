" It will read your .gitignore file from the directory where you launch vim and
" parse it, transforming its format into one suitable for wildignore, and then
" set that option.  Thus, tab-completion won't present those files as options
" when using vim commands that expect a filename.
"
" http://www.vim.org/scripts/script.php?script_id=2557

let filename = '.gitignore'
if filereadable(filename)
    let igstring = ''
    for oline in readfile(filename)
        let line = substitute(oline, '\s|\n|\r', '', "g")
        if line =~ '^#' | con | endif
        if line == '' | con  | endif
        if line =~ '^!' | con  | endif
        if line =~ '/$' | let igstring .= "," . line . "*" | con | endif
        let igstring .= "," . line
    endfor
    let igstring = substitute(igstring, "^,\/", '', "g")
    let execstring = "set wildignore=".substitute(igstring, '^,', '', "g")
    execute execstring
endif
