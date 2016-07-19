# install venv globally
pip install virtualenv

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
pip3 install neovim

