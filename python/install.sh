# if test $(command -v brew); then
#   if test $(python3 -V | grep -q 'Python 3'); then
#     echo "   installing python"
#     brew install python
#   else
#     echo " upgrading python"
#     brew upgrade python
#   fi

#   # https://installvirtual.com/how-to-install-python-3-8-on-mac-using-pyenv/
#   if test ! $(command -v pyenv); then
#     echo "  installing pyenv"
#     brew install pyenv
#   else
#     echo "  upgrading pyenv"
#     brew upgrade pyenv
#   fi
# fi