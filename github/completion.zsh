#compdef _gh gh


function _gh {
  local -a commands

  _arguments -C \
    '--help[Show help for command]' \
    '--version[Show gh version]' \
    "1: :->cmnds" \
    "*::arg:->args"

  case $state in
  cmnds)
    commands=(
      "alias:Create command shortcuts"
      "api:Make an authenticated GitHub API request"
      "completion:Generate shell completion scripts"
      "config:Manage configuration for gh"
      "gist:Create gists"
      "help:Help about any command"
      "issue:Create and view issues"
      "pr:Create, view, and checkout pull requests"
      "repo:Create, clone, fork, and view repositories"
    )
    _describe "command" commands
    ;;
  esac

  case "$words[1]" in
  alias)
    _gh_alias
    ;;
  api)
    _gh_api
    ;;
  completion)
    _gh_completion
    ;;
  config)
    _gh_config
    ;;
  gist)
    _gh_gist
    ;;
  help)
    _gh_help
    ;;
  issue)
    _gh_issue
    ;;
  pr)
    _gh_pr
    ;;
  repo)
    _gh_repo
    ;;
  esac
}


function _gh_alias {
  local -a commands

  _arguments -C \
    '--help[Show help for command]' \
    "1: :->cmnds" \
    "*::arg:->args"

  case $state in
  cmnds)
    commands=(
      "delete:Delete an alias."
      "list:List your aliases"
      "set:Create a shortcut for a gh command"
    )
    _describe "command" commands
    ;;
  esac

  case "$words[1]" in
  delete)
    _gh_alias_delete
    ;;
  list)
    _gh_alias_list
    ;;
  set)
    _gh_alias_set
    ;;
  esac
}

function _gh_alias_delete {
  _arguments \
    '--help[Show help for command]'
}

function _gh_alias_list {
  _arguments \
    '--help[Show help for command]'
}

function _gh_alias_set {
  _arguments \
    '(-s --shell)'{-s,--shell}'[Declare an alias to be passed through a shell interpreter]' \
    '--help[Show help for command]'
}

function _gh_api {
  _arguments \
    '(*-F *--field)'{\*-F,\*--field}'[Add a parameter of inferred type]:' \
    '(*-H *--header)'{\*-H,\*--header}'[Add an additional HTTP request header]:' \
    '(-i --include)'{-i,--include}'[Include HTTP response headers in the output]' \
    '--input[The file to use as body for the HTTP request]:' \
    '(-X --method)'{-X,--method}'[The HTTP method for the request]:' \
    '--paginate[Make additional HTTP requests to fetch all pages of results]' \
    '(*-f *--raw-field)'{\*-f,\*--raw-field}'[Add a string parameter]:' \
    '--silent[Do not print the response body]' \
    '--help[Show help for command]'
}

function _gh_completion {
  _arguments \
    '(-s --shell)'{-s,--shell}'[Shell type: {bash|zsh|fish|powershell}]:' \
    '--help[Show help for command]'
}


function _gh_config {
  local -a commands

  _arguments -C \
    '--help[Show help for command]' \
    "1: :->cmnds" \
    "*::arg:->args"

  case $state in
  cmnds)
    commands=(
      "get:Print the value of a given configuration key"
      "set:Update configuration with a value for the given key"
    )
    _describe "command" commands
    ;;
  esac

  case "$words[1]" in
  get)
    _gh_config_get
    ;;
  set)
    _gh_config_set
    ;;
  esac
}

function _gh_config_get {
  _arguments \
    '--help[Show help for command]'
}

function _gh_config_set {
  _arguments \
    '--help[Show help for command]'
}


function _gh_gist {
  local -a commands

  _arguments -C \
    '--help[Show help for command]' \
    "1: :->cmnds" \
    "*::arg:->args"

  case $state in
  cmnds)
    commands=(
      "create:Create a new gist"
    )
    _describe "command" commands
    ;;
  esac

  case "$words[1]" in
  create)
    _gh_gist_create
    ;;
  esac
}

function _gh_gist_create {
  _arguments \
    '(-d --desc)'{-d,--desc}'[A description for this gist]:' \
    '(-p --public)'{-p,--public}'[List the gist publicly (default: private)]' \
    '--help[Show help for command]'
}

