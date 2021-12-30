#!/bin/bash
# Usage: rbenv doctor
# Summary: Detects common problems in rbenv installation

set -e
[ -n "$RBENV_DEBUG" ] && set -x

indent() {
  sed 's/^/  /'
}

printc() {
  local color_name="color_$1"
  local fmt="$2"
  shift 2

  if [[ $fmt == *"\n" ]]; then
    fmt="${!color_name}${fmt%\\n}${color_reset}\n"
  else
    fmt="${!color_name}${fmt}${color_reset}"
  fi

  printf "$fmt" "$@"
}

if [ -t 1 ]; then
  color_red=$'\e[31m'
  color_green=$'\e[32m'
  color_yellow=$'\e[1;33m'
  color_bright=$'\e[1;37m'
  color_reset=$'\e[0m'
else
  color_red=""
  color_green=""
  color_yellow=""
  color_bright=""
  color_reset=""
fi

warnings=0

if [ $(uname -s) = "Darwin" ]; then
  bashrc=".bash_profile"
else
  bashrc=".bashrc"
fi

echo -n "Checking for \`rbenv' in PATH: "
num_locations="$(which -a rbenv | uniq | wc -l)"
if [ $num_locations -eq 0 ]; then
  printc red "not found\n"
  { if [ -x ~/.rbenv/bin/rbenv ]; then
      echo "You seem to have rbenv installed in \`$HOME/.rbenv/bin', but that"
      echo "directory is not present in PATH. Please add it to PATH by configuring"
      echo "your \`~/${bashrc}', \`~/.zshrc', or \`~/.config/fish/config.fish'."
    else
      echo "Please refer to https://github.com/rbenv/rbenv#installation"
    fi
  } | indent
  exit 1
elif [ $num_locations -eq 1 ]; then
  printc green "%s\n" "$(which rbenv)"
else
  printc yellow "multiple\n"
  { echo "You seem to have multiple rbenv installs in the following locations."
    echo "Please pick just one installation and remove the others."
    echo
    which -a rbenv
  } | indent
  echo
  : $((warnings++))
fi

RBENV_ROOT="${RBENV_ROOT:-$(rbenv root)}"

OLDIFS="$IFS"
IFS=:
path=($PATH)
IFS="$OLDIFS"

echo -n "Checking for rbenv shims in PATH: "
shims_dir="${RBENV_ROOT}/shims"
found=""
for dir in "${path[@]}"; do [ "$dir" != "$shims_dir" ] || found=true; done
if [ -n "$found" ]; then
  printc green "OK\n"
else
  printc red "not found\n"
  { echo "The directory \`$shims_dir' must be present in PATH for rbenv to work."
    echo "Please run \`rbenv init' and follow the instructions."
  } | indent
  echo
  : $((warnings++))
fi

echo -n "Checking \`rbenv install' support: "
rbenv_installs="$({ ls "$RBENV_ROOT"/plugins/*/bin/rbenv-install 2>/dev/null || true
                    which -a rbenv-install 2>/dev/null || true
                  } | uniq)"
num_installs="$(wc -l <<<"$rbenv_installs")"
if [ -z "$rbenv_installs" ]; then
  printc red "not found\n"
  { echo "Unless you plan to add Ruby versions manually, you should install ruby-build."
    echo "Please refer to https://github.com/rbenv/ruby-build#installation"
  }
  echo
  : $((warnings++))
elif [ $num_installs -eq 1 ]; then
  printc green "$rbenv_installs"
  if [[ $rbenv_installs == "$RBENV_ROOT"/plugins/* ]]; then
    rbenv_install_cmd="${rbenv_installs##*/}"
    rbenv_install_version="$(rbenv "${rbenv_install_cmd#rbenv-}" --version || true)"
  else
    rbenv_install_version="$("$rbenv_installs" --version || true)"
  fi
  printf " (%s)\n" "$rbenv_install_version"
else
  printc yellow "multiple\n"
  { echo "You seem to have multiple \`rbenv-install' in the following locations."
    echo "Please pick just one installation and remove the others."
    echo
    echo "$rbenv_installs"
  } | indent
  echo
  : $((warnings++))
fi

echo -n "Counting installed Ruby versions: "
num_rubies="$(rbenv versions --bare | wc -l)"
if [ $num_rubies -eq 0 ]; then
  printc yellow "none\n"
  echo "There aren't any Ruby versions installed under \`$RBENV_ROOT/versions'." | indent
  [ $num_installs -eq 0 ] || {
    echo -n "You can install Ruby versions like so: "
    printc bright "rbenv install 2.2.4\n"
  } | indent
else
  printc green "%d versions\n" $num_rubies
fi

echo -n "Checking RubyGems settings: "
gem_broken=0
for gemrc in ~/.gemrc /etc/gemrc; do
  if grep -v '^#' "$gemrc" 2>/dev/null | grep -q -e --user-install; then
    [ "$((gem_broken++))" -gt 0 ] || printc yellow "warning\n"
    echo "Please remove \`--user-install' flag from \`$gemrc'." | indent
    : $((warnings++))
  fi
done
[ "$gem_broken" -gt 0 ] || printc green "OK\n"

echo -n "Auditing installed plugins: "
OLDIFS="$IFS"
IFS=$'\n'
hooks=(`rbenv hooks exec`)
IFS="$OLDIFS"
plugin_broken=0
for hook in "${hooks[@]}"; do
  plugin_name=
  message=
  case "$hook" in
  */"~gem-rehash.bash" )
    plugin_name=rbenv-gem-rehash
    message="functionality is now included in rbenv core. Please remove the plugin."
    ;;
  */"bundler.bash" )
    plugin_name=rbenv-bundler
    message="is considered harmful. Please remove the plugin and \`rm -rf \$(rbenv root)/shims && rbenv rehash'."
    ;;
  esac

  if [ -n "$plugin_name" ]; then
    [ "$((plugin_broken++))" -gt 0 ] || printc yellow "warning\n"
    { printc bright "$plugin_name"
      echo " $message"
      echo "  (found in \`${hook}')"
    } | indent
    : $((warnings++))
  fi
done
[ "$plugin_broken" -gt 0 ] || printc green "OK\n"

[ $warnings -eq 0 ]
