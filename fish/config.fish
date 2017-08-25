set fish_greeting ""

set -x EDITOR nvim

# Set android path for gradle build
set -x ANDROID_HOME /usr/local/share/android-sdk
set -x ANDROID_SDK_ROOT /usr/local/share/android-sdk
set -x ANDROID_NDK_HOME /usr/local/share/android-ndk

# Pipe my public key to my clipboard.
alias pubkey="more ~/.ssh/id_rsa.pub | pbcopy | echo '=> Public key copied to pasteboard.'"
alias chrome="open -a Google\ Chrome --args --disable-web-security --user-data-dir=/Users/$USER/Library/Application\\ Support/Google/ChromePersonal"

# Remove any existing abbreviations
set -e fish_user_abbreviations

# Misc abbreviations ------------------------------------
abbr c z
abbr stt subl .
abbr r source ~/.config/fish/config.fish

# Git abbreviations ------------------------------------
# The rest of my fun git aliases
alias glog="git log --graph --pretty=format:'%Cred%h%Creset %an: %s - %Creset %C(yellow)%d%Creset %Cgreen(%cr)%Creset' --abbrev-commit --date=relative"
# learn git by status. will teach you the day to day.
abbr gits git status
# diff unstage changes
abbr gitd git diff
# diff staged changes
abbr gitds git diff --cached
# commit and enter vim for message
abbr gitc git commit -a
# show branches
abbr gitb git branch
# switch branches
abbr sw git checkout

# Tmux abbreviations -----------------------------------
abbr tls tmux ls
abbr ta tmux attach -t
abbr tns tmux new-session -s

# # Paths
test -d $HOME/.rbenv/shims ; and set PATH $HOME/.rbenv/shims $PATH
test -d ~/.pyenv/shims ; and set PATH ~/.pyenv/shims $PATH

# Navigation
function ..    ; cd .. ; end
function ...   ; cd ../.. ; end
function ....  ; cd ../../.. ; end
function ..... ; cd ../../../.. ; end
function l     ; tree --dirsfirst -aFCNL 1 $argv ; end
function ll    ; tree --dirsfirst -ChFupDaLg 1 $argv ; end

# Utilities
function a        ; command ag --ignore=.git --ignore=log --ignore=tags --ignore=tmp --ignore=vendor --ignore=spec/vcr $argv ; end
function lookbusy ; cat /dev/urandom | hexdump -C | grep --color "ca fe" ; end
function tree     ; command tree -C $argv ; end
function tmux     ; command tmux -2 $argv ; end

# Completions for custom aliases
function make_completion --argument-names alias command
    echo "
    function __alias_completion_$alias
        set -l cmd (commandline -o)
        set -e cmd[1]
        complete -C\"$command \$cmd\"
    end
    " | .
    complete -c $alias -a "(__alias_completion_$alias)"
end

# open new vimr instances on launch
# set cwd to current directory
function v
    vimr -s --cwd .
end

# rbenv
function rb
	status --is-interactive; and . (rbenv init -|psub)
end

function node
    nvm use 7.0.0
end

# nvm
function nvm
  	bass source ~/.nvm/nvm.sh --no-use ';' nvm $argv
end

# python virtual environment
set -x PIP_REQUIRE_VIRTUALENV false
function py
    status --is-interactive; and . (pyenv init -|psub)
    status --is-interactive; and . (pyenv virtualenv-init -|psub)
end

# launch tmux automatically
if test $TERM != "screen-256color"
    command tmux attach-session -t 'default'; or command tmux new-session -s 'default'
end

