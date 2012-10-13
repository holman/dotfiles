" Tabular:     Align columnar data using regex-designated column boundaries
" Maintainer:  Matthew Wozniski (mjw@drexel.edu)
" Date:        Thu, 11 Oct 2007 00:35:34 -0400
" Version:     0.1

" Stupid vimscript crap                                                   {{{1
let s:savecpo = &cpo
set cpo&vim

" Private Functions                                                       {{{1

" Return the number of bytes in a string after expanding tabs to spaces.  {{{2
" This expansion is done based on the current value of 'tabstop'
function! s:Strlen(string)
  let rv = 0
  let i = 0

  for char in split(a:string, '\zs')
    if char == "\t"
      let rv += &ts - i
      let i = 0
    else
      let rv += 1
      let i = (i + 1) % &ts
    endif
  endfor

  return rv
endfunction

" Align a string within a field                                           {{{2
" These functions do not trim leading and trailing spaces.

" Right align 'string' in a field of size 'fieldwidth'
function! s:Right(string, fieldwidth)
  let spaces = a:fieldwidth - s:Strlen(a:string)
  return matchstr(a:string, '^\s*') . repeat(" ", spaces) . substitute(a:string, '^\s*', '', '')
endfunction

" Left align 'string' in a field of size 'fieldwidth'
function! s:Left(string, fieldwidth)
  let spaces = a:fieldwidth - s:Strlen(a:string)
  return a:string . repeat(" ", spaces)
endfunction

" Center align 'string' in a field of size 'fieldwidth'
function! s:Center(string, fieldwidth)
  let spaces = a:fieldwidth - s:Strlen(a:string)
  let right = spaces / 2
  let left = right + (right * 2 != spaces)
  return repeat(" ", left) . a:string . repeat(" ", right)
endfunction

" Remove spaces around a string                                           {{{2

" Remove all trailing spaces from a string.
function! s:StripTrailingSpaces(string)
  return matchstr(a:string, '^.\{-}\ze\s*$')
endfunction

" Remove all leading spaces from a string.
function! s:StripLeadingSpaces(string)
  return matchstr(a:string, '^\s*\zs.*$')
endfunction

" Split a string into fields and delimiters                               {{{2
" Like split(), but include the delimiters as elements
" All odd numbered elements are delimiters
" All even numbered elements are non-delimiters (including zero)
function! s:SplitDelim(string, delim)
  let rv = []
  let beg = 0
  let idx = 0

  let len = len(a:string)

  while 1
    let mid = match(a:string, a:delim, beg, 1)
    if mid == -1 || mid == len
      break
    endif

    let matchstr = matchstr(a:string, a:delim, beg, 1)
    let length = strlen(matchstr)

    if beg < mid
      let rv += [ a:string[beg : mid-1] ]
    else
      let rv += [ "" ]
    endif

    let beg = mid + length
    let idx = beg

    if beg == mid
      " Empty match, advance "beg" by one to avoid infinite loop
      let rv += [ "" ]
      let beg += 1
    else " beg > mid
      let rv += [ a:string[mid : beg-1] ]
    endif
  endwhile

  let rv += [ strpart(a:string, idx) ]

  return rv
endfunction

" Replace lines from `start' to `start + len - 1' with the given strings. {{{2
" If more lines are needed to show all strings, they will be added.
" If there are too few strings to fill all lines, lines will be removed.
function! s:SetLines(start, len, strings)
  if a:start > line('$') + 1 || a:start < 1
    throw "Invalid start line!"
  endif

  if len(a:strings) > a:len
    let fensave = &fen
    let view = winsaveview()
    call append(a:start + a:len - 1, repeat([''], len(a:strings) - a:len))
    call winrestview(view)
    let &fen = fensave
  elseif len(a:strings) < a:len
    let fensave = &fen
    let view = winsaveview()
    sil exe (a:start + len(a:strings)) . ',' .  (a:start + a:len - 1) . 'd_'
    call winrestview(view)
    let &fen = fensave
  endif

  call setline(a:start, a:strings)
endfunction

" Runs the given commandstring argument as an expression.                 {{{2
" The commandstring expression is expected to reference the a:lines argument.
" If the commandstring expression returns a list the items of that list will
" replace the items in a:lines, otherwise the expression is assumed to have
" modified a:lines itself.
function! s:FilterString(lines, commandstring)
  exe 'let rv = ' . a:commandstring

  if type(rv) == type(a:lines) && rv isnot a:lines
    call filter(a:lines, 0)
    call extend(a:lines, rv)
  endif
