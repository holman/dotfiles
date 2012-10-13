"=============================================================================
" File: gist.vim
" Author: Yasuhiro Matsumoto <mattn.jp@gmail.com>
" Last Change: 13-Dec-2010.
" Version: 4.6
" WebPage: http://github.com/mattn/gist-vim
" License: BSD
" Usage:
"
"   :Gist
"     post whole text to gist.
"
"   :'<,'>Gist
"     post selected text to gist.
"
"   :Gist -p
"     post whole text to gist with private.
"     if you got empty gist list, try :Gist --abandon
"
"   :Gist -a
"     post whole text to gist with anonymous.
"
"   :Gist -m
"     post multi buffer to gist.
"
"   :Gist -e
"     edit the gist. (shoud be work on gist buffer)
"     you can update the gist with :w command on gist buffer.
"
"   :Gist -d
"     delete the gist. (should be work on gist buffer)
"     password authentication is needed.
"
"   :Gist -f
"     fork the gist. (should be work on gist buffer)
"     password authentication is needed.
"
"   :Gist -e foo.js
"     edit the gist with name 'foo.js'. (shoud be work on gist buffer)
"
"   :Gist XXXXX
"     edit gist XXXXX.
"
"   :Gist -c XXXXX.
"     get gist XXXXX and put to clipboard.
"
"   :Gist -l
"     list gists from mine.
"
"   :Gist -l mattn
"     list gists from mattn.
"
"   :Gist -la
"     list gists from all.
"
" Tips:
"   * if set g:gist_clip_command, gist.vim will copy the gist code
"       with option '-c'.
"
"     # mac
"     let g:gist_clip_command = 'pbcopy'
"
"     # linux
"     let g:gist_clip_command = 'xclip -selection clipboard'
"
"     # others(cygwin?)
"     let g:gist_clip_command = 'putclip'
"
"   * if you want to detect filetype from gist's filename...
"
"     # detect filetype if vim failed auto-detection.
"     let g:gist_detect_filetype = 1
"
"     # detect filetype always.
"     let g:gist_detect_filetype = 2
"
"   * if you want to open browser after the post...
"
"     let g:gist_open_browser_after_post = 1
"
"   * if you want to change the browser...
"
"     let g:gist_browser_command = 'w3m %URL%'
"
"       or
"
"     let g:gist_browser_command = 'opera %URL% &'
"
"     on windows, should work with original setting.
"
"   * if you want to show your private gists with ':Gist -l'
"
"     let g:gist_show_privates = 1
"
" Thanks:
"   MATSUU Takuto:
"     removed carriage return
"     gist_browser_command enhancement
"     edit support
"
" GetLatestVimScripts: 2423 1 :AutoInstall: gist.vim
" script type: plugin

if &cp || (exists('g:loaded_gist_vim') && g:loaded_gist_vim)
  finish
endif
let g:loaded_gist_vim = 1

if (!exists('g:github_user') || !exists('g:github_token')) && !executable('git')
  echoerr "Gist: require 'git' command"
  finish
endif

if !executable('curl')
  echoerr "Gist: require 'curl' command"
  finish
endif

if !exists('g:gist_open_browser_after_post')
  let g:gist_open_browser_after_post = 0
endif

if !exists('g:gist_put_url_to_clipboard_after_post')
  let g:gist_put_url_to_clipboard_after_post = 1
endif

if !exists('g:gist_browser_command')
  if has('win32')
    let g:gist_browser_command = "!start rundll32 url.dll,FileProtocolHandler %URL%"
  elseif has('mac')
    let g:gist_browser_command = "open %URL%"
  elseif executable('xdg-open')
    let g:gist_browser_command = "xdg-open %URL%"
  else
    let g:gist_browser_command = "firefox %URL% &"
  endif
endif

if !exists('g:gist_detect_filetype')
  let g:gist_detect_filetype = 0
endif

if !exists('g:gist_show_privates')
  let g:gist_show_privates = 0
endif

function! s:nr2hex(nr)
  let n = a:nr
  let r = ""
  while n
    let r = '0123456789ABCDEF'[n % 16] . r
    let n = n / 16
  endwhile
  return r
endfunction

