# useful openSSL functions (if openssl present)
#if (( ! $+commands[openssl] ))
#then
# return 0;
#fi

function aws_login() {

  [[ ! -d $OKTA_AWS_CLI_HOME ]] && echo "$OKTA_AWS_CLI_HOME doesn't exist, did you install the tools?" && return 255 

  # classpath is relative
  cd $OKTA_AWS_CLI_HOME/out
  ./awscli.command

  # once authenticated this will blow away changes to ~/.aws/config
  [[ -f $HOME/.aws/config.in ]] && cp $HOME/.aws/config.in $HOME/.aws/config && return 0

  echo "Did not find config.in, not restoring" 
}
