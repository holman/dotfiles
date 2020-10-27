#!/bin/sh


git-fetchall(){
  # store the current dir
  CUR_DIR=$(pwd)

  # Let the person running the script know what's going on.
  echo "\n\033[1mPulling in latest changes for all repositories...\033[0m\n"

  # Find all git repositories and fetch and prune
  for i in $(find . -name ".git" | cut -c 3-); do
      echo "";
      echo "\033[33m"+$i+"\033[0m";

      # We have to go to the .git parent directory to call the pull command
      cd "$i";
      cd ..;

      # finally pull
      git fetch --all --prune;

      # lets get back to the CUR_DIR
      cd $CUR_DIR
  done

  echo "\n\033[32mComplete!\033[0m\n"
}


git-pullall(){
  # store the current dir
  CUR_DIR=$(pwd)

  # Let the person running the script know what's going on.
  echo "\n\033[1mPulling in latest changes for all repositories...\033[0m\n"

  # Find all git repositories and fetch and prune
  for i in $(find . -name ".git" | cut -c 3-); do
      echo "";
      echo "\033[33m"+$i+"\033[0m";

      # We have to go to the .git parent directory to call the pull command
      cd "$i";
      cd ..;

      # finally pull
      git pull --prune;

      # lets get back to the CUR_DIR
      cd $CUR_DIR
  done

  echo "\n\033[32mComplete!\033[0m\n"
}