function! s:encodeURIComponent(instr)
  let instr = iconv(a:instr, &enc, "utf-8")
  let len = strlen(instr)
  let i = 0
  let outstr = ''
  while i < len
    let ch = instr[i]
    if ch =~# '[0-9A-Za-z-._~!''()*]'
      let outstr = outstr . ch
    elseif ch == ' '
      let outstr = outstr . '+'
    else
      let outstr = outstr . '%' . substitute('0' . s:nr2hex(char2nr(ch)), '^.*\(..\)$', '\1', '')
    endif
    let i = i + 1
  endwhile
  return outstr
endfunction

function! s:GistList(user, token, gistls, page)
  if a:gistls == '-all'
    let url = 'https://gist.github.com/gists'
  elseif g:gist_show_privates && a:gistls == a:user
    let url = 'https://gist.github.com/mine'
  else
    let url = 'https://gist.github.com/'.a:gistls
  endif
  let winnum = bufwinnr(bufnr('gist:'.a:gistls))
  if winnum != -1
    if winnum != bufwinnr('%')
      exe "normal \<c-w>".winnum."w"
    endif
    setlocal modifiable
  else
    exec 'silent split gist:'.a:gistls
  endif
  if a:page > 1
    let oldlines = getline(0, line('$'))
    let url = url . '?page=' . a:page
  endif

  setlocal foldmethod=manual
  let oldlines = []
  if g:gist_show_privates
    echon 'Login to gist... '
    silent %d _
    let res = s:GistGetPage(url, a:user, '', '-L')
    silent put =res.content
  else
    silent %d _
    exec 'silent r! curl -s '.url
  endif

  silent normal! ggdd
  silent! %s/>/>\r/g
  silent! %s/</\r</g
  silent! %g/<pre/,/<\/pre/join!
  silent! %g/<span class="date"/,/<\/span/join
  silent! %g/^<span class="date"/s/> */>/g
  silent! %v/^\(gist:\|<pre>\|<span class="date">\)/d _
  silent! %s/<div[^>]*>/\r  /g
  silent! %s/<\/pre>/\r/g
  silent! %g/^gist:/,/<span class="date"/join
  silent! %s/<[^>]\+>//g
  silent! %s/\r//g
  silent! %s/&nbsp;/ /g
  silent! %s/&quot;/"/g
  silent! %s/&amp;/\&/g
  silent! %s/&gt;/>/g
  silent! %s/&lt;/</g
  silent! %s/&#\(\d\d\);/\=nr2char(submatch(1))/g
  silent! %g/^gist: /s/ //g

  call append(0, oldlines)
  normal! Gomore...

  let b:user = a:user
  let b:token = a:token
  let b:gistls = a:gistls
  let b:page = a:page
  setlocal buftype=nofile bufhidden=hide noswapfile
  setlocal nomodified
  syntax match SpecialKey /^gist:/he=e-1
  exec 'nnoremap <silent> <buffer> <cr> :call <SID>GistListAction()<cr>'

  cal cursor(1+len(oldlines),1)
  setlocal foldmethod=expr
  setlocal foldexpr=getline(v:lnum)=~'^\\(gist:\\\|more\\)'?'>1':'='
  setlocal foldtext=getline(v:foldstart)
endfunction

function! s:GistGetFileName(gistid)
  let url = 'https://gist.github.com/'.a:gistid
  let res = system('curl -s '.url)
  let res = substitute(res, '^.*<a href="/raw/[^"]\+/\([^"]\+\)".*$', '\1', '')
  if res =~ '/'
    return ''
  else
    return res
  endif
endfunction

function! s:GistDetectFiletype(gistid)
  let url = 'https://gist.github.com/'.a:gistid
  let mx = '^.*<div class="data syntax type-\([^"]\+\)">.*$'
  let res = system('curl -s '.url)
  let res = substitute(matchstr(res, mx), mx, '\1', '')
  let res = substitute(res, '.*\(\.[^\.]\+\)$', '\1', '')
  let res = substitute(res, '-', '', 'g')
  " TODO: more filetype detection that is specified in html.
  if res == 'bat' | let res = 'dosbatch' | endif
  if res == 'as' | let res = 'actionscript' | endif
  if res == 'bash' | let res = 'sh' | endif
  if res == 'cl' | let res = 'lisp' | endif
  if res == 'rb' | let res = 'ruby' | endif
  if res == 'viml' | let res = 'vim' | endif
  if res == 'plain' || res == 'text' | let res = '' | endif

  if res =~ '^\.'
    silent! exec "doau BufRead *".res
  else
    silent! exec "setlocal ft=".tolower(res)
  endif
