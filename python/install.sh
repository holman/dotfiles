pyenv install 3.5.2
pyenv global 3.5.2

# enable use of pip to install virtual environments
export PIP_REQUIRE_VIRTUALENV=false

if ! which virtualenv; then
	# install venv globally if it does not exist
	pip install virtualenv
fi

# prevent usage of pip outside of virtual environment
export PIP_REQUIRE_VIRTUALENV=true

# create directory to store virtual environment things
mkdir -p ~/.virtualenv

# create and activate our default python environment
cd ~/.virtualenv/
virtualenv -p python3 neo
source ~/.virtualenv/neo/bin/activate

# install our neovim dependency
# this is basically the reason for all this mission
pip3 install -r $DOT_FILES/python/requirements.txt

