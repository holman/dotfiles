fn_exists() {
  # From https://stackoverflow.com/a/9529981
  declare -f -F $1 > /dev/null
  return $?
}

if ! fn_exists goto; then
  : ${PROJECT_DIR:=~/dev}

  goto() {
    local input=$1
    local parts=("${(@s:/:)input}")
    local host user repo

    case ${#parts[@]} in
      3)
        host=$parts[1]
        user=$parts[2]
        repo=$parts[3]
        ;;
      2)
        host=github.com
        user=$parts[1]
        repo=$parts[2]
        ;;
      1)
        host=github.com
        user=${GO_DEFAULT:-${GH_ORG_DEFAULT}}
        repo=$parts[1]
        ;;
      *)
        echo "usage: goto [<host>/]<user>/<repo> | <repo>"
        return 1
        ;;
    esac

    local dir=$PROJECT_DIR/src/$host/$user/$repo
    if [[ -d $dir ]]; then
      cd $dir
    elif git clone ssh://git@$host/$user/$repo.git $dir; then
      cd $dir
    else
      echo "repo @ $host/$user/$repo does not exist"
      return 1
    fi
  }

  _zsh_goto() {
    local base=$PROJECT_DIR/src
    local default=${GO_DEFAULT:-${GH_ORG_DEFAULT}}
    compadd $(find $base -maxdepth 3 -mindepth 3 -type d 2>/dev/null | sed "s|$base/||")
    compadd $(find $base/github.com -maxdepth 2 -mindepth 2 -type d 2>/dev/null | sed "s|$base/github.com/||")
    compadd $(find $base/github.com/$default -maxdepth 1 -mindepth 1 -type d 2>/dev/null | sed "s|$base/github.com/$default/||")
  }

  if type compdef &> /dev/null ; then
    compdef _zsh_goto goto
  fi
fi
