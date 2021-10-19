:call feedkeys("itest this is a test", 'x')
:" Sneak to the beginning of 'this'
:call feedkeys("0sth", 'x')
:if getcurpos()[2] == 6
:  quit!
:else
:  cquit!
:endif
