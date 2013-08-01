# Check if directory is a Git repo
# Customized from http://vvv.tobiassjosten.net/git/add-current-git-branch-to-your-bash-prompt
git_prompt ()
{
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        return 0
    fi

    git_branch=$(git branch 2>/dev/null| sed -n '/^\*/s/^\* //p')

    if git diff --quiet 2>/dev/null >&2; then
        git_color="${c_git_clean}"
    else
        git_color=${c_git_dirty}
    fi

    echo " [$git_color$git_branch${c_reset}]"
}

# The prompt [Show Git branch if applicable]
PS1='\H \e[0;34m\w\e[m\e[0;36m$(git_prompt)\e[m
==> '


