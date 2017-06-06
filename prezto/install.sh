update_modules () {
  # Pull the latest changes and update all submodules
  git submodule update --init --recursive
}

setup_gitconfig
