echo "installing jupyter extensions"
pip3 install --user jupyter
pip3 install --user jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
# You may need the following to create the directoy
mkdir -p $(jupyter --data-dir)/nbextensions
# Now clone the repository
cd $(jupyter --data-dir)/nbextensions
if cd vim_binding
  then
    git pull
  else
    git clone https://github.com/lambdalisue/jupyter-vim-binding vim_binding
    chmod -R go-w vim_binding
fi
cd $(jupyter --data-dir)/nbextensions

echo "copying jupyter config"
cp ~/.dotfiles/jupyter/jupyter_notebook_config.py ~/.jupyter/
