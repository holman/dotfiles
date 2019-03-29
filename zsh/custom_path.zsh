# autojump
[ -f /usr/local/etc/profile.d/autojump.sh ] && . /usr/local/etc/profile.d/autojump.sh
# encoding
export PYTHONIOENCODING=UTF-8
export LC_ALL="en_US.UTF-8"
export LC_CTYPE="en_US.UTF-8"

# maven
export M2_HOME=/module/maven
export M2=$M2_HOME/bin
PATH=$M2:$PATH
# oracle client
export ORACLE_HOME=/opt/instantclient_12_1/
export DYLD_LIBRARY_PATH=$ORACLE_HOME
export PATH=ORACLE_HOME:$PATH
# pyenv
export PYENV_HOME=/Users/changxin/.pyenv
PATH=$PYENV_HOME/bin:$PATH

export PATH="/opt/geth1.8.1:/usr/local/opt/gettext/bin:$PATH"
export CLICOLOR=1
export LSCOLORS=ExFxBxDxCxegedabagacad

#export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-11.0.2.jdk/Contents/Home
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_201.jdk/Contents/Home
export PATH=${JAVA_HOME}/bin:${PATH}
export CASSANDRA_HOME=/module/apache-cassandra
export PATH=${CASSANDRA_HOME}/bin:${PATH}

if command -v pyenv 1>/dev/null 2>&1; then
  eval "$(pyenv init -)"
fi
eval "$(pyenv virtualenv-init -)"
