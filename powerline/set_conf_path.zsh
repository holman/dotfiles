# This sets the path where to find the conf/zsh/etc files for sourcing in the
# respective configuration files

user_base=`python -c "import site; print site.USER_BASE"`
export PATH="$user_base/bin":$PATH
user_base_packages=`python -c "import site; print site.getusersitepackages()"`
export POWERLINE_DIR="$user_base_packages/powerline"