endfunction

function! s:GistWrite(fname)
  if substitute(a:fname, '\\', '/', 'g') == expand("%:p:gs@\\@/@")
    Gist -e
  else
    exe "w".(v:cmdbang ? "!" : "")." ".fnameescape(v:cmdarg)." ".fnameescape(a:fname)
  endif
endfunction

function! s:GistGet(user, token, gistid, clipboard)
  let url = 'https://gist.github.com/'.a:gistid.'.txt'
  let winnum = bufwinnr(bufnr('gist:'.a:gistid))
  if winnum != -1
    if winnum != bufwinnr('%')
      exe "normal \<c-w>".winnum."w"
    endif
    setlocal modifiable
  else
    exec 'silent split gist:'.a:gistid
  endif
  filetype detect
  silent %d _
  exec 'silent 0r! curl -s '.url
  normal! Gd_
  setlocal buftype=acwrite bufhidden=delete noswapfile
  setlocal nomodified
  doau StdinReadPost <buffer>
  if (&ft == '' && g:gist_detect_filetype == 1) || g:gist_detect_filetype == 2
    call s:GistDetectFiletype(a:gistid)
  endif
  if a:clipboard
    if exists('g:gist_clip_command')
      exec 'silent w !'.g:gist_clip_command
    else
      normal! gg"+yG
    endif
  endif
  normal! gg
  au! BufWriteCmd <buffer> call s:GistWrite(expand("<amatch>"))
endfunction

function! s:GistListAction()
  let line = getline('.')
  let mx = '^gist:\(\w\+\).*'
  if line =~# mx
    let gistid = substitute(line, mx, '\1', '')
    call s:GistGet(g:github_user, g:github_token, gistid, 0)
    return
  endif
  if line =~# '^more\.\.\.$'
    normal! dd
    call s:GistList(b:user, b:token, b:gistls, b:page+1)
    return
  endif
endfunction

function! s:GistUpdate(user, token, content, gistid, gistnm)
  if len(a:gistnm) == 0
    let name = s:GistGetFileName(a:gistid)
  else
    let name = a:gistnm
  endif
  let namemx = '^[^.]\+\(.\+\)$'
  let ext = ''
  if name =~ namemx
    let ext = substitute(name, namemx, '\1', '')
  endif
  let query = [
    \ '_method=put',
    \ 'file_ext[gistfile1%s]=%s',
    \ 'file_name[gistfile1%s]=%s',
    \ 'file_contents[gistfile1%s]=%s',
    \ 'login=%s',
    \ 'token=%s',
    \ ]
  let squery = printf(join(query, '&'),
    \ s:encodeURIComponent(ext), s:encodeURIComponent(ext),
    \ s:encodeURIComponent(ext), s:encodeURIComponent(name),
    \ s:encodeURIComponent(ext), s:encodeURIComponent(a:content),
    \ s:encodeURIComponent(a:user),
    \ s:encodeURIComponent(a:token))
  unlet query

  let file = tempname()
  call writefile([squery], file)
  echon 'Updating it to gist... '
  let quote = &shellxquote == '"' ?  "'" : '"'
  let url = 'https://gist.github.com/gists/'.a:gistid
  let res = system('curl -i -d @'.quote.file.quote.' '.url)
  call delete(file)
  let res = matchstr(split(res, '\(\r\?\n\|\r\n\?\)'), '^Location: ')
  let res = substitute(res, '^[^:]\+: ', '', '')
  if len(res) > 0 && res =~ '^\(http\|https\):\/\/gist\.github\.com\/'
    setlocal nomodified
    echo 'Done: '.res
  else
    echoerr 'Edit failed'
  endif
  return res
endfunction

