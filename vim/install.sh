
curl -sLf https://spacevim.org/install.sh | bash

sv_dir=$HOME/.SpaceVim.d
mkdir -p $sv_dir

ln -sf "$(pwd)/vim/spacevim.toml" $sv_dir/init.toml