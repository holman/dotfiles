#Load Plugins
if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-autosuggestions/zsh-autosuggestions.zsh" ]]; then
   source "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-autosuggestions/zsh-autosuggestions.zsh"
fi

if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" ]]; then
   source "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-syntax-highlighting/zsh-syntax-highlighting.zsh"
fi

if [[ -s "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-history-substring-search/zsh-history-substring-search.zsh" ]]; then
   source "${ZDOTDIR:-$HOME}/.dotfiles/external/zsh-history-substring-search/zsh-history-substring-search.zsh"
   #Vi mode command keys
   bindkey -M vicmd 'k' history-substring-search-up
   bindkey -M vicmd 'j' history-substring-search-down
   # bind UP and DOWN arrow keys
   zmodload zsh/terminfo
   bindkey "$terminfo[kcuu1]" history-substring-search-up
   bindkey "$terminfo[kcud1]" history-substring-search-down
   bindkey "$terminfo[cuu1]" history-substring-search-up
   bindkey "$terminfo[cud1]" history-substring-search-down
fi