function _gh_help {
  _arguments \
    '--help[Show help for command]'
}


function _gh_issue {
  local -a commands

  _arguments -C \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:' \
    '--help[Show help for command]' \
    "1: :->cmnds" \
    "*::arg:->args"

  case $state in
  cmnds)
    commands=(
      "close:Close issue"
      "create:Create a new issue"
      "list:List and filter issues in this repository"
      "reopen:Reopen issue"
      "status:Show status of relevant issues"
      "view:View an issue"
    )
    _describe "command" commands
    ;;
  esac

  case "$words[1]" in
  close)
    _gh_issue_close
    ;;
  create)
    _gh_issue_create
    ;;
  list)
    _gh_issue_list
    ;;
  reopen)
    _gh_issue_reopen
    ;;
  status)
    _gh_issue_status
    ;;
  view)
    _gh_issue_view
    ;;
  esac
}

function _gh_issue_close {
  _arguments \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_issue_create {
  _arguments \
    '(*-a *--assignee)'{\*-a,\*--assignee}'[Assign people by their `login`]:' \
    '(-b --body)'{-b,--body}'[Supply a body. Will prompt for one otherwise.]:' \
    '(*-l *--label)'{\*-l,\*--label}'[Add labels by `name`]:' \
    '(-m --milestone)'{-m,--milestone}'[Add the issue to a milestone by `name`]:' \
    '(*-p *--project)'{\*-p,\*--project}'[Add the issue to projects by `name`]:' \
    '(-t --title)'{-t,--title}'[Supply a title. Will prompt for one otherwise.]:' \
    '(-w --web)'{-w,--web}'[Open the browser to create an issue]' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_issue_list {
  _arguments \
    '(-a --assignee)'{-a,--assignee}'[Filter by assignee]:' \
    '(-A --author)'{-A,--author}'[Filter by author]:' \
    '(*-l *--label)'{\*-l,\*--label}'[Filter by labels]:' \
    '(-L --limit)'{-L,--limit}'[Maximum number of issues to fetch]:' \
    '--mention[Filter by mention]:' \
    '(-m --milestone)'{-m,--milestone}'[Filter by milestone `name`]:' \
    '(-s --state)'{-s,--state}'[Filter by state: {open|closed|all}]:' \
    '(-w --web)'{-w,--web}'[Open the browser to list the issue(s)]' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_issue_reopen {
  _arguments \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_issue_status {
  _arguments \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_issue_view {
  _arguments \
    '(-w --web)'{-w,--web}'[Open an issue in the browser]' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}


function _gh_pr {
  local -a commands

  _arguments -C \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:' \
    '--help[Show help for command]' \
    "1: :->cmnds" \
    "*::arg:->args"

  case $state in
  cmnds)
    commands=(
      "checkout:Check out a pull request in Git"
      "close:Close a pull request"
      "create:Create a pull request"
      "diff:View a pull request's changes."
      "list:List and filter pull requests in this repository"
      "merge:Merge a pull request"
      "ready:Mark a pull request as ready for review"
      "reopen:Reopen a pull request"
      "review:Add a review to a pull request"
      "status:Show status of relevant pull requests"
      "view:View a pull request"
    )
    _describe "command" commands
    ;;
  esac

  case "$words[1]" in
  checkout)
    _gh_pr_checkout
    ;;
  close)
    _gh_pr_close
    ;;
  create)
    _gh_pr_create
    ;;
  diff)
    _gh_pr_diff
    ;;
  list)
    _gh_pr_list
    ;;
  merge)
    _gh_pr_merge
    ;;
  ready)
    _gh_pr_ready
    ;;
  reopen)
    _gh_pr_reopen
    ;;
  review)
    _gh_pr_review
    ;;
  status)
    _gh_pr_status
    ;;
  view)
    _gh_pr_view
    ;;
  esac
}