let s:cookiedir = substitute(expand('<sfile>:p:h'), '[/\\]plugin$', '', '').'/cookies'
function! s:GistGetPage(url, user, param, opt)
  if !isdirectory(s:cookiedir)
    call mkdir(s:cookiedir, 'p')
  endif
  let cookiefile = s:cookiedir.'/github'

  if len(a:url) == 0
    call delete(cookiefile)
    return
  endif

  let quote = &shellxquote == '"' ?  "'" : '"'
  if !filereadable(cookiefile)
    let password = inputsecret('Password:')
    if len(password) == 0
      echo 'Canceled'
      return
    endif
    let url = 'https://gist.github.com/login?return_to=gist'
    let res = system('curl -L -s -k -c '.quote.cookiefile.quote.' '.quote.url.quote)
    let token = substitute(res, '^.* name="authenticity_token" type="hidden" value="\([^"]\+\)".*$', '\1', '')

    let query = [
      \ 'authenticity_token=%s',
      \ 'login=%s',
      \ 'password=%s',
      \ 'return_to=gist',
      \ 'commit=Log+in',
      \ ]
    let squery = printf(join(query, '&'),
      \ s:encodeURIComponent(token),
      \ s:encodeURIComponent(a:user),
      \ s:encodeURIComponent(password))
    unlet query

    let file = tempname()
    let command = 'curl -s -k -i'
    let command .= ' -b '.quote.cookiefile.quote
    let command .= ' -c '.quote.cookiefile.quote
    let command .= ' '.quote.'https://gist.github.com/session'.quote
    let command .= ' -d @' . quote.file.quote
    call writefile([squery], file)
    let res = system(command)
    call delete(file)
    let res = matchstr(split(res, '\(\r\?\n\|\r\n\?\)'), '^Location: ')
    let res = substitute(res, '^[^:]\+: ', '', '')
    if len(res) == 0
      call delete(cookiefile)
      return ''
    endif
  endif
  let command = 'curl -s -k -i '.a:opt
  if len(a:param)
    let command .= ' -d '.quote.a:param.quote
  endif
  let command .= ' -b '.quote.cookiefile.quote
  let command .= ' '.quote.a:url.quote
  let res = iconv(system(command), "utf-8", &encoding)
  let pos = stridx(res, "\r\n\r\n")
  if pos != -1
    let content = res[pos+4:]
  else
    let pos = stridx(res, "\n\n")
    let content = res[pos+2:]
  endif
  return {
  \ "header" : split(res[0:pos], '\r\?\n'),
  \ "content" : content
  \}
endfunction

function! s:GistDelete(user, token, gistid)
  echon 'Deleting gist... '
  let res = s:GistGetPage('https://gist.github.com/'.a:gistid, a:user, '', '')
  let mx = '^.* name="authenticity_token" type="hidden" value="\([^"]\+\)".*$'
  let token = substitute(matchstr(res.content, mx), mx, '\1', '')
  if len(token) > 0
    let res = s:GistGetPage('https://gist.github.com/delete/'.a:gistid, a:user, '_method=delete&authenticity_token='.token, '')
    if len(res.content) > 0
      echo 'Done: '
    else
      echoerr 'Delete failed'
    endif
  else
    echoerr 'Delete failed'
  endif
endfunction


" GistPost function:
"   Post new gist to github
"
"   if there is an embedded gist url or gist id in your file,
"   it will just update it.
"                                                   -- by c9s
"
"   embedded gist url format:
"
"       Gist: https://gist.github.com/123123
"
"   embedded gist id format:
"
"       GistID: 123123
"
function! s:GistPost(user, token, content, private)

  " find GistID: in content , then we should just update
  for l in split( a:content , "\n" )
    if l =~ '\<GistID:'
      let gistid = matchstr( l , 'GistID:\s*\zs\d\+')

      if strlen(gistid) == 0
        echohl WarningMsg | echo "GistID error" | echohl None
        return
      endif
      echo "Found GistID: " . gistid

      cal s:GistUpdate( a:user , a:token ,  a:content , gistid , '' )
      return
    elseif l =~ '\<Gist:'
      let gistid = matchstr( l , 'Gist:\s*https://gist.github.com/\zs\d\+')

      if strlen(gistid) == 0
        echohl WarningMsg | echo "GistID error" | echohl None
        return
      endif
      echo "Found GistID: " . gistid

      cal s:GistUpdate( a:user , a:token ,  a:content , gistid , '' )
      return
    endif
  endfor

  let ext = expand('%:e')
  let ext = len(ext) ? '.'.ext : ''
  let name = expand('%:t')

  let query = [
    \ 'file_ext[gistfile1]=%s',
    \ 'file_name[gistfile1]=%s',
    \ 'file_contents[gistfile1]=%s',
    \ ]

  if len(a:user) > 0 && len(a:token) > 0
    call add(query, 'login=%s')
    call add(query, 'token=%s')
  else
    call add(query, '%.0s%.0s')
  endif

  if a:private
    call add(query, 'action_button=private')
  endif
  let squery = printf(join(query, '&'),
    \ s:encodeURIComponent(ext),
    \ s:encodeURIComponent(name),
    \ s:encodeURIComponent(a:content),
    \ s:encodeURIComponent(a:user),
    \ s:encodeURIComponent(a:token))
  unlet query

  let file = tempname()
  call writefile([squery], file)
  echon 'Posting it to gist... '
  let quote = &shellxquote == '"' ?  "'" : '"'
  let url = 'https://gist.github.com/gists'
  let res = system('curl -i -d @'.quote.file.quote.' '.url)
  call delete(file)
  let res = matchstr(split(res, '\(\r\?\n\|\r\n\?\)'), '^Location: ')
  let res = substitute(res, '^[^:]\+: ', '', '')
  if len(res) > 0 && res =~ '^\(http\|https\):\/\/gist\.github\.com\/'
    echo 'Done: '.res
  else
    echoerr 'Post failed'
  endif
  return res
