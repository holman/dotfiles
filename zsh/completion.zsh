# matches case insensitive for lowercase
zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

# pasting with tabs doesn't perform completion
zstyle ':completion:*' insert-tab pending

source /usr/local/Cellar/todo-txt/2.9/etc/bash_completion.d/todo_completion complete -F _todo t