function _gh_pr_checkout {
  _arguments \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_close {
  _arguments \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_create {
  _arguments \
    '(*-a *--assignee)'{\*-a,\*--assignee}'[Assign people by their `login`]:' \
    '(-B --base)'{-B,--base}'[The branch into which you want your code merged]:' \
    '(-b --body)'{-b,--body}'[Supply a body. Will prompt for one otherwise.]:' \
    '(-d --draft)'{-d,--draft}'[Mark pull request as a draft]' \
    '(-f --fill)'{-f,--fill}'[Do not prompt for title/body and just use commit info]' \
    '(*-l *--label)'{\*-l,\*--label}'[Add labels by `name`]:' \
    '(-m --milestone)'{-m,--milestone}'[Add the pull request to a milestone by `name`]:' \
    '(*-p *--project)'{\*-p,\*--project}'[Add the pull request to projects by `name`]:' \
    '(*-r *--reviewer)'{\*-r,\*--reviewer}'[Request reviews from people by their `login`]:' \
    '(-t --title)'{-t,--title}'[Supply a title. Will prompt for one otherwise.]:' \
    '(-w --web)'{-w,--web}'[Open the web browser to create a pull request]' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_diff {
  _arguments \
    '(-c --color)'{-c,--color}'[Whether or not to output color: {always|never|auto}]:' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_list {
  _arguments \
    '(-a --assignee)'{-a,--assignee}'[Filter by assignee]:' \
    '(-B --base)'{-B,--base}'[Filter by base branch]:' \
    '(*-l *--label)'{\*-l,\*--label}'[Filter by labels]:' \
    '(-L --limit)'{-L,--limit}'[Maximum number of items to fetch]:' \
    '(-s --state)'{-s,--state}'[Filter by state: {open|closed|merged|all}]:' \
    '(-w --web)'{-w,--web}'[Open the browser to list the pull request(s)]' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_merge {
  _arguments \
    '(-d --delete-branch)'{-d,--delete-branch}'[Delete the local and remote branch after merge]' \
    '(-m --merge)'{-m,--merge}'[Merge the commits with the base branch]' \
    '(-r --rebase)'{-r,--rebase}'[Rebase the commits onto the base branch]' \
    '(-s --squash)'{-s,--squash}'[Squash the commits into one commit and merge it into the base branch]' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_ready {
  _arguments \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_reopen {
  _arguments \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_review {
  _arguments \
    '(-a --approve)'{-a,--approve}'[Approve pull request]' \
    '(-b --body)'{-b,--body}'[Specify the body of a review]:' \
    '(-c --comment)'{-c,--comment}'[Comment on a pull request]' \
    '(-r --request-changes)'{-r,--request-changes}'[Request changes on a pull request]' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_status {
  _arguments \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}

function _gh_pr_view {
  _arguments \
    '(-w --web)'{-w,--web}'[Open a pull request in the browser]' \
    '--help[Show help for command]' \
    '(-R --repo)'{-R,--repo}'[Select another repository using the `OWNER/REPO` format]:'
}


function _gh_repo {
  local -a commands

  _arguments -C \
    '--help[Show help for command]' \
    "1: :->cmnds" \
    "*::arg:->args"

  case $state in
  cmnds)
    commands=(
      "clone:Clone a repository locally"
      "create:Create a new repository"
      "fork:Create a fork of a repository"
      "view:View a repository"
    )
    _describe "command" commands
    ;;
  esac

  case "$words[1]" in
  clone)
    _gh_repo_clone
    ;;
  create)
    _gh_repo_create
    ;;
  fork)
    _gh_repo_fork
    ;;
  view)
    _gh_repo_view
    ;;
  esac
}

function _gh_repo_clone {
  _arguments \
    '--help[Show help for command]'
}

function _gh_repo_create {
  _arguments \
    '(-d --description)'{-d,--description}'[Description of repository]:' \
    '--enable-issues[Enable issues in the new repository]' \
    '--enable-wiki[Enable wiki in the new repository]' \
    '(-h --homepage)'{-h,--homepage}'[Repository home page URL]:' \
    '--public[Make the new repository public (default: private)]' \
    '(-t --team)'{-t,--team}'[The name of the organization team to be granted access]:' \
    '--help[Show help for command]'
}

function _gh_repo_fork {
  _arguments \
    '--clone[Clone the fork {true|false}]' \
    '--remote[Add remote for fork {true|false}]' \
    '--help[Show help for command]'
}

function _gh_repo_view {
  _arguments \
    '(-w --web)'{-w,--web}'[Open a repository in the browser]' \
    '--help[Show help for command]'
}

