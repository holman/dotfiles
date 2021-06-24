# Set some common MacOS default aliasa on Linux
if test ! "$(uname)" = "Linux"
  then
  return
fi

alias pbcopy='xsel --clipboard --input'
alias pbpaste='xsel --clipboard --output'
