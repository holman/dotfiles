export WORKON_HOME=$HOME/.virtualenvs
export PROJECT_HOME=$HOME/Devel
# Missing expansion of VIRTUALENVWRAPPER_PYTHON
# This needs to be specific to each platform, i.e., where python3 sits.
# Set this instead in your .zprofile

macos_virtualenv_scripts=/usr/local/bin
ubuntu_virtualenv_scripts=/usr/share/virtualenvwrapper
lazy_wrapper=virtualenvwrapper_lazy.sh
if [ -f "${macos_virtualenv_scripts}/${lazy_wrapper}" ]; then
  source "${macos_virtualenv_scripts}/${lazy_wrapper}"
elif [ -f "${ubuntu_virtualenv_scripts}/${lazy_wrapper}" ]; then
  source "${ubuntu_virtualenv_scripts}/${lazy_wrapper}"
else
  echo -e "Could not find virtualenvwrapper_lazy"
fi