endfunction

function! s:GistPostBuffers(user, token, private)
  let bufnrs = range(1, last_buffer_nr())
  let bn = bufnr('%')
  let query = []
  if len(a:user) > 0 && len(a:token) > 0
    call add(query, 'login=%s')
    call add(query, 'token=%s')
  else
    call add(query, '%.0s%.0s')
  endif
  if a:private
    call add(query, 'action_button=private')
  endif
  let squery = printf(join(query, "&"),
    \ s:encodeURIComponent(a:user),
    \ s:encodeURIComponent(a:token)) . '&'

  let query = [
    \ 'file_ext[gistfile]=%s',
    \ 'file_name[gistfile]=%s',
    \ 'file_contents[gistfile]=%s',
    \ ]
  let format = join(query, "&") . '&'

  let index = 1
  for bufnr in bufnrs
    if buflisted(bufnr) == 0 || bufwinnr(bufnr) == -1
      continue
    endif
    echo "Creating gist content".index."... "
    silent! exec "buffer! ".bufnr
    let content = join(getline(1, line('$')), "\n")
    let ext = expand('%:e')
    let ext = len(ext) ? '.'.ext : ''
    let name = expand('%:t')
    let squery .= printf(substitute(format, 'gistfile', 'gistfile'.index, 'g'),
      \ s:encodeURIComponent(ext),
      \ s:encodeURIComponent(name),
      \ s:encodeURIComponent(content))
    let index = index + 1
  endfor
  silent! exec "buffer! ".bn

  let file = tempname()
  call writefile([squery], file)
  echo "Posting it to gist... "
  let quote = &shellxquote == '"' ?  "'" : '"'
  let url = 'https://gist.github.com/gists'
  let res = system('curl -i -d @'.quote.file.quote.' '.url)
  call delete(file)
  let res = matchstr(split(res, '\(\r\?\n\|\r\n\?\)'), '^Location: ')
  let res = substitute(res, '^.*: ', '', '')
  if len(res) > 0 && res =~ '^\(http\|https\):\/\/gist\.github\.com\/'
    echo 'Done: '.res
  else
    echoerr 'Post failed'
  endif
  return res
endfunction

