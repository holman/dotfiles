# Source: https://github.com/junegunn/fzf/wiki/examples#git
# fbr - checkout git branch (including remote branches), sorted by most recent commit, limit 30 last branches
fbr() {
  local branches branch
  pattern="**/${1:-refs/heads}/**"
  branches=$(git for-each-ref --sort=-committerdate ${pattern} --format="%(refname:short)") &&
  branch=$(echo "$branches" |
           fzf-tmux -d $(( 2 + $(wc -l <<< "$branches") )) +m) &&
  git checkout $(echo "$branch" | sed "s/.* //" | sed "s#remotes/[^/]*/##")
}
