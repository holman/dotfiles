# This sets the path where to find the conf/zsh/etc files for sourcing in the
# respective configuration files

export POWERLINE_DIR=`pip show powerline | grep Location | sed s/Location:\ //g`
export PATH=`python -c "import site; print site.USER_BASE"`/bin:$PATH
