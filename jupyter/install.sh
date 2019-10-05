pip3 install jupyter_contrib_nbextensions
jupyter contrib nbextension install --user
# You may need the following to create the directoy
mkdir -p $(jupyter --data-dir)/nbextensions
# Now clone the repository
cd $(jupyter --data-dir)/nbextensions
git clone https://github.com/lambdalisue/jupyter-vim-binding vim_binding
chmod -R go-w vim_binding
