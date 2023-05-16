autoload colors && colors

export ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg_bold[blue]%}git:(%{$fg[red]%}"
export ZSH_THEME_GIT_PROMPT_SUFFIX="%{$reset_color%} "
export ZSH_THEME_GIT_PROMPT_DIRTY="%{$fg[blue]%}) %{$fg[yellow]%}✗"
export ZSH_THEME_GIT_PROMPT_CLEAN="%{$fg[blue]%})"


set_prompt () {
  PROMPT="%(?:%{$fg_bold[green]%}➜ :%{$fg_bold[red]%}➜ ) %{$fg[cyan]%}%c%{$reset_color%}"
  PROMPT+=' $(git_prompt_info)'
}

precmd() {
  title "zsh" "%m" "%55<...<%~"
  set_prompt
}
