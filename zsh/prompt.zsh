function nvm_prompt_info() {
  [ -f "$HOME/.nvm/nvm.sh" ] || [ -f "$(brew --prefix nvm)/nvm.sh" ]  || return
  local nvm_prompt
  nvm_prompt=$(node -v 2>/dev/null)
  [[ "${nvm_prompt}x" == "x" ]] && return
  nvm_prompt=${nvm_prompt:1}
  echo "${ZSH_THEME_NVM_PROMPT_PREFIX}${nvm_prompt}${ZSH_THEME_NVM_PROMPT_SUFFIX}"
}


function _user_host() {
    if [[ -n $SSH_CONNECTION ]]; then
        _color="yellow"
    elif [[ $LOGNAME != $USER ]]; then
        _color="red"
    else
        _color="cyan"
    fi

    echo "%{$fg[$_color]%}%n%{$fg[white]%} at %{$fg[cyan]%}%m%{$reset_color%}"

}

if [[ $USER == "root" ]]; then
  CARETCOLOR="red"
else
  CARETCOLOR="white"
fi

local _current_dir="%{$fg[yellow]%}%3~%{$reset_color%} "
local nvm_node=''
nvm_node='%{$fg[green]%}‹node-$(nvm_prompt_info)›%{$reset_color%}'


ZSH_THEME_GIT_PROMPT_PREFIX="%{$fg[green]%}["
ZSH_THEME_GIT_PROMPT_SUFFIX="%{$fg[green]%}]%{$reset_color%}"

ZSH_THEME_GIT_PROMPT_DIRTY=" %{$fg[red]%}✗%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_CLEAN=" %{$fg[green]%}✔%{$reset_color%}"
ZSH_THEME_GIT_PROMPT_ADDED="%{$fg[green]%}✚ "
ZSH_THEME_GIT_PROMPT_MODIFIED="%{$fg[yellow]%}⚑ "
ZSH_THEME_GIT_PROMPT_DELETED="%{$fg[red]%}✖ "
ZSH_THEME_GIT_PROMPT_RENAMED="%{$fg[blue]%}▴ "
ZSH_THEME_GIT_PROMPT_UNMERGED="%{$fg[cyan]%}§ "
ZSH_THEME_GIT_PROMPT_UNTRACKED="%{$fg[grey]%}◒ "




PROMPT="$(_user_host)%{$fg[white]%} in %{$fg[yellow]%}${_current_dir}%{$reset_color%} $(git_prompt_info) ${nvm_node}
➜%{$reset_color%} "
RPROMPT='%{$(echotc UP 1)%} $(git_prompt_status) ⌚ %{$fg_bold[red]%}%*%{$reset_color%} %{$(echotc DO 1)%}'
PROMPT2="%{$fg[grey]%}◀%{$reset_color%} "