function! Gist(line1, line2, ...)
  if !exists('g:github_user')
    let g:github_user = substitute(system('git config --global github.user'), "\n", '', '')
    if strlen(g:github_user) == 0
      let g:github_user = $GITHUB_USER
    end
  endif
  if !exists('g:github_token')
    let g:github_token = substitute(system('git config --global github.token'), "\n", '', '')
    if strlen(g:github_token) == 0
      let g:github_token = $GITHUB_TOKEN
    end
  endif
  if strlen(g:github_user) == 0 || strlen(g:github_token) == 0
    echoerr "You have no setting for github."
    echohl WarningMsg
    echo "git config --global github.user  your-name"
    echo "git config --global github.token your-token"
    echo "or set g:github_user and g:github_token in your vimrc"
    echo "or set shell env vars GITHUB_USER and GITHUB_TOKEN"
    echohl None
    return 0
  end

  let bufname = bufname("%")
  let user = g:github_user
  let token = g:github_token
  let gistid = ''
  let gistls = ''
  let gistnm = ''
  let private = 0
  let multibuffer = 0
  let clipboard = 0
  let deletepost = 0
  let editpost = 0
  let listmx = '^\(-l\|--list\)\s*\([^\s]\+\)\?$'
  let bufnamemx = '^gist:\([0-9a-f]\+\)$'

  let args = (a:0 > 0) ? split(a:1, ' ') : []
  for arg in args
    if arg =~ '^\(-la\|--listall\)$'
      let gistls = '-all'
    elseif arg =~ '^\(-l\|--list\)$'
      if g:gist_show_privates
        let gistls = 'mine'
      else
        let gistls = g:github_user
      endif
    elseif arg == '--abandon'
      call s:GistGetPage('', '', '', '')
      return
    elseif arg =~ '^\(-m\|--multibuffer\)$'
      let multibuffer = 1
    elseif arg =~ '^\(-p\|--private\)$'
      let private = 1
    elseif arg =~ '^\(-a\|--anonymous\)$'
      let user = ''
      let token = ''
    elseif arg =~ '^\(-c\|--clipboard\)$'
      let clipboard = 1
    elseif arg =~ '^\(-d\|--delete\)$' && bufname =~ bufnamemx
      let deletepost = 1
      let gistid = substitute(bufname, bufnamemx, '\1', '')
    elseif arg =~ '^\(-e\|--edit\)$' && bufname =~ bufnamemx
      let editpost = 1
      let gistid = substitute(bufname, bufnamemx, '\1', '')
    elseif arg =~ '^\(-f\|--fork\)$' && bufname =~ bufnamemx
      let gistid = substitute(bufname, bufnamemx, '\1', '')
      let res = s:GistGetPage("https://gist.github.com/fork/".gistid, g:github_user, '', '')
      let loc = filter(res.header, 'v:val =~ "^Location:"')[0]
      let loc = substitute(loc, '^[^:]\+: ', '', '')
      let mx = '^https://gist.github.com/\(\d\+\)$'
      if loc =~ mx
        let gistid = substitute(loc, mx, '\1', '')
      else
        echoerr 'Fork failed'
        return
      endif
    elseif arg !~ '^-' && len(gistnm) == 0
      if editpost == 1 || deletepost == 1
        let gistnm = arg
      elseif len(gistls) > 0 && arg != '^\w\+$'
        let gistls = arg
      elseif arg =~ '^\d\+$'
        let gistid = arg
      else
        echoerr 'Invalid arguments'
        unlet args
        return 0
      endif
    elseif len(arg) > 0
      echoerr 'Invalid arguments'
      unlet args
      return 0
    endif
  endfor
  unlet args
  "echo "gistid=".gistid
  "echo "gistls=".gistls
  "echo "gistnm=".gistnm
  "echo "private=".private
  "echo "clipboard=".clipboard
  "echo "editpost=".editpost
  "echo "deletepost=".deletepost

  if len(gistls) > 0
    call s:GistList(user, token, gistls, 1)
  elseif len(gistid) > 0 && editpost == 0 && deletepost == 0
    call s:GistGet(user, token, gistid, clipboard)
  else
    let url = ''
    if multibuffer == 1
      let url = s:GistPostBuffers(user, token, private)
    else
      let content = join(getline(a:line1, a:line2), "\n")
      if editpost == 1
        let url = s:GistUpdate(user, token, content, gistid, gistnm)
      elseif deletepost == 1
        call s:GistDelete(user, token, gistid)
      else
        let url = s:GistPost(user, token, content, private)
      endif
    endif
    if len(url) > 0
      if g:gist_open_browser_after_post
        let cmd = substitute(g:gist_browser_command, '%URL%', url, 'g')
        if cmd =~ '^!'
          silent! exec cmd
        else
          call system(cmd)
        endif
      endif
      if g:gist_put_url_to_clipboard_after_post == 1
        if exists('g:gist_clip_command')
          call system('echo '.url.' | '.g:gist_clip_command)
        elseif has('unix') && !has('xterm_clipboard')
          let @" = url
        else
          let @+ = url
        endif
      endif
    endif
  endif
  return 1
endfunction

command! -nargs=? -range=% Gist :call Gist(<line1>, <line2>, <f-args>)
" vim:set et:
