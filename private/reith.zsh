### BBC Reith Proxy settings

function proxy_off {

  #proxy setup for terminal
  unset HTTP_PROXY
  unset http_proxy
  unset HTTPS_PROXY
  unset https_proxy

  # Causes problems with Node and NPM if enabled
  unset SOCKS_PROXY
  unset socks_proxy

  unset NO_PROXY
  unset FTP_PROXY
  unset ftp_proxy
  # Allows homebrew (and other things) to download via reith
  unset ALL_PROXY

  # Proxy settings for git
  # git config --global --unset http.proxy

  # unset SSH proxy
  # /usr/bin/sed -i ".bak" "s/#\{0,1\}\(ProxyCommand nc\)\(.*$\)/#\1\2/g" ~/.ssh/config
}

function proxy_on {

  PROXY_URL="http://www-cache.reith.bbc.co.uk"
  PROXY_PORT="80"

  #proxy setup for terminal
  export HTTP_PROXY="$PROXY_URL:$PROXY_PORT"
  export http_proxy="$PROXY_URL:$PROXY_PORT"
  export HTTPS_PROXY="$PROXY_URL:$PROXY_PORT"
  export https_proxy="$PROXY_URL:$PROXY_PORT"

  # Causes problems with Node and NPM if enabled
  # export SOCKS_PROXY="socks-gw.reith.bbc.co.uk:1085"
  # export socks_proxy="socks-gw.reith.bbc.co.uk:1085"

  export NO_PROXY="127.0.0.1,localhost"
  export FTP_PROXY="ftp-gw.reith.bbc.co.uk:21"
  export ftp_proxy="ftp-gw.reith.bbc.co.uk:21"
  # Allows homebrew (and other things) to download via reith
  export ALL_PROXY=$HTTP_PROXY

  # Proxy settings for git
  # git config --global http.proxy $HTTP_PROXY

  # Enable ssh proxy
  # /usr/bin/sed -i ".bak" "s/\#\{0,1\}\(ProxyCommand nc\)\(.*$\)/\1\2/g" ~/.ssh/config
}

function proxy {
  if [[ "$1" == "" ]]
    then
    echo "Toggle bbc proxy for shell, git & ssh"
    echo "useage: proxy (on|off)"
  fi
  if [[ "$1" == "on" ]]
    then
    proxy_on
    echo "BBC proxy turned on"
  else
    proxy_off
    echo "BBC proxy turned off"
  fi
}

