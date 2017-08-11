source /usr/local/share/antigen/antigen.zsh

## Antigen
antigen use oh-my-zsh

### Bundles
antigen bundle common-aliases
antigen bundle brew
antigen bundle docker
antigen bundle bower
antigen bundle symfony2
antigen bundle osx
antigen bundle nvm
antigen bundle zsh-users/zsh-syntax-highlighting
antigen bundle zsh-users/zsh-completions
antigen bundle zsh-users/zsh-autosuggestions

#bugs
#antigen bundle git
#antigen bundle npm



### Theme
POWERLEVEL9K_MODE='awesome-patched'
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(context dir vcs)
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status nvm battery time)

antigen theme bhilburn/powerlevel9k powerlevel9k

### Applying Antigen config
antigen apply
