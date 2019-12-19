###-begin-codefresh-completions-###
#
# codefresh command completion script
#
# Installation: codefresh completion zsh >> ~/.zshrc
#
_codefresh_completions()
{
    type_list=($(codefresh --impl-zsh-file-dir --get-yargs-completions "${words[@]}"))

    if [[ ${type_list[1]} == '__files_completion__' ]]; then
        compadd -- "${type_list[@]:1}"
    else
        compadd -- "${type_list[@]}"
    fi

    return 0
}
compdef _codefresh_completions codefresh
###-end-codefresh-completions-###