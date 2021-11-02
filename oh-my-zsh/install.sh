DIR=~/.oh-my-zsh

if [[ -d $DIR ]]
then\
    echo "\033[31mDid not install oh-my-zsh, since '$DIR' already exists"
else
    echo "Installing oh-my-zsh"
    git clone https://github.com/ohmyzsh/ohmyzsh.git $DIR
    echo "Succesfully installed oh-my-zsh"

    echo "Installing git-open plugin for oh-my-zsh"
    git clone https://github.com/paulirish/git-open.git $DIR/custom/plugins/git-open
fi

