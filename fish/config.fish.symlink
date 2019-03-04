set -x FISH ~/.dotfiles
set PATH_FILES $FISH/**/*.path
set FISH_FILES $FISH/**/*.fish

for path_file in $PATH_FILES
  source $path_file
end

for fish_file in $FISH_FILES
  source $fish_file
end

set -e FISH_FILES
set -e PATH_FILES

