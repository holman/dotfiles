export JAVA_OPTS='-Xmx2048m -Dsun.lang.ClassLoader.allowArraySyntax=true'

export MAVEN_HOME="/usr/local/bin/mvn"
export MAVEN_OPTS='-Xmx2048m -XX:ReservedCodeCacheSize=128m -Dsun.lang.ClassLoader.allowArraySyntax=true'

export PATH="~/.rbenv/bin:~/bin:./bin:/usr/local:/usr/local/bin:/usr/local/sbin:$ZSH/bin:$PATH:$MAVEN_HOME:$JAVA_HOME"
eval "$(rbenv init -)"
