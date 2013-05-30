ANT_OPTS=-Xmx768m
ANT_HOME=$HOME/Dropbox/Dev/Java/ant
MAVEN_OPTS='-Xmx768m -noverify'
M2_HOME=/usr/share/maven
M2=$M2_HOME/bin
#JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.7.0_15.jdk/Contents/Home
JAVA_HOME=/Library/Java/JavaVirtualMachines/1.6.0_45-b06-451.jdk/Contents/Home
JAVA_OPTS=-Xmx512m

export PATH="$JAVA_HOME/bin:$ANT_HOME/bin:$PATH"