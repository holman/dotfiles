_zbnc_npm_command() {
  echo "${words[2]}"
}

_zbnc_npm_command_arg() {
  echo "${words[3]}"
}

_zbnc_no_of_npm_args() {
  echo "$#words"
}

_zbnc_list_cached_modules() {
  ls ~/.npm 2>/dev/null
}

_zbnc_recursively_look_for() {
  local filename="$1"
  local dir=$PWD
  while [ ! -e "$dir/$filename" ]; do
    dir=${dir%/*}
    [[ "$dir" = "" ]] && break
  done
  [[ ! "$dir" = "" ]] && echo "$dir/$filename"
}

_zbnc_get_package_json_property_object() {
  local package_json="$1"
  local property="$2"
  cat "$package_json" |
    sed -nE "/^  \"$property\": \{$/,/^  \},?$/p" | # Grab scripts object
    sed '1d;$d' |                                   # Remove first/last lines
    sed -E 's/    "([^"]+)": "(.+)",?/\1=>\2/'      # Parse into key=>value
}

_zbnc_get_package_json_property_object_keys() {
  local package_json="$1"
  local property="$2"
  _zbnc_get_package_json_property_object "$package_json" "$property" | cut -f 1 -d "="
}

_zbnc_parse_package_json_for_script_suggestions() {
  local package_json="$1"
  _zbnc_get_package_json_property_object "$package_json" scripts |
    sed -E 's/(.+)=>(.+)/\1:$ \2/' |  # Parse commands into suggestions
    sed 's/\(:\)[^$]/\\&/g' |         # Escape ":" in commands
    sed 's/\(:\)$[^ ]/\\&/g'          # Escape ":$" without a space in commands
}

_zbnc_parse_package_json_for_deps() {
  local package_json="$1"
  _zbnc_get_package_json_property_object_keys "$package_json" dependencies
  _zbnc_get_package_json_property_object_keys "$package_json" devDependencies
}

_zbnc_npm_install_completion() {

  # Only run on `npm install ?`
  [[ ! "$(_zbnc_no_of_npm_args)" = "3" ]] && return

  # Return if we don't have any cached modules
  [[ "$(_zbnc_list_cached_modules)" = "" ]] && return

  # If we do, recommend them
  _values $(_zbnc_list_cached_modules)

  # Make sure we don't run default completion
  custom_completion=true
}

_zbnc_npm_uninstall_completion() {

  # Use default npm completion to recommend global modules
  [[ "$(_zbnc_npm_command_arg)" = "-g" ]] ||  [[ "$(_zbnc_npm_command_arg)" = "--global" ]] && return

  # Look for a package.json file
  local package_json="$(_zbnc_recursively_look_for package.json)"

  # Return if we can't find package.json
  [[ "$package_json" = "" ]] && return

  _values $(_zbnc_parse_package_json_for_deps "$package_json")

  # Make sure we don't run default completion
  custom_completion=true
}

_zbnc_npm_run_completion() {

  # Only run on `npm run ?`
  [[ ! "$(_zbnc_no_of_npm_args)" = "3" ]] && return

  # Look for a package.json file
  local package_json="$(_zbnc_recursively_look_for package.json)"

  # Return if we can't find package.json
  [[ "$package_json" = "" ]] && return

  # Parse scripts in package.json
  local -a options
  options=(${(f)"$(_zbnc_parse_package_json_for_script_suggestions $package_json)"})

  # Return if we can't parse it
  [[ "$#options" = 0 ]] && return

  # Load the completions
  _describe 'values' options

  # Make sure we don't run default completion
  custom_completion=true
}

_zbnc_default_npm_completion() {
  compadd -- $(COMP_CWORD=$((CURRENT-1)) \
              COMP_LINE=$BUFFER \
              COMP_POINT=0 \
              npm completion -- "${words[@]}" \
              2>/dev/null)
}

_zbnc_zsh_better_npm_completion() {

  # Store custom completion status
  local custom_completion=false

  # Load custom completion commands
  case "$(_zbnc_npm_command)" in
    i|install)
      _zbnc_npm_install_completion
      ;;
    r|uninstall)
      _zbnc_npm_uninstall_completion
      ;;
    run)
      _zbnc_npm_run_completion
      ;;
  esac

  # Fall back to default completion if we haven't done a custom one
  [[ $custom_completion = false ]] && _zbnc_default_npm_completion
}

compdef _zbnc_zsh_better_npm_completion npm
