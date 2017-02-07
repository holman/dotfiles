let [s:single_quote, s:double_quote, s:no_match] = [1,2,0]

function! surrounded#Requote() abort
    let matched_quote = s:no_match
    let [column, line] = [virtcol('.'), getline('.')]
    let offset = 1
    while offset < 30
        let matched_quote = s:QuoteStyle(line, column, offset)
        if matched_quote
            call s:SwapSurroundingQuotes(matched_quote)
            break
        endif
        let offset += 1
    endwhile
endfunction

function! s:SwapSurroundingQuotes(current_quote)
    if a:current_quote != s:single_quote && a:current_quote != s:double_quote
        return
    endif
    call s:CacheCursorLocation()
    let quote_sequence = a:current_quote == s:single_quote ? "'\"" : "\"'"
    execute "normal cs" . quote_sequence
    call s:RestoreCursorLocation()
endfunction

function! s:QuoteStyle(line, column, offset)
    let left_character = a:line[a:column - a:offset - 1]
    let right_character = a:line[a:column + a:offset - 1]
    if left_character == "'" || right_character == "'"
        return s:single_quote
    elseif left_character == '"' || right_character == '"'
        return s:double_quote
    endif
    return s:no_match
endfunction

function! s:CacheCursorLocation()
    execute "normal mm"
endfunction

function! s:RestoreCursorLocation()
    execute "normal `m"
endfunction
