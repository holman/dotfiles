FONTS_PATH=$HOME/.fonts
CONFIG_PATH=$HOME/.config/fontconfig/conf.d
cd "$(dirname "$0")"

git clone git@github.com:gabrielelana/awesome-terminal-fonts.git

mkdir -p $FONTS_PATH

cp -f ./awesome-terminal-fonts/build/*.ttf $FONTS_PATH
cp -f ./awesome-terminal-fonts/build/*.sh $FONTS_PATH

rm -rf awesome-terminal-fonts

fc-cache -fv $FONTS_PATH

#git clone git@github.com:powerline/fonts.git
#fonts/install.sh
#rm -rf fonts
