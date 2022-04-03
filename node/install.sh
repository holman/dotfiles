   
#!/usr/bin/env bash

if test ! "$(nvm --version)"
  then
  echo -e "\\n⬇️  Installing NVM"
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
fi

nvm install node --reinstall-packages-from=node

if test ! "$(npm --version)"
  then
  echo -e "\\nNPM not installed"
else
  echo -e "\\n⬇️  Install global Node modules"
  npm install -g npm-check-updates
  npm install -g npm-check
fi