endfunction

" Public API                                                              {{{1

if !exists("g:tabular_default_format")
  let g:tabular_default_format = "l1"
endif

let s:formatelempat = '\%([lrc]\d\+\)'

function! tabular#ElementFormatPattern()
  return s:formatelempat
endfunction

" Given a list of strings and a delimiter, split each string on every
" occurrence of the delimiter pattern, format each element according to either
" the provided format (optional) or the default format, and join them back
" together with enough space padding to guarantee that the nth delimiter of
" each string is aligned.
function! tabular#TabularizeStrings(strings, delim, ...)
  if a:0 > 1
    echoerr "TabularizeStrings accepts only 2 or 3 arguments (got ".(a:0+2).")"
    return 1
  endif

  let formatstr = (a:0 ? a:1 : g:tabular_default_format)

  if formatstr !~? s:formatelempat . '\+'
    echoerr "Tabular: Invalid format \"" . formatstr . "\" specified!"
    return 1
  endif

  let format = split(formatstr, s:formatelempat . '\zs')

  let lines = map(a:strings, 's:SplitDelim(v:val, a:delim)')

  " Strip spaces
  "   - Only from non-delimiters; spaces in delimiters must have been matched
  "     intentionally
  "   - Don't strip leading spaces from the first element; we like indenting.
  for line in lines
    if line[0] !~ '^\s*$'
      let line[0] = s:StripTrailingSpaces(line[0])
    endif
    if len(line) >= 3
      for i in range(2, len(line)-1, 2)
        let line[i] = s:StripLeadingSpaces(s:StripTrailingSpaces(line[i]))
      endfor
    endif
  endfor

  " Find the max length of each field
  let maxes = []
  for line in lines
    for i in range(len(line))
      if i == len(maxes)
        let maxes += [ s:Strlen(line[i]) ]
      else
        let maxes[i] = max( [ maxes[i], s:Strlen(line[i]) ] )
      endif
    endfor
  endfor

  let lead_blank = empty(filter(copy(lines), 'v:val[0] =~ "\\S"'))

  " Concatenate the fields, according to the format pattern.
  for idx in range(len(lines))
    let line = lines[idx]
    for i in range(len(line))
      let how = format[i % len(format)][0]
      let pad = format[i % len(format)][1:-1]

      if how =~? 'l'
        let field = s:Left(line[i], maxes[i])
      elseif how =~? 'r'
        let field = s:Right(line[i], maxes[i])
      elseif how =~? 'c'
        let field = s:Center(line[i], maxes[i])
      endif

      let line[i] = field . (lead_blank && i == 0 ? '' : repeat(" ", pad))
    endfor

    let lines[idx] = s:StripTrailingSpaces(join(line, ''))
  endfor
endfunction

" Apply 0 or more filters, in sequence, to selected text in the buffer    {{{2
" The lines to be filtered are determined as follows:
"   If the function is called with a range containing multiple lines, then
"     those lines will be used as the range.
"   If the function is called with no range or with a range of 1 line, then
"     if "includepat" is not specified,
"       that 1 line will be filtered,
"     if "includepat" is specified and that line does not match it,
"       no lines will be filtered
"     if "includepat" is specified and that line does match it,
"       all contiguous lines above and below the specified line matching the
"       pattern will be filtered.
"
" The remaining arguments must each be a filter to apply to the text.
" Each filter must either be a String evaluating to a function to be called.
function! tabular#PipeRange(includepat, ...) range
  let top = a:firstline
  let bot = a:lastline

  if a:includepat != '' && top == bot
    if top < 0 || top > line('$') || getline(top) !~ a:includepat
      return
    endif
    while top > 1 && getline(top-1) =~ a:includepat
      let top -= 1
    endwhile
    while bot < line('$') && getline(bot+1) =~ a:includepat
      let bot += 1
    endwhile
  endif

  let lines = map(range(top, bot), 'getline(v:val)')

  for filter in a:000
    if type(filter) != type("")
      echoerr "PipeRange: Bad filter: " . string(filter)
    endif

    call s:FilterString(lines, filter)

    unlet filter
  endfor

  call s:SetLines(top, bot - top + 1, lines)
endfunction

" Stupid vimscript crap, part 2                                           {{{1
let &cpo = s:savecpo
unlet s:savecpo

" vim:set sw=2 sts=2 fdm=marker:
