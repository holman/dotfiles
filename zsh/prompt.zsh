PS1="\a\n\n\e[31;1m\u@\h \n\w\e[0m\n$ "

local return_code="%(?..%{$fg[red]%}%? %{$reset_color%})"
local ret_status="%(?:%{$fg_bold[green]%}➜ :%{$fg_bold[red]%}➜ %s)"

RPS1='%{$fg[blue]%}%~%{$reset_color%} ${return_code} '
PS1='${ret_status}%{$fg_bold[green]%} %n@%m%p %{$fg[cyan]%}%c %{$fg_bold[blue]%} $(git_prompt_info)%{$fg_bold[blue]%} % %{$reset_color%}'

ZSH_THEME_GIT_PROMPT_PREFIX="git:(%{$fg[red]%}"
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[blue]%}) %{$fg[yellow]%}✗%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN="%{$fg[blue]%})"
